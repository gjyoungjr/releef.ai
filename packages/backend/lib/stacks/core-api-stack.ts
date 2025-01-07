import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import { CoreStackProps } from "../../environment";
import { NodeJSLambda } from "../constructs";
import { nodeJsFunctionProps } from "../constants";
import { Table } from "aws-cdk-lib/aws-dynamodb";

interface CoreApiStackProps extends CoreStackProps {
  coreTable: Table;
}
export class CoreApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CoreApiStackProps) {
    super(scope, id, props);

    // API Gateway
    const httpApi = new apigw.HttpApi(this, "CoreApi", {
      corsPreflight: {
        allowHeaders: [
          "Authorization",
          "Content-Type",
          "X-Amz-Date",
          "X-Api-Key",
        ],
        allowMethods: [
          apigw.CorsHttpMethod.OPTIONS,
          apigw.CorsHttpMethod.GET,
          apigw.CorsHttpMethod.POST,
          apigw.CorsHttpMethod.PUT,
          apigw.CorsHttpMethod.PATCH,
          apigw.CorsHttpMethod.DELETE,
        ],
        allowOrigins: ["*"],
      },
    });

    // Lambda function to handle the new API path
    const listReports = new NodeJSLambda(this, "ListReports", {
      entry: `lib/lambda/document/list-report.ts`,
      description: "List all reports for a user.",
      ...nodeJsFunctionProps,
      environment: {
        CORE_TABLE_NAME: props.coreTable.tableName,
      },
    });
    props.coreTable.grantReadData(listReports);

    const getReport = new NodeJSLambda(this, "GetReport", {
      entry: `lib/lambda/document/get-report.ts`,
      description: "Get a single report.",
      ...nodeJsFunctionProps,
      environment: {
        CORE_TABLE_NAME: props.coreTable.tableName,
      },
    });
    props.coreTable.grantReadData(getReport);

    const getUser = new NodeJSLambda(this, "GetUser", {
      entry: `lib/lambda/auth/get-user.ts`,
      description: "Get a user.",
      ...nodeJsFunctionProps,
      environment: {
        CORE_TABLE_NAME: props.coreTable.tableName,
      },
    });
    props.coreTable.grantReadData(getUser);

    const saveUser = new NodeJSLambda(this, "SaveUser", {
      entry: `lib/lambda/auth/save-user.ts`,
      description: "Save a user.",
      ...nodeJsFunctionProps,
      environment: {
        CORE_TABLE_NAME: props.coreTable.tableName,
      },
    });
    props.coreTable.grantWriteData(saveUser);

    httpApi.addRoutes({
      path: "/report",
      methods: [apigw.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "ListReportsIntegration",
        listReports
      ),
    });
    httpApi.addRoutes({
      path: "/report/{id}",
      methods: [apigw.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "GetReportIntegration",
        getReport
      ),
    });

    httpApi.addRoutes({
      path: "/user/{userId}", // TODO: Fix path parameter
      methods: [apigw.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "GetUserIntegration",
        getUser
      ),
    });

    httpApi.addRoutes({
      path: "/user",
      methods: [apigw.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "SaveUserIntegration",
        saveUser
      ),
    });
  }
}
