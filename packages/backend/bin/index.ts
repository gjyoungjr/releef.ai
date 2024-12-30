#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FileIngestorStack, CoreApiStack, CoreTableStack } from "../lib/stacks";
import { getEnvironmentConfig, CoreEnvironmentConfig } from "../environment";

const service = "rekha";
const app = new cdk.App();
const envConfig: CoreEnvironmentConfig = getEnvironmentConfig();
const env: cdk.Environment = envConfig.env;

console.log(envConfig);

const { coreTable } = new CoreTableStack(app, "CoreTable", {
  env,
  envConfig,
  stackName: "CoreTable",
  tags: {
    Name: service,
  },
});

const { filesBucket } = new FileIngestorStack(app, "FileIngestorStack", {
  env,
  envConfig,
  stackName: "FileIngestor",
  description:
    "Service to ingest files (pdf, images, csv, etc) into the system.",
  tags: {
    Name: service,
  },
  coreTable,
});

const coreApi = new CoreApiStack(app, "CoreApi", {
  env,
  envConfig,
  stackName: "CoreApi",
  tags: {
    Name: service,
  },
  coreTable,
});
