import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const CORE_TABLE_NAME = process.env.CORE_TABLE_NAME;

// TODO: Build DynamoDB Adapter
// TODO: Build toHTTPResponse function
export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const expressionAttributeValues = marshall({
      ":PK": `USER#546844e8-4051-7062-1809-5b667e84c50e`,
      ":SK": "DOCUMENT#",
    });

    const result = await ddbClient.send(
      new QueryCommand({
        TableName: CORE_TABLE_NAME,
        KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
        ExpressionAttributeValues: expressionAttributeValues,
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
    console.error("Error fetching documents:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching documents",
      }),
    };
  }
};
