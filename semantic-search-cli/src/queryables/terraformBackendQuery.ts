import { sep } from "path";
import * as fs from "fs";
import { cwd } from "process";
import { Queryable } from "./queryable";
import { infrastructureFolderName, ingestionFolderName, semanticSearchRepoName, tfBackendConfigFileName } from "../repoConstants";
import { EnvironmentDefinition } from "./environmentDefinition";
import checkDiskSpace from 'check-disk-space'
import * as request from "request"
import { promisify } from "util";
import { EOL } from "os";
import { TfBackendConfig, TfBackendConfigKeys, defaultTfBackendConfig } from "../tfBackendConfig";
import { getInfrastructureTfConfigPath } from "../deployables/terraform";
import { getInfrastructureTfBackendConfig } from "../util/terraformUtilities";

export const TerraformBackendQuery: Queryable = {} as Queryable;

TerraformBackendQuery.query = async () => {
    return new Promise(async (resolve, reject) => {
        const tfBackendConfigPath = getInfrastructureTfConfigPath(cwd());
        // check if config.s3.tfbackend file exists
        const configFileExists = fs.existsSync(tfBackendConfigPath);
        if(configFileExists) {
            // if backend config file exists then read it
            const existingTfBackendConfig = await getInfrastructureTfBackendConfig(cwd());
            

            resolve({existingInfrastructureTfBackendConfig: existingTfBackendConfig})
            
        } else {
            resolve({existingInfrastructureTfBackendConfig: new Map()})
        }
    });

}




