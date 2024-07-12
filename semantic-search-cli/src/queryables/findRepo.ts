import { sep } from "path";
import * as fs from "fs";
import { cwd } from "process";
import { Queryable } from "./queryable";
import { infrastructureFolderName, ingestionFolderName, semanticSearchRepoName } from "../repoConstants";
import { EnvironmentDefinition } from "./environmentDefinition";



export const FindRepo: Queryable = {} as Queryable;

FindRepo.query = async () => {
    return new Promise(async (resolve, reject) => {

        const dir = cwd();

       
        const areWeInRepoRoot = dir.endsWith(semanticSearchRepoName);


        if (!areWeInRepoRoot) {
            resolve({sourceRepoMissing: true, cwd: dir });
            return;
        } else {
            
            // check if git repository
            const infraPath = dir + sep + infrastructureFolderName;
            // check if infraPath is an existing folder
            const infraPathMissing = !await pathExists(infraPath);


            // TODO only check for ingestion if the solution is supposed to deploy ingestion and not custom document source

            const ingestPath = dir + sep + ingestionFolderName;
            // check if infraPath is an existing folder
            const ingestPathMissing = !await pathExists(ingestPath);

            resolve({sourceRepoMissing: infraPathMissing || ingestPathMissing, cwd: dir});
            return;
        }
        
    });

}

const pathExists = async (path: string) => {
    console.log("path exists:" + path);
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            await fs.promises.access(path);
            console.log("true");
            resolve(true);
        } catch (error) {
            console.error("error checking for path existence");
            // TODO error handling
        }
    })
}
