import { SemanticSearchConfig } from "../semanticSearchConfig";
import { TfBackendConfigKeys } from "../tfBackendConfig";
import { Deployable } from "./deployable";
import {S3Client, CreateBucketCommand} from "@aws-sdk/client-s3";


export const CreateStateBucket: Deployable = {} as Deployable;

CreateStateBucket.deploy = async (config: SemanticSearchConfig) => {
    return new Promise(async (resolve, reject) => {
        const s3Client = new S3Client({region: config.tfBackendConfig.get(TfBackendConfigKeys.region)});

        // TODO check if bucket already exists
   
        const createBucketCommand = new CreateBucketCommand({
            Bucket: config.tfBackendConfig.get(TfBackendConfigKeys.bucket)
        });
        const res =  await s3Client.send(createBucketCommand);
        // TODO error handling
        resolve();
    })
    

}

CreateStateBucket.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}

