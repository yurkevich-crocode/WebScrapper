import { Page } from "puppeteer"

export interface SalonLinksAndSearchPage {
    searchPage: Page,
    salonLinks: string[],
}