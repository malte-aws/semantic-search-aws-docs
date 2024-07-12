import { sep } from "path";
import * as fs from "fs";
import { cwd } from "process";
import { Queryable } from "./queryable";
import { infrastructureFolderName, ingestionFolderName, semanticSearchRepoName } from "../repoConstants";
import { EnvironmentDefinition } from "./environmentDefinition";
import checkDiskSpace from 'check-disk-space'
import * as request from "request"


export const IsRunningOnEC2: Queryable = {} as Queryable;

IsRunningOnEC2.query = async () => {
    return new Promise(async (resolve, reject) => {
        
         const metadataTokenResponse = await request.put('http://169.254.169.254/latest/api/token', {"headers": {'X-aws-ec2-metadata-token-ttl-seconds': '60'}});
         console.dir(metadataTokenResponse)
         console.dir(metadataTokenResponse.body);
          // TODO
       resolve({});
    });

}



