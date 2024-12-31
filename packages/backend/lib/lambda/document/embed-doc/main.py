import json
import boto3
import fitz

s3 = boto3.client('s3')

def handler(event, context):
    try:
        for record in event['Records']:
            sns_message = json.loads(record['body'])
            sns_message_body = json.loads(sns_message['Message'])
            s3_event_records = sns_message_body.get('Records', [])
            

            for s3_event in s3_event_records:
                bucket_name = s3_event['s3']['bucket']['name']
                object_key = s3_event['s3']['object']['key']
                
                response = s3.get_object(Bucket=bucket_name, Key=object_key)
                file_stream = response['Body'].read()
                
                # Open the PDF document with PyMuPDF (fitz)
                doc = fitz.open(stream=file_stream, filetype="pdf")
                
                # Extract and print text from each page
                for page in doc:
                    text = page.get_text().encode("utf8").decode("utf8")
                    print(text)
                
        return {
            'statusCode': 200,
            'body': json.dumps('Embed doc!')
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps('Internal Server Error')
        }
