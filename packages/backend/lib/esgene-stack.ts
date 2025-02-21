import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Construct } from 'constructs';
import * as path from 'path';

export class EsgeneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the ZeroShot ALI Lambda function
    const zeroShotAliLambda = new PythonFunction(this, 'ZeroShotAliFunction', {
      entry: path.join(__dirname, 'lambdas/zero-shot-ali'),
      runtime: lambda.Runtime.PYTHON_3_9,
      index: 'index.py',
      handler: 'handler',
      timeout: cdk.Duration.minutes(5),
      memorySize: 2048,
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      },
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'EsgeneApi', {
      restApiName: 'Esgene Service',
      description: 'API for ESG document analysis',
    });

    // Add ZeroShot ALI endpoint
    const zeroShotAli = api.root.addResource('analyze');
    const zeroShotAliIntegration = new apigateway.LambdaIntegration(zeroShotAliLambda);
    zeroShotAli.addMethod('POST', zeroShotAliIntegration);

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}
