import { SalonPageScrapper } from "../salon-page-scrapper";
import { Service } from "../../types/salon/service";

export class BooksySalonPageScrapper extends SalonPageScrapper {

    async getSalonImages(): Promise<string[]> { 
        let imagesCnt = (await this.page.$$(this.resourceCfg.selectors.sliderDots as string)).length;
        const sliderBtnNext = await this.page.$(this.resourceCfg.selectors.sliderNextBtn as string);

        if (sliderBtnNext) {
            const clickPromises = Array(imagesCnt).fill(null).map(async () => await sliderBtnNext.click());
            await Promise.all(clickPromises);
        }

        const imgLinks = await this.page.$$eval(this.resourceCfg.selectors.image, els => {
            return els.map(el => el.getAttribute('src'));
        }) as string[];

        return imgLinks;
    }

    async getSalonServices(): Promise<Service[]> {
        //click on the all showMoreServicesBtn to display all services
        await this.page.$$eval(this.resourceCfg.selectors.serviceSetShowMoreBtn as string, (nodes) => {
            nodes.forEach(node => {
                //@ts-ignore
                node.click();
            })
        });

        //browser-js
        const salonServices = await this.page.evaluate((resourceCfg) => {
            //@ts-ignore
            function extractService(isSubService, serviceSetBlockNode, serviceNode, serviceSetNameSelector, 
                //@ts-ignore
                            serviceNameSelector, serviceDescSelector, servicePriceSelector, serviceDurationSelector) {
        
                const service = {
                    serviceType: null,
                    name: null,
                    description: null,
                    price: null,
                };
                //@ts-ignore
                const serviceNameNode = serviceNode.querySelector(serviceNameSelector);
                //@ts-ignore
                const serviceDescNode = serviceNode.querySelector(serviceDescSelector);
                //@ts-ignore
                const servicePriceNode = serviceNode.querySelector(servicePriceSelector);
                //@ts-ignore
                const serviceDurationNode = serviceNode.querySelector(serviceDurationSelector);
                const serviceSetNameNode = serviceSetBlockNode.querySelector(serviceSetNameSelector);
        
                if (serviceSetNameNode && !isSubService) {
                    //@ts-ignore
                    service.serviceType = serviceSetNameNode.innerText || null;
                }
                if (isSubService) {
                    //@ts-ignore
                    service.serviceType = undefined;
                }
                if (serviceNameNode) {
                    //@ts-ignore
                    service.name = serviceNameNode.innerText.split('\n', 1)[0] || null;
                }
                if (serviceDescNode) {
                    //@ts-ignore
                    service.description = serviceDescNode.innerText || null;
                }
                if (servicePriceNode) {
                    //@ts-ignore
                    const priceStr = servicePriceNode.innerText.replace(',', '.');
        
                    
                    const priceRegex = /(?<value>\d+\.\d+)\s*(?<currency>\D+?[^+])/;
                    const priceMatches = priceStr.match(priceRegex);
                    const isStartsFrom = priceStr.includes('+');
        
                    if (priceMatches) {
                        //@ts-ignore
                        service.price = {
                            isUnknown: false,
                            //@ts-ignore
                            value: Number(priceMatches.groups.value),
                            //@ts-ignore
                            currency: priceMatches.groups.currency,
                            isStartsFrom,
                        }; 
                    } else {
                        //@ts-ignore
                        service.price = {
                            isUnknown: true
                        };
                    }
                }
                if (serviceDurationNode) {
                    //@ts-ignore
                    const durationStr = serviceDurationNode.innerText;
        
                    const durationRegex = /((?<hours>\d+)[gh])?\D*((?<minutes>\d+)min)?/;
                    const durationMatches = durationStr.match(durationRegex)
                    if (durationMatches.groups) {
                        //@ts-ignore
                        const hours = Number(durationMatches.groups.hours || 0);
                        const minutes = Number(durationMatches.groups.minutes || 0);
                        //@ts-ignore
                        service.duration_minutes = hours * 60 + minutes;
                    }
                }
                
                return service;
            }

            const serviceSetBlockNodes = Array.from(document.querySelectorAll(resourceCfg.selectors.serviceSetBlock));
            const services = [];
            
            for (let serviceSetBlockNode of serviceSetBlockNodes) {
                
                const serviceNodes = Array.from(serviceSetBlockNode.querySelectorAll(resourceCfg.selectors.serviceBlock));

                for (let serviceNode of serviceNodes) {
                    //@ts-ignore
                    const service = extractService(false, serviceSetBlockNode, serviceNode, resourceCfg.selectors.serviceSetName, 
                        resourceCfg.selectors.serviceName, resourceCfg.selectors.serviceDescription, resourceCfg.selectors.servicePrice, 
                        resourceCfg.selectors.serviceDuration);

                    const subServiceNodes = Array.from(serviceNode.querySelectorAll(resourceCfg.selectors.subServiceBlock as string));

                    if (subServiceNodes.length) {
                        const subServices = [];
                        for (let subServiceNode of subServiceNodes) {
                            const subService = extractService(true, serviceSetBlockNode, subServiceNode, resourceCfg.selectors.serviceSetName, 
                                resourceCfg.selectors.subServiceName, resourceCfg.selectors.serviceDescription, resourceCfg.selectors.servicePrice, 
                                resourceCfg.selectors.serviceDuration);
                            //@ts-ignore
                            subServices.push(subService);
                        }
                        //@ts-ignore
                        service.subServices = subServices;
                        service.price = null;
                        //@ts-ignore
                        service.duration_minutes = null;
                    } else {
                        //@ts-ignore
                        service.subServices = [];
                    }
                    //@ts-ignore
                    services.push(service);
                }
            }

            //@ts-ignore
            return services;
        }, this.resourceCfg);

        //@ts-ignore
        return salonServices;
    }

}