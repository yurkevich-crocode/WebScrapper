import { configModule } from "../../config-module";
import { Category } from "../../enums/category.enum";
import { ResourceConfig } from "../../types/config/resource/resource-config";

export function bukkaConfig(): ResourceConfig {
    return {
        baseUrl: 'https://bukka.pl',
        searchUrl: `https://bukka.pl/szukaj/0-salony/${configModule.getReplacersCfg().category}`,
        selectors: {
            salonLink: '.salon-container a.salon',
            nextPageBtn: '',
        
            name: '.salon-details h1',
            description: '[class="description"]',
            address: '.salon-details address .location',
            rating: 'strong[itemprop="ratingValue"]',
            image: '.gallery-item a',
            workHours: '[itemprop="openingHours"]',
            phone: '[itemprop="telephone"] a[href^="tel:"]',
            socialMediaLink: 'none',
            specialTags: '#facilities div div div:nth-child(2)',

            serviceSetBlock: '',
            serviceSetName: '',
            serviceBlock: '',
            serviceName: '',
            serviceDescription: '[class="service-description"] p',
            servicePrice: '[class="price"]',
            serviceDuration: '[itemprop="name"] sup',

            subServiceBlock: '[itemprop="itemListElement"]',
            subServiceName: '[itemprop="name"]'
        },
        categories: {
            [Category.HAIR]: 'fryzjer',
            [Category.BARBER]: 'barber',
            [Category.NAIL]: 'paznokcie',
            [Category.BROWS]: 'kosmetyczka',
            [Category.MASSAGE]: 'spa-massage',
            [Category.MAKEUP]: 'kosmetyczka',
            [Category.SPA]: 'spa-massage',
            [Category.OTHER]: 'inne',
        },
    }
}