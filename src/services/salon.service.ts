import axios from "axios";
import { Category } from "../enums/category.enum";
import { Resource } from "../enums/resource.enum";
import { Salon } from "../types/salon/salon";

class SalonService {

    async create(resource: Resource, category: Category, salons: Salon[]): Promise<void> {
       try {
            const url = `${process.env.SERVER_URL}/api/company/createCompany/${resource}/${category}`
            await axios.post(url, salons);
       } catch (e) {
            console.log(e);
       }
    }
}

export const salonService = new SalonService()