import APIService from "./ApiService";
import type { Knife } from "@/app/Interfaces/Knife/Knife";
import type { KnifeDTO } from "@/app/DTOs/KnifeDTO";

class KnifeService {
    private apiService: APIService;
    private resource: string = "knife";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<Knife[]> {
        const res = await this.apiService.getAll<Knife>(this.resource);
        return res;
    }

    async getAllActive(): Promise<Knife[]> {
        const res = await this.apiService.getAll<Knife>(`${this.resource}/active`);
        return res;
    }

    async getById(id: string): Promise<Knife> {
        const res = await this.apiService.getById<Knife>(this.resource, id);
        return res;
    }

    async create(data: KnifeDTO): Promise<Knife> {
        const createdDto = await this.apiService.create<Knife>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: KnifeDTO): Promise<Knife> {
        const updatedDto = await this.apiService.update<Knife>(
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

export default KnifeService;