import APIService from "./ApiService";
import type { Handle } from "@/app/Interfaces/Handle";
import type { HandleColorDTO } from "@/app/DTOs/HandleColorDTO";

class HandleService {
    private apiService: APIService;
    private resource: string = "handle";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<Handle[]> {
        const res = await this.apiService.getAll<Handle>(this.resource);
        return res;
    }

    async getAllActive(): Promise<Handle[]> {
        const res = await this.apiService.getAll<Handle>(`${this.resource}/active`);
        return res;
    }

    async getById(id: string): Promise<Handle> {
        const res = await this.apiService.getById<Handle>(this.resource, id);
        return res;
    }

    async create(data: HandleColorDTO): Promise<Handle> {
        const createdDto = await this.apiService.create<Handle>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: HandleColorDTO): Promise<Handle> {
        const updatedDto = await this.apiService.update<Handle>(
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

export default HandleService;