import { Construct } from "constructs";
import { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

/**
 * Properties for lambda.
 */
interface NodeJsLambdaProps extends NodejsFunctionProps {}

/**
 * A common construct for a basic NodeJS generic lambda.
 * @public
 */
export class NodeJSLambda extends NodejsFunction {
  /**
   * A common construct for a basic generic lambda with defaults.
   * @param scope - A CDK Construct.
   * @param id - The Lamba CDK id.
   * @param props - The Lambda props.
   */

  constructor(scope: Construct, id: string, props: NodeJsLambdaProps) {
    super(scope, id, {
      ...props,
    });
  }
}
