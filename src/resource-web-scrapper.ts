import puppeteer, { Browser, Page } from "puppeteer";
import { Category } from "./enums/category.enum";
import { IResourceWebScrapperOptions } from "./interfaces/resource-web-scrapper-options.interface";
import { SalonAndCategory } from "./types/salon/salon-and-category";
import { configModule } from "./config-module";
import { ResourceConfig } from "./types/config/resource/resource-config";
import { SalonPageScrapperFactory } from "./factories/salon-page-scrapper/salon-page-scrapper.factory";
import { SalonLinksAndSearchPage } from "./types/resource-web-scrapper/salon-links-and-search-page";
import fs from 'fs/promises';
import { wait } from "./utils/wait";
import path from "path";
import { getRandomUserAgent } from "./utils/get-random-userAgent";
import { Resource } from "./enums/resource.enum";
import { salonService } from "./services/salon.service";

export class ResourceWebScrapper {
    private options: IResourceWebScrapperOptions;
    private browser: Browser;
    private resourceConfig: ResourceConfig;

    constructor(options: IResourceWebScrapperOptions) {
        if (!options.output.isSendToServer && !options.output.outputDir) {
            throw new Error('Output was not specified!');
        }
        if (options.output.isSendToServer && options.output.outputDir) {
            throw new Error('Output must be only one!');
        }
        options.output.salonsCntToSave = options.output.salonsCntToSave || 10,
        this.options = options;
        this.resourceConfig = configModule.getResourceCfg(options.resource);
    }

