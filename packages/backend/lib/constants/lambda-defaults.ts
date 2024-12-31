import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export const DEFAULT_LAMBDA_MEMORY_MB = 1024;
export const DEFAULT_LAMBDA_TIMEOUT_MINS = 15;

/**
 * Default NodeJS lambda properties.
 */
export const nodeJsFunctionProps: NodejsFunctionProps = {
  runtime: Runtime.NODEJS_18_X,
  memorySize: DEFAULT_LAMBDA_MEMORY_MB,
  timeout: Duration.minutes(DEFAULT_LAMBDA_TIMEOUT_MINS),
  bundling: {
    minify: true, // minify code, defaults to false
    sourceMap: true, // include source map, defaults to false
    sourcesContent: false, // do not include original source into source map, defaults to true
    target: "es2020", // target environment for the generated JavaScript code
    externalModules: ["aws-sdk"],
  },
};
