import { configModule } from "../../config-module";
import { Category } from "../../enums/category.enum";
import { ResourceConfig } from "../../types/config/resource/resource-config";

export function salonerConfig(): ResourceConfig {
    return {
        baseUrl: 'https://saloner.pl',
        searchUrl: `https://saloner.pl/szukaj/${configModule.getReplacersCfg().category}`,
        selectors: {
            salonLink: 'div.p-5.text-sm a',
            nextPageBtn: '',
        
            name: 'h1.text-xl.font-semibold',
            description: 'div.pt-1.text-sm.text-gray-600',
            address: 'div.text-gray-600.text-sm.pb-6',
            rating: '[class="lg:rounded-xl lg:border bg-white"] [class="px-5 my-6"] [class="flex items-center gap-3 pb-6 border-b mb-5"] [class="flex items-center gap-x-1.5"] span.font-semibold',
            image: '[class="lg:rounded-lg lg:overflow-hidden border border-white"] img',
            workHours: '.border-b.py-1.flex.justify-between.text-sm div.font-semibold',
            showScheduleBtn: 'span[class="text-gray-600 group-hover:text-orange-500"]',
            phone: 'a[href^="tel:"].text-orange-500.px-4.py-2.border-2.border-orange-500.rounded-lg',
            socialMediaLink: '',
            specialTags: '',

            serviceSetBlock: '.block.pt-8 > div:nth-child(2) > div',
            serviceSetName: 'h2[class="pt-8 pb-4 px-5 font-semibold border-b text-lg"]',
            serviceBlock: '[class*="font-medium text-sm px-5"]',
            serviceName: 'h3[class="text-sm"]',
            serviceDescription: '[class="text-xs text-gray-500"]',
            servicePrice: '[class="text-base font-medium text-black"]',
            serviceDuration: '[class="text-xs"]',
            
            subServiceBlock: '[class="flex flex-nowrap items-center justify-between gap-3 border-b px-5 py-3"]',
            subServiceName: '[class="text-sm text-gray-600"]',
        },
        categories: {
            [Category.HAIR]: 'fryzjer',
            [Category.BARBER]: 'barber',
            [Category.NAIL]: 'paznokcie',
            [Category.BROWS]: 'medycyna-estetyczna',
            [Category.MASSAGE]: 'spa',
            [Category.MAKEUP]: 'kosmetologia',
            [Category.SPA]: 'spa',
            [Category.OTHER]: 'Inne',
        },
    }
}