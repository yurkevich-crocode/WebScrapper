import { Category } from "../../../enums/category.enum";

export interface ResourceConfigCategories {
    [Category.HAIR]: string,
    [Category.BARBER]: string,
    [Category.NAIL]: string,
    [Category.BROWS]: string,
    [Category.MASSAGE]: string,
    [Category.MAKEUP]: string,
    [Category.SPA]: string,
    [Category.OTHER]: string,
}