import { Service } from "../../types/salon/service";
import { SalonPageScrapper } from "../salon-page-scrapper";

export class BukkaSalonPageScrapper extends SalonPageScrapper {
    
    async getSalonServices(): Promise<Service[]> {
        //click on the all serviceBlocks to display all subServices
        await this.page.$$eval(this.resourceCfg.selectors.serviceBlock as string, (nodes) => {
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
                   service.name = serviceNameNode.innerText || null;
               }
               if (serviceDescNode) {
                   //@ts-ignore
                   service.description = serviceDescNode.innerText || null;
               }
               if (servicePriceNode) {
                   //@ts-ignore
                   const priceStr = servicePriceNode.innerText.replace(',', '.');
                   
                   const priceRegex = /(?<value>\d+\.?\d+)\s*(?<currency>\D+?[^+])/g;
                   const priceMatches = Array.from(priceStr.matchAll(priceRegex));
                   const isStartsFrom = false;
       
                   if (priceMatches.length) {
                       let value;
                       let currency;
                       if (priceMatches.length >= 2) {
                           //@ts-ignore
                           value = Number(priceMatches[1].groups.value);
                           //@ts-ignore
                           currency = priceMatches[1].groups.currency;
                       } else {
                           //@ts-ignore
                           value = Number(priceMatches[0].groups.value);
                           //@ts-ignore
                           currency = priceMatches[0].groups.currency;
                       }

                       //@ts-ignore
                       service.price = {
                           isUnknown: false,
                           //@ts-ignore
                           value: value,
                           //@ts-ignore
                           currency: currency,
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
       
                   const durationRegex = /((?<hours>\d+).[gh])?\D*((?<minutes>\d+).min)?/;
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

               if (serviceNodes.length) {
                       for (let serviceNode of serviceNodes) {
                           //@ts-ignore
                           const service = extractService(false, serviceSetBlockNode, serviceNode, resourceCfg.selectors.serviceSetName, 
                               resourceCfg.selectors.serviceName, resourceCfg.selectors.serviceDescription, resourceCfg.selectors.servicePrice, 
                               resourceCfg.selectors.serviceDuration);

                           const subServiceNodes = Array.from(serviceSetBlockNode.querySelectorAll(resourceCfg.selectors.subServiceBlock as string));

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
               } else {
                   const serviceNodes = Array.from(serviceSetBlockNode.querySelectorAll(resourceCfg.selectors.subServiceBlock as string));

                   if (serviceNodes.length) {
                       for (let serviceNode of serviceNodes) {
                           const service = extractService(false, serviceSetBlockNode, serviceNode, resourceCfg.selectors.serviceSetName, 
                               resourceCfg.selectors.subServiceName, resourceCfg.selectors.serviceDescription, resourceCfg.selectors.servicePrice, 
                               resourceCfg.selectors.serviceDuration);
                           //@ts-ignore
                           service.subServices = [];
                           //@ts-ignore
                           services.push(service);
                       }
                   } 
               }
           }

           //@ts-ignore
           return services;
       }, this.resourceCfg);

       //@ts-ignore
       return salonServices;
   }
}