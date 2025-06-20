import APIService from "./ApiService";
import type { CompletedSheath } from "@/app/Interfaces/CompletedSheath";
import type { CompletedSheathDTO } from "@/app/DTOs/CompletedSheathDTO";

class CompletedSheathService {
    private apiService: APIService;
    private resource: string = "products/completed-sheath";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<CompletedSheath[]> {
        const res = await this.apiService.getAll<CompletedSheath>(this.resource);
        return res;
    }

    async getAllActive(): Promise<CompletedSheath[]> {
        const res = await this.apiService.getAll<CompletedSheath>(
            `${this.resource}/active`
        );
        return res;
    }

    async getById(id: string): Promise<CompletedSheath> {
        const res = await this.apiService.getById<CompletedSheath>(
            this.resource,
            id
        );
        return res;
    }

    async create(data: CompletedSheathDTO): Promise<CompletedSheath> {
        const createdDto = await this.apiService.create<CompletedSheath>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: CompletedSheathDTO): Promise<CompletedSheath> {
        const updatedDto = await this.apiService.update<CompletedSheath>(
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

export default CompletedSheathService;