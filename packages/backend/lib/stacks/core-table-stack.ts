import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { CoreStackProps } from "../../environment";

interface CoreTableStackProps extends CoreStackProps {}
export class CoreTableStack extends cdk.Stack {
  public coreTable: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: CoreTableStackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    this.coreTable = new dynamodb.Table(this, "CoreTable", {
      partitionKey: { name: "PK", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "SK", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // PAY_PER_REQUEST or PROVISIONED
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Not recommended for production
    });

    // gsi1
    this.coreTable.addGlobalSecondaryIndex({
      indexName: "gsi1",
      partitionKey: {
        name: "gsi1PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "gsi1SK",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
