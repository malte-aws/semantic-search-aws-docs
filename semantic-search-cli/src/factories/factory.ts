import { EnvironmentDefinition } from "../queryables/environmentDefinition";
import { SemanticSearchConfig } from "../semanticSearchConfig";

export interface FactoryFunction<T> {
    (env: EnvironmentDefinition, config: SemanticSearchConfig): T;
}