import { SemanticSearchConfig } from "../semanticSearchConfig";
import { Deployable } from "./deployable";
import { promisify } from "util";
import { sep } from "path";
import * as fs from "fs";
import * as https from "https";
import { cwd } from "process";
import * as tar from "tar";
import { EnvironmentDefinition } from "../queryables/environmentDefinition";
import { semanticSearchRepoName } from "../repoConstants";




const promisifiedMkdir = promisify(fs.mkdir);
const promisifiedRm = promisify(fs.rm);




export const DownloadRepo: Deployable = {} as Deployable;

DownloadRepo.deploy = async (config: SemanticSearchConfig, env: EnvironmentDefinition) => {

   

    const destDir = env.cwd;

    if (!fs.existsSync(destDir)) {
        await promisifiedMkdir(destDir);
    }
    return downloadRepo(destDir);
}

DownloadRepo.destroy = (config: SemanticSearchConfig, env: EnvironmentDefinition) => {
    // TODO
    throw new Error("Method not implemented.");
}


const downloadRepo = async (destPath: string) => {
    console.log("DEST_PATH:" + destPath);
    const zipPath = await downloadZipRepo();
    await unzipRepo(zipPath, destPath);
    return promisifiedRm(zipPath);
}


const downloadZipRepo = async (): Promise<string> => {
    return new Promise(async (resolve, reject) => {

        const zipFolderName = semanticSearchRepoName + ".tar";

        // const url = "https://api.github.com/repos/aws-samples/semantic-search-aws-docs/tarball/main";
        const url = "https://codeload.github.com/aws-samples/semantic-search-aws-docs/legacy.tar.gz/refs/heads/main";

        const file = fs.createWriteStream(zipFolderName);
        file.on('open', () => {

            console.log('open');
            const request = https.get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    console.log("download done");
                    file.close(() => resolve(zipFolderName));  // close() is async, call cb after close completes.
                });
            }).on('error', function (err) { // Handle errors

                fs.unlink(zipFolderName, (errUnlink) => {
                    if (errUnlink) {
                        console.error(errUnlink);
                        console.log("download error");
                        reject(errUnlink);
                    } else {
                        console.log("download error");

                        reject(err);
                    }
                }); // Delete the file async. 

            });
        });

    });
}

const unzipRepo = async (zipPath: string, destPath: string) => {
    console.log("unzipping")
    return tar.extract({
        file: zipPath,
        cwd: destPath,
        stripComponents: 1,
    })
}


