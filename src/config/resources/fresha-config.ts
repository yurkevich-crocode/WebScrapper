import { configModule } from "../../config-module";
import { Category } from "../../enums/category.enum";
import { ResourceConfig } from "../../types/config/resource/resource-config";

export function freshaConfig(): ResourceConfig {
    return {
        baseUrl: 'https://www.fresha.com/',
        searchUrl: `https://www.fresha.com/pl/search?address-type=country&category-id=${configModule.getReplacersCfg().category}&place-id=ChIJuwtkpGSZAEcR6lXMScpzdQk`,
        selectors: {
            salonLink: 'a[class="CLnQGg _XdYXY tP90X4"]',
            nextPageBtn: '',
        
            name: '[class="_-wKvd- font-default-header-l-semibold font-tablet-header-2xl-bold mb-default-100 mb-tablet-0 ZXeVyz"]',
            description: '[class="_-wKvd- font-default-body-m-regular mb-default-400x qhwDbF"]',
            address: '[class="p_e4TX"] > [class="_-wKvd- font-default-body-m-regular"]',
            rating: '[class="_-wKvd- rfrVL- _9CRMX- font-default-body-m-semibold"]',
            image: '[data-qa="gallery-modal"] [class="display-default-none display-tablet-block"] picture > img',
            imagesShoeMoreBtn: '[id="button-venue-page-see-all-button"]',
            workHours: '[data-qa="opening-hours-range"]',
            phone: '',
            socialMediaLink: '',
            specialTags: '',

            serviceSetBlock: '',
            serviceSetName: '',
            serviceSetShowMoreBtn: '',
            serviceBlock: '',
            serviceName: '',
            serviceDescription: '',
            servicePrice: '',
            serviceDuration: '',

            subServiceBlock: '',
            subServiceName: '',
        },
        categories: {
            [Category.HAIR]: '5',
            [Category.BARBER]: '14',
            [Category.NAIL]: '1',
            [Category.BROWS]: '13',
            [Category.MASSAGE]: '8',
            [Category.MAKEUP]: '12',
            [Category.SPA]: '8',
            [Category.OTHER]: '6',
        },
    }
}