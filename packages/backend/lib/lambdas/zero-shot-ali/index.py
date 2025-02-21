import json
import os
from sentence_transformers import SentenceTransformer
import openai
from typing import List, Dict, Any

class ZeroShotALI:
    def __init__(self, openai_api_key: str, sentence_bert_model: str = "all-MiniLM-L6-v2"):
        """Initialize the ZeroShot ALI system
        
        Args:
            openai_api_key (str): OpenAI API key for GPT-4 access
            sentence_bert_model (str): SentenceBERT model to use for embeddings
        """
        self.sentencebert = SentenceTransformer(sentence_bert_model)
        openai.api_key = openai_api_key
        
    def process_document(self, document_text: str, requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process a document against a set of requirements
        
        Args:
            document_text (str): The text content of the document to analyze
            requirements (List[Dict[str, Any]]): List of requirements to check against
            
        Returns:
            List[Dict[str, Any]]: Matched segments with confidence scores
        """
        # Split document into segments (paragraphs)
        segments = [s.strip() for s in document_text.split('\n\n') if s.strip()]
        
        # Get embeddings for all segments and requirements
        segment_embeddings = self.sentencebert.encode(segments)
        requirement_embeddings = self.sentencebert.encode([r['text'] for r in requirements])
        
        matches = []
        for i, req in enumerate(requirements):
            # Find top matching segments for each requirement
            scores = segment_embeddings @ requirement_embeddings[i]
            top_indices = scores.argsort()[-3:][::-1]  # Get top 3 matches
            
            req_matches = []
            for idx in top_indices:
                if scores[idx] > 0.5:  # Only include if similarity score is above threshold
                    # Use GPT-4 to verify the match
                    verification = self._verify_match_with_gpt4(segments[idx], req['text'])
                    if verification['is_match']:
                        req_matches.append({
                            'segment_text': segments[idx],
                            'confidence_score': float(scores[idx]),
                            'gpt4_explanation': verification['explanation']
                        })
            
            matches.append({
                'requirement_id': req['id'],
                'requirement_text': req['text'],
                'matches': req_matches
            })
            
        return matches
    
    def _verify_match_with_gpt4(self, segment: str, requirement: str) -> Dict[str, Any]:
        """Use GPT-4 to verify if a segment truly matches a requirement
        
        Args:
            segment (str): The document segment to check
            requirement (str): The requirement text
            
        Returns:
            Dict[str, Any]: Verification result with explanation
        """
        prompt = f"""Analyze if the following document segment satisfies the given requirement:

Requirement: {requirement}

Document Segment: {segment}

Provide your analysis in JSON format with two fields:
1. is_match (boolean): true if the segment satisfies the requirement
2. explanation (string): brief explanation of why it matches or doesn't match

Response:"""

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in document analysis and compliance verification."},
                {"role": "user", "content": prompt}
            ]
        )
        
        try:
            return json.loads(response.choices[0].message.content)
        except:
            return {
                'is_match': False,
                'explanation': "Error processing GPT-4 response"
            }

def handler(event, context):
    """Lambda handler for ZeroShot ALI processing
    
    Expected event format:
    {
        "document_text": "...",
        "requirements": [
            {
                "id": "...",
                "text": "..."
            }
        ]
    }
    """
    try:
        # Initialize ZeroShot ALI with environment variables
        ali = ZeroShotALI(
            openai_api_key=os.environ['OPENAI_API_KEY'],
        )
        
        # Process document
        body = json.loads(event['body']) if isinstance(event.get('body'), str) else event.get('body', {})
        matches = ali.process_document(
            document_text=body['document_text'],
            requirements=body['requirements']
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'matches': matches
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }
