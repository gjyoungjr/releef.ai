/**
 * A base DynamoDB record.
 */
interface DDBRecord {
  readonly PK: string;
  readonly SK: string;
  readonly gsi1PK?: string;
  readonly gsi1SK?: string;
  readonly dateCreated: string;
  readonly dateUpdated?: string;
  readonly version: number;
  readonly type: string;
}

/**
 * A User record.
 */
export interface User extends DDBRecord {
  readonly email: string;
  readonly name: string;
  readonly salt: string;
  readonly hashedPassword: string;
  readonly id: string;
}

/**
 * A report record.
 */
export interface Report extends DDBRecord {
  readonly title: string;
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string;
    }
>;

export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AuthResult {
  type: string;
  message: string;
}
