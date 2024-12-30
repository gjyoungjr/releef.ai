import os
from pinecone import Pinecone, ServerlessSpec

# TODO: Add 'typing' to func args 

class PineconeClient:
    def __init__(self, api_key: str = None):
        # Accept api_key as an argument or fall back to the environment variable
        self.api_key = api_key or os.getenv('PINECONE_API_KEY')
        
        if not self.api_key:
            raise ValueError("API key must be provided either as an argument or through the PINECONE_API_KEY environment variable.")

        self.client = Pinecone(api_key=self.api_key)

    def list_indexes(self):
        return self.client.list_indexes()

    def create_index(self, name: str, dimension: int, metric: str, spec: ServerlessSpec):
        if name not in self.list_indexes().names():
            self.client.create_index(
                name=name, 
                dimension=dimension, 
                metric=metric, 
                spec=spec 
            )

    def get_index(self, name: str):
        return self.client.Index(name)
