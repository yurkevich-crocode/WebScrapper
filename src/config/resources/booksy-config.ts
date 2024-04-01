import { configModule } from "../../config-module";
import { Category } from "../../enums/category.enum";
import { ResourceConfig } from "../../types/config/resource/resource-config";

export function booksyConfig(): ResourceConfig {
    return {
        baseUrl: 'https://booksy.com',
        searchUrl: `https://booksy.com/pl-pl/s/${configModule.getReplacersCfg().category}/3_warszawa`,
        selectors: {
            salonLink: '[class="purify_+0xylkMK1VlcZQwXVcUnNw=="] a',
            nextPageBtn: '[class*="purify_oRLmB2EuZ01XBjqAX0Sq7Q== purify_Sardy6hfiet162IZ2pYFPA== purify_f9tJlQGTtqZe8Hg0f7oQhg== purify_Rptxv+WbCltBTrvcW8QtrQ=="]',
        
            name: 'h1[data-testid="business-name"]',
            description: '[class="collapsibleText purify_J9nQDaJUzkiC+6tRVJZ9Ag== purify_Sardy6hfiet162IZ2pYFPA== purify_f9tJlQGTtqZe8Hg0f7oQhg=="] div',
            descriptionShowMoreBtn: '[class="collapsibleText purify_J9nQDaJUzkiC+6tRVJZ9Ag== purify_Sardy6hfiet162IZ2pYFPA== purify_f9tJlQGTtqZe8Hg0f7oQhg=="] [class="collapsibleText__more"]',
            address: 'main div.b-mb-2',
            rating: '[data-testid="rank-average"]',
            image: 'img[data-testid="business-header-image"]',
            sliderDots: '.flickity-page-dots li',
            sliderNextBtn: '[data-testid="slider-button-next"]',
            workHours: 'div[class="purify_GQgfOFrDrO--OhEuBSRkDw=="] [class="purify_w46Gvuqa-BgccO3rvxZVUQ== purify_IbX1Bb-sl2ffhqyi9xUH1A== purify_f9tJlQGTtqZe8Hg0f7oQhg=="] span',
            phone: 'aside a[href^="tel:"]',
            socialMediaLink: '[data-testid="social-media-share-btn"] a[class="purify_b6ZO5VAzh2IvKY8mzErnJA=="]',
            specialTags: '[class="purify_aU9y9wptDe+dy0MYR4GOpg=="] li p',

            serviceSetBlock: '[class="purify_9s6t-qw7eqYnHW9ZUVvuIQ== purify_B5FlEzszXCCr3iA6gLF5gA=="]',
            serviceSetName: '[class="purify_A5PjchUBGE0LKc6dKhdxJA== purify_kq4BZr36QXoLgkAnN95TWw== purify_ALIs4zXhTfTpPKnHLNiBVA=="]',
            serviceSetShowMoreBtn: '[data-testid="services-list-category-button-show-less-more"]',
            serviceBlock: '[data-testid="service"]',
            serviceName: '[data-testid="service-name"]',
            serviceDescription: '[class="purify_FwUhDzCHXaPw9jog0U-vxQ=="] span',
            servicePrice: '[class="purify_s8fylQf1Z9K4N9kwPLHJaA== purify_IbX1Bb-sl2ffhqyi9xUH1A== purify_f9tJlQGTtqZe8Hg0f7oQhg=="]',
            serviceDuration: '[data-testid="service-duration"]',

            subServiceBlock: '[class="purify_lg7PcIB-hN8kZWqOuOKzgQ=="]',
            subServiceName: '[class="purify_0bFL6XKK9yGgpVpvdBOg9g== purify_Sardy6hfiet162IZ2pYFPA== purify_f9tJlQGTtqZe8Hg0f7oQhg=="]',
        },
        categories: {
            [Category.HAIR]: 'fryzjer',
            [Category.BARBER]: 'barber-shop',
            [Category.NAIL]: 'paznokcie',
            [Category.BROWS]: 'brwi-i-rzesy',
            [Category.MASSAGE]: 'masaz',
            [Category.MAKEUP]: 'salon-kosmetyczny',
            [Category.SPA]: 'spa-i-wellness',
            [Category.OTHER]: 'inni',
        },
    }
}