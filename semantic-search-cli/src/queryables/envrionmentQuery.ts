import { sep } from "path";
import * as fs from "fs";
import { cwd } from "process";
import { Queryable } from "./queryable";
import { infrastructureFolderName, ingestionFolderName, semanticSearchRepoName } from "../repoConstants";
import { EnvironmentDefinition } from "./environmentDefinition";
import { FindRepo } from "./findRepo";
import { IsRunningOnEC2 } from "./isRunningOnEC2";
import { TerraformBackendQuery } from "./terraformBackendQuery";
import { AvailableDiskSpaceInBytes } from "./availableDiskSpaceInBytes";



export const EnvironmentQuery: Queryable = {} as Queryable;

const queries = [FindRepo, IsRunningOnEC2, TerraformBackendQuery, AvailableDiskSpaceInBytes]

EnvironmentQuery.query = async () => {
    const env = {} as EnvironmentDefinition;
    const queryPromises = queries.map(query => query.query());
    const results = await Promise.all(queryPromises);
    return Object.assign(env, ...results);
}
