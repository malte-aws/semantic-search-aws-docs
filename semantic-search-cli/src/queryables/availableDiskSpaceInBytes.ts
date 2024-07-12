import { sep } from "path";
import * as fs from "fs";
import { cwd } from "process";
import { Queryable } from "./queryable";
import { infrastructureFolderName, ingestionFolderName, semanticSearchRepoName } from "../repoConstants";
import { EnvironmentDefinition } from "./environmentDefinition";
import checkDiskSpace from 'check-disk-space'



export const AvailableDiskSpaceInBytes: Queryable = {} as Queryable;

AvailableDiskSpaceInBytes.query = async () => {
    return new Promise(async (resolve, reject) => {

        const dir = cwd();
        const diskSpace = await checkDiskSpace(dir);
        resolve({availableDiskSpaceInBytes: diskSpace.free});
       
    });

}


export const availableDiskSpaceSufficient = (env: EnvironmentDefinition) => {
    return env.availableDiskSpaceInBytes >= 10737418240;
}