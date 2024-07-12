import { EnvironmentDefinition } from "./environmentDefinition";

export interface Queryable {
    query(): Promise<Partial<EnvironmentDefinition>>
}