import APIService from "./ApiService";
import type { Sheath } from "@/app/Interfaces/Sheath";
import type { SheathDTO } from "@/app/DTOs/SheathDTO";

class SheathService {
    private apiService: APIService;
    private resource: string = "sheaths";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<Sheath[]> {
        const res = await this.apiService.getAll<Sheath>(this.resource);
        return res;
    }

    async getAllActive(): Promise<Sheath[]> {
        const res = await this.apiService.getAll<Sheath>(`${this.resource}/active`);
        return res;
    }

    async getById(id: string): Promise<Sheath> {
        const res = await this.apiService.getById<Sheath>(this.resource, id);
        return res;
    }

    async create(data: SheathDTO): Promise<Sheath> {
        const createdDto = await this.apiService.create<Sheath>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: SheathDTO): Promise<Sheath> {
        const updatedDto = await this.apiService.update<Sheath>(
            this.resource,
            id,
            data
        );
        return updatedDto;
    }

    async delete(id: string): Promise<void> {
        await this.apiService.delete<void>(this.resource, id);
    }

    async activate(id: string): Promise<void> {
        await this.apiService.partialUpdate<void>(
            `${this.resource}/activate`,
            id,
            {}
        );
    }

    async deactivate(id: string): Promise<void> {
        await this.apiService.partialUpdate<void>(
            `${this.resource}/deactivate`,
            id,
            {}
        );
    }
}

export default SheathService;