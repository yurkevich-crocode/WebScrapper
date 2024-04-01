import { Resource } from "../enums/resource.enum";

export interface IResourceWebScrapperOptions {
    resource: Resource,
    output: IOutput,
    maxPagesCnt?: number,
    salonsPerPage?: number,
    timeoutBetweenSaves?: number,
}

interface IOutput {
    outputDir?: string,
    isSendToServer?: boolean,
    salonsCntToSave?: number,
}