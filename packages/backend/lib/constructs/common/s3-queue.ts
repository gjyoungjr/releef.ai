import { Duration } from "aws-cdk-lib";
import { FilterOrPolicy, Topic } from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { SqsLambdaIntegrationProps, SqsLambdaIntegration } from "./sqs-lambda";

/**
 * Props for the S3Queue.
 */
export interface S3QueueProps {
  readonly snsTopic: Topic;
  readonly workerProps?: SqsLambdaIntegrationProps;
  readonly filterPolicy?: {
    [attribute: string]: FilterOrPolicy;
  };
}

/**
 * A construct that generates an S3 and SQS integration.
 * @alpha
 */
export class S3Queue extends Construct {
  public readonly worker: SqsLambdaIntegration;

  public constructor(scope: Construct, id: string, props: S3QueueProps) {
    super(scope, id);

    const { snsTopic, workerProps, filterPolicy } = props;

    this.worker = new SqsLambdaIntegration(this, "Worker", {
      ...workerProps,
    });

    const topicDlq = new Queue(this, "TopicDlq", {
      retentionPeriod: Duration.days(14),
    });
    snsTopic.addSubscription(
      new SqsSubscription(this.worker.queue, {
        filterPolicyWithMessageBody: filterPolicy,
        deadLetterQueue: topicDlq,
      })
    );
  }
}
