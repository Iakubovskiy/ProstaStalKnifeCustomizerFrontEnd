export interface ProductFilters {
    productType?: "knife" | "sheath" | "attachment";
    styles?: string[];
    minBladeLength?: number;
    maxBladeLength?: number;
    minTotalLength?: number;
    maxTotalLength?: number;
    minBladeWidth?: number;
    maxBladeWidth?: number;
    minBladeWeight?: number;
    maxBladeWeight?: number;
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
}