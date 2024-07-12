import { SemanticSearchConfig } from "../semanticSearchConfig";
import { TfBackendConfigKeys } from "../tfBackendConfig";
import { Deployable } from "./deployable";
import {DynamoDBClient, CreateTableCommand} from "@aws-sdk/client-dynamodb";

export const CreateSyncTable: Deployable = {} as Deployable;

CreateSyncTable.deploy = async (config: SemanticSearchConfig) => {
    return new Promise(async (resolve, reject) => {
        const dynamoDbClient = new DynamoDBClient({region: config.tfBackendConfig.get(TfBackendConfigKeys.region)});

        // TODO check if syncTable already exists
   
        const createTableCommand = new CreateTableCommand({
            TableName: config.tfBackendConfig.get(TfBackendConfigKeys.dynamodb_table),
            BillingMode: "PAY_PER_REQUEST",
            AttributeDefinitions: [
                {
                    AttributeName: "LockID",
                    AttributeType: "S"
                }
            ],
            KeySchema: [
                {
                    AttributeName: "LockID",
                    KeyType: "HASH"
                }
            ]
        });
        const res =  await dynamoDbClient.send(createTableCommand);
        // TODO error handling
        resolve();
    })
    

}

CreateSyncTable.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}

