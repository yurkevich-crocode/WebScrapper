import puppeteer, { Page } from "puppeteer";
import { ResourceConfig } from "../types/config/resource/resource-config";
import { configModule } from "../config-module";
import { Resource } from "../enums/resource.enum";
import { WorkTime } from "../types/salon/work-time";
import { WorkHours } from "../types/salon/work-hours";
import { trimObjectFields } from "../utils/trim-object-fields";
import { Salon } from "../types/salon/salon";
import { Service } from "../types/salon/service";

export abstract class SalonPageScrapper {
    protected page: Page;
    protected resourceCfg: ResourceConfig;

    constructor(resource: Resource) {
        this.resourceCfg = configModule.getResourceCfg(resource);
    }

   setPage(page: Page) {
        this.page = page;
    }

    checkPageExists() {
        if (!this.page) {
            throw new Error("The page was not configured!");
        }
    }

    async getSalon(): Promise<Salon> {
        return trimObjectFields({
            name: await this.getSalonName(),
            email: '',
            address: await this.getSalonAddress(),
            phones: await this.getSalonPhones(),
            description: await this.getSalonDescription(),
            rating: await this.getSalonRating(),
            socialMediaLinks: await this.getSalonSocialMediaLinks(),
            exampleWorks: await this.getSalonImages(),
            specialTags: await this.getSalonSpecialTags(),
            schedule: await this.getSalonSchedule(),
            services: await this.getSalonServices(),
        } as Salon);
    }

    async getSalonImages(): Promise<string[]> {
        try {
            const srcList = await this.page.$$eval(this.resourceCfg.selectors.image, (nodes) => {
                return nodes.map(node => node.getAttribute('src'));
            });

            const hrefList = await this.page.$$eval(this.resourceCfg.selectors.image, (nodes) => {
                return nodes.map(node => node.getAttribute('href'));
            });

            const srcItemsAreNull = srcList.every(el => el === null);
            const hrefItemsAreNull = hrefList.every(el => el === null);

            if (!hrefItemsAreNull) {
                return hrefList.map(href => `${this.resourceCfg.baseUrl}${href}`);
            }
            
            if (!srcItemsAreNull) {
                return srcList as string[];
            }

            return [];
        } catch (e) {
            return [];
        }
    }

    async getSalonServices(): Promise<Service[]> {
        return [];
    }

    async getSalonSpecialTags(): Promise<string[]> {
        try {
            const tags = await this.page.$$eval(this.resourceCfg.selectors.specialTags, nodes => {
                return nodes.map(node => {
                    return node.textContent?.trim();
                }) as string[];
            });
            return tags;
        } catch (e) {
            return [];
        }
    }

    async getSalonName(): Promise<string | null> {
        try {
            const name = await this.page.$eval(this.resourceCfg.selectors.name, el => el.textContent?.trim());
            return name || '';
        } catch(e) {
            console.log(e);
            return null;
        }
    }

    async getSalonDescription(): Promise<string | null> {
        try {
            const bntSelector = this.resourceCfg.selectors.descriptionShowMoreBtn;

            if (bntSelector) {
                await this.page.$eval(bntSelector, (node) => {
                    //@ts-ignore
                    node.click();
                });
            }

            const description = await this.page.$eval(this.resourceCfg.selectors.description, el => el.textContent!.trim());
            return description;
        } catch (error) {
            return null;
        }
    }

    async getSalonRating(): Promise<number | null> {
        try {
            const rating = await this.page.$eval(this.resourceCfg.selectors.rating, el => {
                return Number(el.textContent?.trim().replace(',', '.'));
            });
            return rating;
        } catch (e) {
            return null;
        }
    }

    async getSalonAddress(): Promise<string | null> {
        try {
            const address = await this.page.$eval(this.resourceCfg.selectors.address, el => el.textContent!.trim());
            return address;
        } catch (e) {
            return null;
        }
    }

    async getSalonPhones(): Promise<string[]> {
        try {
            const phones = await this.page.$$eval(this.resourceCfg.selectors.phone, nodes => {
                return nodes.map(node => {
                    return node.getAttribute('href')?.replace(/^tel:/, '');
                }) as string[];
            });
            return phones;
        } catch (e) {
            return [];
        }
    }

    async getSalonSocialMediaLinks(): Promise<string[]> {
        try {
            const links = await this.page.$$eval(this.resourceCfg.selectors.socialMediaLink, nodes => {
                return nodes.map(node => {
                    return node.getAttribute('href');
                }) as string[];
            });
            return links;
        } catch (e) {
            return [];
        }
    }
    
    async getSalonSchedule(): Promise<WorkHours[]> {
        const workHoursStrings = await this.page.$$eval(this.resourceCfg.selectors.workHours, nodes => {
            return nodes.map(node => node.textContent as string);
        });

        return await this.extractSalonSchedule(workHoursStrings);
    }

    async extractSalonSchedule(workHoursStrings: string[]): Promise<WorkHours[]> {
        const workHours = workHoursStrings.map((nodeText, i): WorkHours => {
            const workHoursRegex = /\d{1,2}.{1}\d{1,2}/g;
            const workTimeRegex = /\d{1,2}/g
            const workHours = nodeText.match(workHoursRegex);

            let startTime: WorkTime;
            let endTime: WorkTime;
            
            if (workHours && workHours?.length) {
                startTime = {
                    hours: Number(workHours[0].match(workTimeRegex)![0]),
                    minutes: Number(workHours[0].match(workTimeRegex)![1]),
                }
                endTime = {
                    hours: Number(workHours[1].match(workTimeRegex)![0]),
                    minutes: Number(workHours[1].match(workTimeRegex)![1]),
                }

                return {
                    isClosed: false,
                    weekDay: i + 1,
                    startTime,
                    endTime,
                };
            }

            return {
                isClosed: true,
                weekDay: i + 1,
            } as WorkHours;
        });

        return workHours;
    }
}