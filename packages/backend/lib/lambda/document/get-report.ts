import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

// Initialize the DynamoDB client and table name
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const CORE_TABLE_NAME = process.env.CORE_TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Extract query parameters
  const { userId, id: reportId } = event.queryStringParameters || {};

  // Validate required parameters
  if (!userId || !reportId) {
    return toHttpResponse(400, "User ID and Report ID are required.");
  }

  try {
    // Create the key for the GetItem request
    const key = marshall({
      PK: `USER#${userId}`,
      SK: `REPORT#${reportId}`,
    });

    // Fetch the item from DynamoDB
    const result = await ddbClient.send(
      new GetItemCommand({
        TableName: CORE_TABLE_NAME,
        Key: key,
      })
    );

    // Check if the item exists
    if (!result.Item) {
      return toHttpResponse(404, "Report not found.");
    }

    // Return the fetched item
    return toHttpResponse(200, {
      report: unmarshall(result.Item),
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
