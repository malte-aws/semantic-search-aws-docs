
export type TfBackendConfig = Map<TfBackendConfigKeys, string>;

export enum TfBackendConfigKeys {
    bucket = "bucket",
    region = "region",
    dynamodb_table = "dynamodb_table"
}

export const defaultTfBackendConfig: TfBackendConfig = new Map([
   [ TfBackendConfigKeys.bucket , `tf-semantic-search-state-${Date.now()}`],
   [ TfBackendConfigKeys.region , "us-east-1"],
   [ TfBackendConfigKeys.dynamodb_table , "tf-semantic-search-state-sync"]

]);