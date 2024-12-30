import { Construct } from "constructs";
import { FunctionProps, Function } from "aws-cdk-lib/aws-lambda";

/**
 * Properties for Python lambda.
 */
interface PythonLambdaProps extends FunctionProps {}

/**
 * A common construct for a basic NodeJS generic lambda.
 * @public
 */
export class PythonLambda extends Function {
  /**
   * A common construct for a basic generic lambda with defaults.
   * @param scope - A CDK Construct.
   * @param id - The Lamba CDK id.
   * @param props - The Lambda props.
   */

  constructor(scope: Construct, id: string, props: PythonLambdaProps) {
    super(scope, id, {
      ...props,
    });
  }
}
