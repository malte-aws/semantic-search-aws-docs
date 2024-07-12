import { EOL } from "os";
import { getInfrastructureTfConfigPath } from "../deployables/terraform";
import * as fs from "fs";
import { TfBackendConfigKeys } from "../tfBackendConfig";
import { filter } from "lodash";


export const getInfrastructureTfBackendConfigAll = async (tfBackendConfigPath: string) => {

    const backendConfigFileContent = await fs.promises.readFile(tfBackendConfigPath);
    const lines = backendConfigFileContent.toString().split(EOL);
    const existingTfBackendConfig = new Map<string, string>();
    lines.forEach(line => {
        const lineSplit = line.split("=");
        const key = lineSplit[0].trim().replace(/["]/g, "");
        const value = lineSplit[1].trim().replace(/["]/g, "");
        existingTfBackendConfig.set(key, value);
    });
    return existingTfBackendConfig;
}


export const getInfrastructureTfBackendConfig =async (tfBackendConfigPath:string): Promise<Map<TfBackendConfigKeys, string>> => {
    const allConfig = await getInfrastructureTfBackendConfigAll(tfBackendConfigPath);
    const keys: string[] = Object.values(TfBackendConfigKeys);
    const filteredMap = new Map<TfBackendConfigKeys, string>();
    allConfig.forEach((value, key) => {
        if(keys.includes(key)) {
            filteredMap.set(key as TfBackendConfigKeys, value);
        }
    });
    return filteredMap;
}