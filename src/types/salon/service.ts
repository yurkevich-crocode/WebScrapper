import { Price } from "./price";
import { SubService } from "./sub-service";

export class Service {
    serviceType: string | null;
    name: string | null;
    description: string | null;
    duration_minutes: number | null;
    price: Price | null;
    subServices: SubService[];
}