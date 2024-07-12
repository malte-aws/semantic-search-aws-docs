import { EnvironmentDefinition } from "../queryables/environmentDefinition"
import { SemanticSearchConfig } from "../semanticSearchConfig"

export interface Deployable {
    deploy(config: SemanticSearchConfig, env: EnvironmentDefinition): Promise<void>
    destroy(config: SemanticSearchConfig, env: EnvironmentDefinition): Promise<void>
}