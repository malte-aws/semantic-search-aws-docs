import { cloud9FolderName, cloud9ResizeScriptName } from "../repoConstants";
import { SemanticSearchConfig } from "../semanticSearchConfig";
import { Deployable } from "./deployable";
import {exec} from "child_process";
import {promisify} from "util";
import { sep } from "path";

const promisifiedExec = promisify(exec);

const requiredStorageGB = 20;

export const ResizeCloud9Storage: Deployable = {} as Deployable;

ResizeCloud9Storage.deploy = async (config: SemanticSearchConfig) => {
    return new Promise((resolve, reject) => {
        const cmd = "bash " + cloud9FolderName + sep + cloud9ResizeScriptName + " " + requiredStorageGB;
        const cmdExec = promisifiedExec(cmd);
        cmdExec.then((result) => {
            console.log(result.stdout);
            console.error(result.stderr); // TODO error handling
            resolve();
        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    });
}

ResizeCloud9Storage.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}



