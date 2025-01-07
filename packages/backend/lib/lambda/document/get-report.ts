import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const CORE_TABLE_NAME = process.env.CORE_TABLE_NAME;

// TODO: Add S3 to get presigned URL for report

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { userId, id: reportId } = event.queryStringParameters || {};

    if (!userId || !reportId) {
      return toHttpResponse(400, "User ID and Report ID are required.");
    }
    const key = marshall({
      PK: `USER#${userId}`,
      SK: `REPORT#${reportId}`,
    });

    const result = await ddbClient.send(
      new GetItemCommand({
        TableName: CORE_TABLE_NAME,
        Key: key,
      })
    );

    if (!result.Item) {
      return toHttpResponse(404, "Report not found.");
    }

    return toHttpResponse(200, {
      ...unmarshall(result.Item),
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return toHttpResponse(500, "Error getting report.");
  }
};

/**
 * Helper function to create a standard API Gateway response
 * @param {number} statusCode - HTTP status code
 * @param {string | object} body - Response body
 */
function toHttpResponse(statusCode: number, body: string | object) {
  return {
    statusCode,
    body: JSON.stringify(typeof body === "string" ? { message: body } : body),
  };
}
