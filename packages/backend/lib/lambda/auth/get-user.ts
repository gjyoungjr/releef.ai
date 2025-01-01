import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const CORE_TABLE_NAME = process.env.CORE_TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const email = event.queryStringParameters?.userId; // TODO: Fix path parameter

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required parameter: email" }),
      };
    }

    const result = await ddbClient.send(
      new QueryCommand({
        TableName: CORE_TABLE_NAME,
        IndexName: "gsi1",
        KeyConditionExpression: "gsi1PK = :gsi1PK",
        ExpressionAttributeValues: marshall({
          ":gsi1PK": `USER_BY_EMAIL#${email}`,
        }),
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        count: result.Count,
        items: result.Items && result.Items.map((item) => unmarshall(item)),
        lastEvaluatedKey: result.LastEvaluatedKey,
        scannedCount: result.ScannedCount || 0,
      }),
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error getting user",
      }),
    };
  }
};
