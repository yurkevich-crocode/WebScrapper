import { Service } from "./service";

export type SubService = Omit<Service, 'subServices' | 'serviceType'>