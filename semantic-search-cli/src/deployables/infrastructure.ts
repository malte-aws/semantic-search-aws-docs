import { SemanticSearchConfig } from "../semanticSearchConfig";
import { Deployable } from "./deployable";
import { TerraformInit } from "./terraform";


export const Infrastructure: Deployable = {} as Deployable;

Infrastructure.deploy = async (config: SemanticSearchConfig) => {
    throw new Error("Method not implemented.");


}

Infrastructure.destroy = (config: SemanticSearchConfig) => {
    // TODO
    throw new Error("Method not implemented.");
}



