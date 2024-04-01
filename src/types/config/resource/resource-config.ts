import { ResourceConfigCategories } from "./resource-config-categories";
import { ResourceConfigSelectors } from "./resource-config-selectors";

export interface ResourceConfig {
    baseUrl: string,
    searchUrl: string,
    selectors: ResourceConfigSelectors,
    categories: ResourceConfigCategories,
}