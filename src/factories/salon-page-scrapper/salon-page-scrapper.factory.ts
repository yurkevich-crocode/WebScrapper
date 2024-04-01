import { Resource } from "../../enums/resource.enum";
import { BukkaSalonPageScrapper } from "../../resource-page-scrappers/concrete/bukka-salon-page-scrapper";
import { BooksySalonPageScrapper } from "../../resource-page-scrappers/concrete/booksy-salon-page-scrapper";
import { SalonerSalonPageScrapper } from "../../resource-page-scrappers/concrete/saloner-salon-page-scrapper";
import { SalonPageScrapper } from "../../resource-page-scrappers/salon-page-scrapper";
import { FreshaSalonPageScrapper } from "../../resource-page-scrappers/concrete/fresha-salon-page-scrapper";

export class SalonPageScrapperFactory {
    creteSalonPageScrapper(resource: Resource): SalonPageScrapper {
        switch(resource) {
            case Resource.BUKKA:
                return new BukkaSalonPageScrapper(resource);
            case Resource.BOOKSY:
                return new BooksySalonPageScrapper(resource);
            case Resource.SALONER:
                return new SalonerSalonPageScrapper(resource);
            case Resource.FRESHA:
                return new FreshaSalonPageScrapper(resource);
            default:
                throw Error('No class assigned to this resource type');
        }
    }
}