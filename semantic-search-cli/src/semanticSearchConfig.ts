import { TfBackendConfig, defaultTfBackendConfig } from "./tfBackendConfig";

export type SemanticSearchConfig = {
    ingestionSource: Required<string>;
    tfBackendConfig: Required<TfBackendConfig>
};


export const defaultConfig: SemanticSearchConfig = {
    tfBackendConfig: defaultTfBackendConfig,
    ingestionSource: "amazon-ec2-user-guide"
}

