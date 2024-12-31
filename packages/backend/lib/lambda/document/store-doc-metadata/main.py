import json
import boto3
import os
import uuid
from datetime import datetime
import logging
from typing import Dict, Any

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

s3 = boto3.client('s3')
ddb = boto3.resource('dynamodb')

CORE_TABLE = os.getenv('CORE_TABLE_NAME')

def store_document_metadata(table_name: str, document_id: str, document_s3_key: str) -> Dict[str, Any]:
    """
    Store metadata about a document in a DynamoDB table.

    :param table_name: The name of the DynamoDB table.
    :param document_id: Unique identifier for the document.
    :param document_s3_key: S3 key for the document.
    :return: Response from DynamoDB put_item operation.
    """
    table = ddb.Table(table_name)
    user_id, document_name = document_s3_key.split('/', 1)

    response = table.put_item(
        Item={
            "PK": f'USER#{user_id}',
            "SK": f'DOCUMENT#{document_id}',
            "type": "DOCUMENT",
            "dateCreated": datetime.now().isoformat(),
            "s3Key": document_s3_key,
            "name": document_name.split('.')[0] #TODO: split to remove file extension
        }
    )
    
    return response

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda function handler to process S3 events.

    :param event: The event data passed to the Lambda function.
    :param context: The context object passed to the Lambda function.
    :return: Response dictionary with status code and message.
    """
    try:
        print(f"Event: {event}")
        for record in event['Records']:
            sns_message = json.loads(record['body'])
            sns_message_body = json.loads(sns_message['Message'])
            s3_event_records = sns_message_body.get('Records', [])
            
            for s3_event in s3_event_records:
                object_key = s3_event['s3']['object']['key']
                
                store_document_metadata(
                    table_name=CORE_TABLE, 
                    document_id=str(uuid.uuid4()), 
                    document_s3_key=object_key
                )

        return {
            'statusCode': 200,
            'body': json.dumps('S3 events processed successfully')
        }
        
    except Exception as e:
        logger.error("Error processing the event", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Error processing the event',
                'errorMessage': str(e)
            })
        }
