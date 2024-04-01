import { Service } from "../../types/salon/service";
import { SalonPageScrapper } from "../salon-page-scrapper";

export class FreshaSalonPageScrapper extends SalonPageScrapper {

    async getSalonImages(): Promise<string[]> {
        try {
            await this.page.$eval(this.resourceCfg.selectors.imagesShoeMoreBtn as string, node => {
                //@ts-ignore
                node.click();
            });

            const srcList = await this.page.$$eval(this.resourceCfg.selectors.image, (nodes) => {
                return nodes.map(node => node.getAttribute('src'));
            });
            
            return srcList as string[];
        } catch (e) {
            return [];
        }
    }
    
    async getSalonServices(): Promise<Service[]> {
        return [];
    }
    
}