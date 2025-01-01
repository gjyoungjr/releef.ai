import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const CORE_TABLE_NAME = process.env.CORE_TABLE_NAME;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body || "{}");

    // Validate required fields
    if (!requestBody.id || !requestBody.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields: userId or name",
        }),
      };
    }

    const dateCreated = new Date().toISOString();
    const userItem = {
      PK: `USER#${requestBody.id}`,
      SK: `USER#${requestBody.id}`,
      email: requestBody.email,
      name: requestBody.name,
      gsi1PK: `USER_BY_EMAIL#${requestBody.email}`,
      gsi1SK: `USER_BY_DATE_CREATED#${dateCreated}`,
      salt: requestBody.salt,
      hashedPassword: requestBody.hashedPassword,
      type: "USER",
      id: requestBody.id,
      version: 1,
    };

    await ddbClient.send(
      new PutItemCommand({
        TableName: CORE_TABLE_NAME,
        Item: marshall(userItem),
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
      }),
    };
  } catch (error) {
    console.error("Error saving user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error saving user",
      }),
    };
  }
};
