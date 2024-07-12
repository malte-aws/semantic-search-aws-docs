import { printer } from "amplify-prompts";
import { DeploymentStrategyFactory } from "../factories/factories";
import { FactoryFunction } from "../factories/factory";
import { EnvironmentDefinition } from "../queryables/environmentDefinition";
import { EnvironmentQuery } from "../queryables/envrionmentQuery";
import { SemanticSearchConfig } from "../semanticSearchConfig";
import { Deployable } from "./deployable";

export const Deployer = {} as Deployable;

const deploymentStrategyFactory: FactoryFunction<Deployable[]> = DeploymentStrategyFactory;

Deployer.deploy = async (config, env) => {

    const deployables = deploymentStrategyFactory(env, config);
    const alreadyDeployedStack: Deployable[] = [];
    

    for (const nextStep of deployables) {
        try {
            await nextStep.deploy(config, env);
            alreadyDeployedStack.push(nextStep);
        } catch (error) {
            printer.error("Something went wrong while deploying AWS Semantic Search.");
            console.error(error);
            printer.info("Cleaning up");
            destroyStack(alreadyDeployedStack, config, env)
        }
        }
       
    
}

const destroyStack = (deployedStack: Deployable[], config: SemanticSearchConfig, env: EnvironmentDefinition) => {
    while(deployedStack.length > 0) {
        const toDestroy = deployedStack.pop();
        try {
            toDestroy?.destroy(config,env) 
        } catch (error) {
            printer.error("Something went wrong while cleaning up the deployment.");
            console.error(error);
        }
    }
}

Deployer.destroy = (config, env) => {
    // TODO
    throw new Error("Method not implemented.");
}

