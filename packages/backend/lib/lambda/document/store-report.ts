import {
  S3Event,
  SNSMessage,
  SQSHandler,
  SQSBatchItemFailure,
  S3EventRecord,
} from "aws-lambda";
import { Report } from "@releef.ai/types";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const CORE_TABLE_NAME = process.env.CORE_TABLE_NAME;

const storeReport = async (event: S3EventRecord) => {
  const userId = event.s3.object.key.split("/")[0];
  const fileName = event.s3.object.key.split("/")[1].replace(/\s+/g, "_");

  const record: Report = {
    PK: `USER#${userId}`,
    SK: `REPORT#${uuidv4()}`,
    dateCreated: new Date().toISOString(),
    type: "REPORT",
    version: 1,
    title: fileName,
  };

  await ddbClient.send(
    new PutItemCommand({
      TableName: CORE_TABLE_NAME,
      Item: marshall(record),
    })
  );
};
export const handler: SQSHandler = async (event) => {
  try {
    const batchItemFailures: SQSBatchItemFailure[] = [];

    const result = await Promise.allSettled(
      event.Records.map(async (record) => {
        const { body } = record;
        const snsMessage = JSON.parse(body) as SNSMessage;
        const { Records } = JSON.parse(
          snsMessage.Message
        ) as unknown as S3Event;

        const promises = Records.map(
          async (record) => await storeReport(record)
        );
        return await Promise.all(promises);
      })
    );

    console.log("Result", result);

    // Check for any failed promises and log them
    result.map((promiseResult, index) => {
      if (promiseResult.status === "rejected") {
        console.error(
          `Failed to process message ${event.Records[index].messageId}: ${promiseResult.reason}`
        );
        batchItemFailures.push({
          itemIdentifier: event.Records[index].messageId,
        });
      }
    });

    return { batchItemFailures };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