    private async initBrowser(): Promise<void> {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: true,
                args: ['--window-size=1920,1080'],
                defaultViewport: null,
            });
        }
    }

    private async destroyBrowser(): Promise<void> {
        await this.browser.close();
        this.browser = null as unknown as Browser;
        console.log(`---${this.options.resource}_SUCCESS!---`);
    }
    
    async getAllSalons(): Promise<void> {
        for (const value of Object.keys(Category)) {
            //@ts-ignore
            const enumValue = Category[value];
            await this.getSalonsByCategory(enumValue, false);
        }
        await this.destroyBrowser();
    }

    private async writeToFile(resource: Resource, category: Category, data: string, isFirstCall: boolean = false) {
        if (this.options.output.outputDir) {
            const resourceDirPath = path.join(this.options.output.outputDir, this.options.resource);
            try {
                await fs.mkdir(resourceDirPath);
            } catch(e) {}
            const outFileName = `${category}.json`;
            const outFilePath = path.join(resourceDirPath, outFileName);

            if (isFirstCall) {
                await fs.writeFile(outFilePath, data);
            } else {
                await fs.appendFile(outFilePath, data);
            }

        }
     }

    async getSalonsByCategory(category: Category, isToCloseBrowser: boolean = true): Promise<void> {
        await this.initBrowser();

        const resource = this.options.resource;

        let isWriteToFile = false
        if (this.options.output.outputDir) isWriteToFile = true
        
        const salonScrapper = new SalonPageScrapperFactory().creteSalonPageScrapper(resource);
        let pageNumber = 1;
        let nextPageLink;
        
        try {
            if (isWriteToFile) await this.writeToFile(resource, category, '[', true);

            let salons = [];

            while (true) {
                if (pageNumber !== 1) await this.writeToFile(resource, category, ',');

                let {salonLinks, searchPage} = await this.getSalonLinks(category, nextPageLink);
    
                for (let i = 0; i < salonLinks.length; i++) {
                    if (this.options.salonsPerPage && i >= this.options.salonsPerPage) {
                        break;
                    }
                    const salonPage = await this.getSalonPage(salonLinks[i]);
                    salonScrapper.setPage(salonPage);
                    //@ts-ignore
                    salons.push(await salonScrapper.getSalon());
                    await salonPage.close();

                    //save salons
                    if (salons.length === this.options.output.salonsCntToSave) {
                        if (isWriteToFile) {
                            let jsonSalons = JSON.stringify(salons, null, 2).slice(1, -1);
                            await this.writeToFile(resource, category, `${jsonSalons}`);
                        } else {
                            await salonService.create(resource, category, salons);
                        }
                        if (this.options.salonsPerPage && this.options.salonsPerPage !== i + 1) {
                            await this.writeToFile(resource, category, ',');
                        } else {
                            if (salonLinks.length !== i + 1 && !this.options.salonsPerPage) {
                                await this.writeToFile(resource, category, ',');
                            }
                        }
                        console.log('[SAVED]');
                        salons = [];

                        if (this.options.timeoutBetweenSaves) {
                            await wait(this.options.timeoutBetweenSaves);
                        }
                    }
                }

                //save of unsaved salons
                if (salons.length) {
                    if (isWriteToFile) {
                        let jsonSalons = JSON.stringify(salons, null, 2).slice(1, -1);
                        await this.writeToFile(resource, category, `${jsonSalons}`);
                    } else {
                        await salonService.create(resource, category, salons);
                    }
                    console.log('[SAVED]');
                    salons = [];

                    if (this.options.timeoutBetweenSaves) {
                        await wait(this.options.timeoutBetweenSaves);
                    }
                }

                nextPageLink = await this.getNextPageLink(searchPage);

                await searchPage.close();
                if (!nextPageLink || this.options.maxPagesCnt && pageNumber === this.options.maxPagesCnt) {
                    if (isWriteToFile) await this.writeToFile(resource, category, ']')
                    break;
                }

                pageNumber++;
            }
        } catch (e) {
            console.log(e);
            if (isWriteToFile) await this.writeToFile(resource, category, ']')
        } finally {
            if (isToCloseBrowser) {
                await this.destroyBrowser();
            }
        }
    }

    private async getSalonPage(link: string): Promise<Page> {
        console.log('----------')
        console.log(link)

        const page = await this.browser.newPage();
        await page.setUserAgent(getRandomUserAgent());
        await page.goto(link, {
            waitUntil: 'load',
            timeout: 0,
        });

        return page;
    }

    private async getSalonLinks(category: Category, link?: string): Promise<SalonLinksAndSearchPage> {
        const searchPage = await this.getSearchPage(category, link);
        if (this.options.resource  === Resource.FRESHA) {
            await wait(3000);
        }

        const hrefs = await searchPage.$$eval(this.resourceConfig.selectors.salonLink, (nodes) => {
            return nodes.map(node => node.getAttribute('href'));
        })
        let salonLinks = hrefs.map(href => `${this.resourceConfig.baseUrl}${href}`);

        if (!salonLinks.length) {
            salonLinks = [];
        };

        return {
            salonLinks,
            searchPage,
        };
    }

    private async getNextPageLink(page: Page): Promise<string | null> {
       try {
            const href = await page.$eval(this.resourceConfig.selectors.nextPageBtn, node => {
                return node.getAttribute('href');
            });
            return `${this.resourceConfig.baseUrl}${href}`;
       } catch (e) {
            return null;
       }
    }

    private async getSearchPage(category: Category, link?: string): Promise<Page> {
        const replacer = configModule.getReplacersCfg().category;
        let searchPageLink;

        if (link) {
            searchPageLink = link;
        } else {
            searchPageLink = this.resourceConfig.searchUrl.replace(replacer, this.resourceConfig.categories[category]);
        }
        
        const page = await this.browser.newPage();

        await page.evaluateOnNewDocument(function() {
            navigator.geolocation.getCurrentPosition = function (cb) {
              setTimeout(() => {
                //@ts-ignore
                cb({
                  'coords': {
                    accuracy: 21,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    latitude: 23.129163,
                    longitude: 113.264435,
                    speed: null
                  }
                })
              }, 1000)
            }
          });
        
        await page.setUserAgent(getRandomUserAgent());
        await page.goto(searchPageLink , {
            waitUntil: 'load',
            timeout: 0,
        })

        return page;
    }
}