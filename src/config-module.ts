import { replacersConfig } from "./config/replacers/replacers-config";
import { booksyConfig } from "./config/resources/booksy-config";
import { bukkaConfig } from "./config/resources/bukka-config";
import { freshaConfig } from "./config/resources/fresha-config";
import { salonerConfig } from "./config/resources/saloner-config";
import { Resource } from "./enums/resource.enum";
import { ReplacersConfig } from "./types/config/replacers/replacers-config";
import { ResourceConfig } from "./types/config/resource/resource-config";

class ConfigModule {
    getResourceCfg(resource: Resource): ResourceConfig {
        switch (resource) {
            case Resource.BOOKSY: return booksyConfig();
            case Resource.BUKKA: return bukkaConfig();
            case Resource.SALONER: return salonerConfig();
            case Resource.FRESHA: return freshaConfig();
        }
    }

    getReplacersCfg(): ReplacersConfig {
        return replacersConfig();
    }
}

export const configModule = new ConfigModule();