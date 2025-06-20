import APIService from "./ApiService";
import type { Currency } from "@/app/Interfaces/Currency";

class CurrencyService {
    private apiService: APIService;
    private resource: string = "currencies";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<Currency[]> {
        const res = await this.apiService.getAll<Currency>(this.resource);
        return res;
    }

    async getById(id: string): Promise<Currency> {
        const res = await this.apiService.getById<Currency>(this.resource, id);
        return res;
    }

    async create(data: Omit<Currency, "id">): Promise<Currency> {
        const createdDto = await this.apiService.create<Currency>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: Omit<Currency, "id">): Promise<Currency> {
        const updatedDto = await this.apiService.update<Currency>(
            this.resource,
            id,
            data
        );
        return updatedDto;
    }

    async delete(id: string): Promise<void> {
        await this.apiService.delete<void>(this.resource, id);
    }
}

export default CurrencyService;