import APIService from "./ApiService";
import type { EngravingTag } from "@/app/Interfaces/EngravingTag";
import type { EngravingTagDTO } from "@/app/DTOs/EngravingTagDTO";

class EngravingTagService {
    private apiService: APIService;
    private resource: string = "engraving-tags";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<EngravingTag[]> {
        const res = await this.apiService.getAll<EngravingTag>(this.resource);
        return res;
    }

    async getAllActive(): Promise<EngravingTag[]> {
        const res = await this.apiService.getAll<EngravingTag>(
            `${this.resource}/active`
        );
        return res;
    }

    async getById(id: string): Promise<EngravingTag> {
        const res = await this.apiService.getById<EngravingTag>(this.resource, id);
        return res;
    }

    async create(data: EngravingTagDTO): Promise<EngravingTag> {
        const createdDto = await this.apiService.create<EngravingTag>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: EngravingTagDTO): Promise<EngravingTag> {
        const updatedDto = await this.apiService.update<EngravingTag>(
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

export default EngravingTagService;