import { configDotenv } from 'dotenv'
import { Resource } from './enums/resource.enum';
import { Category } from './enums/category.enum';
import { ResourceWebScrapper } from './resource-web-scrapper';
import path from 'path';

configDotenv()

async function main() {
    const outputDir = path.join(process.cwd(), 'out');
    const resource = Resource.BOOKSY;
    const category = Category.HAIR;
    
    const scrapper = new ResourceWebScrapper({
        resource: resource,
        // maxPagesCnt: 1,
        // salonsPerPage: 5,
        timeoutBetweenSaves: 10000,
        output: {
            // outputDir,
            isSendToServer: true,
            salonsCntToSave: 20,
        }
    })
    
    // await scrapper.getSalonsByCategory(category);
    await scrapper.getAllSalons();
}

main();