import { CreateStateBucket } from "../deployables/createStateBucket";
import { CreateSyncTable } from "../deployables/createSyncTable";
import { Deployable } from "../deployables/deployable";
import { DownloadRepo } from "../deployables/downloadRepo";
import { ResizeCloud9Storage } from "../deployables/resizeCloud9Storage";
import { TerraformApplySemanticSearchInfrastructure, TerraformApplySemanticSearchIngestion, TerraformInitSemanticSearchInfrastructure } from "../deployables/terraform";
import { availableDiskSpaceSufficient } from "../queryables/availableDiskSpaceInBytes";
import { EnvironmentDefinition } from "../queryables/environmentDefinition";
import { SemanticSearchConfig } from "../semanticSearchConfig";
import { FactoryFunction } from "./factory";
import {printer} from 'amplify-prompts';


const TerraformStateDeploymentFactory: FactoryFunction<Deployable[]> = (env: EnvironmentDefinition , config: SemanticSearchConfig) => {
    return [
        // CD ../infrastructure
        CreateStateBucket,
        CreateSyncTable
    ]
};

const InfrastructureDeploymentFactory: FactoryFunction<Deployable[]> = (env: EnvironmentDefinition , config: SemanticSearchConfig) => {
    return [
        // CD ../infrastructure
        TerraformInitSemanticSearchInfrastructure,
        TerraformApplySemanticSearchInfrastructure
    ]
};

const IngestionDeploymentFactory: FactoryFunction<Deployable[]> = (env: EnvironmentDefinition , config: SemanticSearchConfig) => {
    return [
        // CD ../ingestion
        TerraformApplySemanticSearchIngestion,
        TerraformApplySemanticSearchIngestion
    ]
};


const GitRepoDownloadFactory: FactoryFunction<Deployable[]> = (env: EnvironmentDefinition , config: SemanticSearchConfig) => {
    return [
        DownloadRepo
    ]
};

const Cloud9Factory: FactoryFunction<Deployable[]> = (env: EnvironmentDefinition , config: SemanticSearchConfig) => {
    const deployments = [] as Deployable[];

    if(!availableDiskSpaceSufficient(env)) {
        deployments.push(ResizeCloud9Storage);
    }

    return deployments;
};

export const DeploymentStrategyFactory: FactoryFunction<Deployable[]> = (env: EnvironmentDefinition , config: SemanticSearchConfig) => {
    const deployments = [] as Deployable[];

    if(env.sourceRepoMissing/*TODO env.isCloud9*/) {
        deployments.push(...Cloud9Factory(env, config));
    } else {
        if(!availableDiskSpaceSufficient(env)) {
            printer.warn("💾 You might not have enough storage to build all the container images.")
        }
    }
    if(env.sourceRepoMissing) {
        deployments.push(...GitRepoDownloadFactory(env, config))
    }
    if(/*TODO check when creation of state bucket is needed*/) {
        deployments.push(...TerraformStateDeploymentFactory(env, config))
    }

    deployments.push(...InfrastructureDeploymentFactory(env, config))

    if(config.ingestionSource !== "none") {
        // TODO Take ingestion source into consideration
        deployments.push(...IngestionDeploymentFactory(env, config))
    }
    return deployments;
};

