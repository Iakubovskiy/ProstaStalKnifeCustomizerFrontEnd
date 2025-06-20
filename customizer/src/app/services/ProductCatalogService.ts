import APIService from "./ApiService";
import type { PaginatedResult } from "@/app/Interfaces/PaginatedResult";
import type { AnyProduct } from "@/app/Interfaces/AnyProduct";
import type { ProductFilters } from "@/app/DTOs/ProductFilters";

class ProductCatalogService {
    private apiService: APIService;
    private resource: string = "products/catalog";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getProducts(
        filters: ProductFilters = {}
    ): Promise<PaginatedResult<AnyProduct>> {
        const params = new URLSearchParams();

        for (const key in filters) {
            const value = filters[key as keyof ProductFilters];
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach((item) => params.append(key, item.toString()));
                } else {
                    params.append(key, value.toString());
                }
            }
        }

        const queryString = params.toString();
        const url = queryString ? `${this.resource}?${queryString}` : this.resource;

        const res = await this.apiService.get<PaginatedResult<AnyProduct>>(url);
        return res;
    }
}

export default ProductCatalogService;