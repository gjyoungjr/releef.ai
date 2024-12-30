import * as cdk from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";
import { Function, FunctionProps } from "aws-cdk-lib/aws-lambda";
import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { NodeJSLambda } from "./node-lambda";
import { PythonLambda } from "./python-lambda";

/**
 * Properties for SqsLambdaIntegration.
 * @public
 */
export interface SqsLambdaIntegrationProps {
  /**
   * THe properties for the queue that will be integrated with the lambda.
   */
  sqsProps?: sqs.QueueProps;
  /**
   * The properties for the NodeJS lambda that will be integrated with the queue.
   */
  nodeJSLambdaProps?: NodejsFunctionProps;
  /**
   * The properties for the Python lambda that will be integrated with the queue.
   */
  pythonLambdaProps?: FunctionProps;
  /**
   * The maximum number of times a message can be received before being sent to the dead letter queue.
   */
  maxReceiveCount?: number;

  readonly eventSourceProps?: lambdaEventSources.SqsEventSourceProps;
}

/**
 * A custom construct for sqs and lambda integration.
 * @public
 */
export class SqsLambdaIntegration extends Construct {
  public readonly queue: sqs.Queue;
  public readonly dlq: sqs.Queue;
  public readonly handler: Function;

  constructor(scope: Construct, id: string, props: SqsLambdaIntegrationProps) {
    super(scope, id);

    const {
      sqsProps,
      nodeJSLambdaProps: lambdaProps,
      pythonLambdaProps,
      maxReceiveCount = 2,
      eventSourceProps,
    } = props;

    this.dlq = new sqs.Queue(scope, `${id}DLQ`, {
      retentionPeriod: cdk.Duration.days(14),
    });

    // SQS Queue
    this.queue = new sqs.Queue(scope, `${id}Queue`, {
      retentionPeriod: cdk.Duration.days(14),
      ...sqsProps,
      deadLetterQueue: {
        maxReceiveCount,
        queue: this.dlq,
      },
    });

    // Lambda Handler
    if (pythonLambdaProps && pythonLambdaProps.handler) {
      this.handler = new PythonLambda(scope, `${id}Handler`, {
        ...pythonLambdaProps,
      });
    } else {
      this.handler = new NodeJSLambda(scope, `${id}Handler`, {
        ...lambdaProps,
      });
    }

    // Configure the queue as a trigger for the Lambda function
    this.handler.addEventSource(
      new lambdaEventSources.SqsEventSource(this.queue, {
        ...eventSourceProps,
      })
    );
  }
}
