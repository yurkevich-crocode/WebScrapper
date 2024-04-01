import { Service } from "./service";
import { WorkHours } from "./work-hours";

export class Salon {
    name: string | null;
    email: string | null;
    description: string | null;
    rating: number | null;
    address: string | null;
    phones: string[];
    socialMediaLinks: string[];
    specialTags: string[];
    exampleWorks: string[];
    schedule: WorkHours[];
    services: Service[];
}