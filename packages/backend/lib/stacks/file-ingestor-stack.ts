import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as dotenv from "dotenv";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sns_subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { CoreStackProps } from "../../environment";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodeJSLambda } from "../constructs";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";
import { Runtime } from "aws-cdk-lib/aws-lambda";

dotenv.config();

const TIMEOUT_IN_MINUTES = 15; // max default timeout for lambda functions

interface FileIngestorStackProps extends CoreStackProps {
  coreTable: Table;
}
export class FileIngestorStack extends cdk.Stack {
  public filesBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: FileIngestorStackProps) {
    super(scope, id, props);

    const fileIngestTopic = new sns.Topic(this, "FileIngestTopic");

    // Files Bucket
    this.filesBucket = new s3.Bucket(this, "Bucket", {
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    const storeReportQueue = new sqs.Queue(this, "StoreReportQueue", {
      visibilityTimeout: cdk.Duration.minutes(TIMEOUT_IN_MINUTES), // Match the Lambda timeout to avoid message being reprocessed
      retentionPeriod: cdk.Duration.days(4), // Messages are retained for 4 days if not processed
    });

    const embedDocQueue = new sqs.Queue(this, "EmbedDocQueue", {
      visibilityTimeout: cdk.Duration.minutes(TIMEOUT_IN_MINUTES), // Match the Lambda timeout to avoid message being reprocessed
      retentionPeriod: cdk.Duration.days(4), // Messages are retained for 4 days if not processed
    });

    fileIngestTopic.addSubscription(
      new sns_subscriptions.SqsSubscription(storeReportQueue)
    );
    fileIngestTopic.addSubscription(
      new sns_subscriptions.SqsSubscription(embedDocQueue)
    );

    this.filesBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.SnsDestination(fileIngestTopic)
    );

    const storeReport = new NodeJSLambda(this, "StoreReport", {
      entry: `lib/lambda/document/store-report.ts`,
      description: "Stores report.",
      environment: {
        CORE_TABLE_NAME: props.coreTable.tableName,
      },
    });

    // const storeDocMetadata = new PythonFunction(this, "StoreDocMetadata", {
    //   entry: `lib/lambda/document/store-doc-metadata`,
    //   index: "main.py",
    //   runtime: Runtime.PYTHON_3_9,
    //   description: "Stores document metadata.",
    //   timeout: cdk.Duration.minutes(TIMEOUT_IN_MINUTES),
    //   bundling: {
    //     // translates to `rsync --exclude='.venv'`
    //     assetExcludes: [".venv"],
    //   },
    //   environment: {
    //     CORE_TABLE_NAME: props.coreTable.tableName,
    //   },
    // });

    const embedDocument = new PythonFunction(this, "EmbedDocument", {
      entry: `lib/lambda/document/embed-doc`,
      index: "main.py",
      runtime: Runtime.PYTHON_3_9,
      description: "Embed document.",
      timeout: cdk.Duration.minutes(TIMEOUT_IN_MINUTES),
      bundling: {
        // translates to `rsync --exclude='.venv'`
        assetExcludes: [".venv"],
      },
      environment: {
        PINECONE_API_KEY: process.env.PINECONE_API_KEY!,
        PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME!,
        CORE_TABLE_NAME: props.coreTable.tableName,
      },
    });

    props.coreTable.grantReadWriteData(storeReport);
    this.filesBucket.grantReadWrite(storeReport);
    this.filesBucket.grantReadWrite(embedDocument);

    storeReport.addEventSource(new SqsEventSource(storeReportQueue));
    embedDocument.addEventSource(new SqsEventSource(embedDocQueue));
  }
}
