import { cwd } from "process";
import { TfBackendConfig, defaultTfBackendConfig } from "../tfBackendConfig";

export type EnvironmentDefinition = {
    sourceRepoMissing: boolean,
    cwd: string,
    availableDiskSpaceInBytes: number,
    existingInfrastructureTfBackendConfig: TfBackendConfig
};

const defaultEnvironmentDefinition: EnvironmentDefinition = {
    sourceRepoMissing: true,
    cwd: cwd(),
    availableDiskSpaceInBytes: 0,
    existingInfrastructureTfBackendConfig: defaultTfBackendConfig
}

export const complete = (partialEnv: Partial<EnvironmentDefinition>): EnvironmentDefinition => {
    return {...defaultEnvironmentDefinition, ...partialEnv}
}