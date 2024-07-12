import { exec } from "child_process";
import { promisify } from "util";
import { Deployable } from "./deployable";
import { SemanticSearchConfig } from "../semanticSearchConfig";
import { TfBackendConfig, TfBackendConfigKeys } from "../tfBackendConfig";
import { EnvironmentDefinition } from "../queryables/environmentDefinition";
import * as fs from "fs";
import { infrastructureFolderName, tfBackendConfigFileName } from "../repoConstants";
import { sep } from "path";
import { getInfrastructureTfBackendConfigAll } from "../util/terraformUtilities";
import { EOL } from "os";


const promisifiedExec = promisify(exec);


const terraformApply = async (infrastructureRegion?: string, infrasturctureTfStateS3BucketName?: string): Promise<void> => {
    return new Promise((resolve, reject) => {

        const cmd = `terraform apply -auto-approve${infrastructureRegion ? ` -var="region=${infrastructureRegion}"` : ''}${infrasturctureTfStateS3BucketName ? ` -var="infra_tf_state_s3_bucket=${infrasturctureTfStateS3BucketName}"` : ''} `;
        const cmdExec = promisifiedExec(cmd);

        cmdExec.then((result) => {
            console.log(result.stdout);
            console.error(result.stderr);
            resolve();
        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    });
}

export const TerraformApplySemanticSearchInfrastructure: Deployable = {} as Deployable;

TerraformApplySemanticSearchInfrastructure.deploy = async (config: SemanticSearchConfig) => {
    return terraformApply();    
}

TerraformApplySemanticSearchInfrastructure.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}


export const TerraformApplySemanticSearchIngestion: Deployable = {} as Deployable;

TerraformApplySemanticSearchIngestion.deploy = async (config: SemanticSearchConfig) => {
    return terraformApply(config.tfBackendConfig.get(TfBackendConfigKeys.region), config.tfBackendConfig.get(TfBackendConfigKeys.bucket));    
}

TerraformApplySemanticSearchIngestion.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}


export const TerraformInitSemanticSearchInfrastructure: Deployable = {} as Deployable;


TerraformInitSemanticSearchInfrastructure.deploy = async (config: SemanticSearchConfig, env: EnvironmentDefinition) => {
    return terraformInit(config, env, getInfrastructureTfConfigPath(env.cwd));
}

TerraformInitSemanticSearchInfrastructure.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}


export const TerraformInitSemanticSearchIngestion: Deployable = {} as Deployable;


TerraformInitSemanticSearchIngestion.deploy = async (config: SemanticSearchConfig, env: EnvironmentDefinition) => {
    return terraformInit(config, env);
}

TerraformInitSemanticSearchIngestion.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}


const terraformInit = async (config: SemanticSearchConfig, env: EnvironmentDefinition, tfBackendConfigPath?: string) => {
    return new Promise<void>(async (resolve, reject) => {
        if(tfBackendConfigPath && needToWriteNewTfBackendConfig(config, env)) {
                await storeNewTfBackendConfig(config, env, tfBackendConfigPath)
        }
        
        const cmd = `terraform init`;
        const cmdExec = promisifiedExec(cmd);
        cmdExec.then((result) => {
           console.log(result.stdout);
           console.error(result.stderr);
           resolve();
        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    })
    

}



const needToWriteNewTfBackendConfig = (config: SemanticSearchConfig, env: EnvironmentDefinition) => {
    const hasExistingTfBackendConfig = env.existingInfrastructureTfBackendConfig && env.existingInfrastructureTfBackendConfig.size > 0;
    if(!hasExistingTfBackendConfig) {
        return false;
    }
    const newConfigIsDifferentFromOldConfig = !isEqual(env.existingInfrastructureTfBackendConfig, config.tfBackendConfig);
   return newConfigIsDifferentFromOldConfig;
}

const storeNewTfBackendConfig = async (config: SemanticSearchConfig, env: EnvironmentDefinition, tfBackendConfigFilePath: string) => {
    const currentBackendConfigLines = await getInfrastructureTfBackendConfigAll(tfBackendConfigFilePath);
    config.tfBackendConfig.forEach((value, key) => {
        currentBackendConfigLines.set(key, value);
    });
    const configText = Array.from(
        currentBackendConfigLines.entries()).reduce<string>((previous, current) => previous + `${current[0]}=${current[1]}${EOL}`, "");
    return fs.promises.writeFile(tfBackendConfigFilePath, configText);
}

export const getInfrastructureTfConfigPath = (cwd: string) => cwd + infrastructureFolderName + sep + tfBackendConfigFileName;

const isEqual = (tfBackendConfig: TfBackendConfig, otherBackendConfig: TfBackendConfig) => {
    if (tfBackendConfig.size !== otherBackendConfig.size) {
        return false;
    }
    for(const [key, value] of tfBackendConfig) {
        if(!otherBackendConfig.has(key) || value !== otherBackendConfig.get(key) ) {
            return false;
        }
    }
    return true;
}