import APIService from "./ApiService";
import type { Attachment } from "@/app/Interfaces/Attachment";
import type { AttachmentDTO } from "@/app/DTOs/AttachmentDTO";

class AttachmentService {
    private apiService: APIService;
    private resource: string = "attachments";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<Attachment[]> {
        const res = await this.apiService.getAll<Attachment>(this.resource);
        return res;
    }

    async getAllActive(): Promise<Attachment[]> {
        const res = await this.apiService.getAll<Attachment>(
            `${this.resource}/active`
        );
        return res;
    }

    async getById(id: string): Promise<Attachment> {
        const res = await this.apiService.getById<Attachment>(this.resource, id);
        return res;
    }

    async create(attachmentData: AttachmentDTO): Promise<Attachment> {
        const createdDto = await this.apiService.create<Attachment>(
            this.resource,
            attachmentData
        );
        return createdDto;
    }

    async update(id: string, attachmentData: AttachmentDTO): Promise<Attachment> {
        const updatedDto = await this.apiService.update<Attachment>(
            this.resource,
            id,
            attachmentData
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

export default AttachmentService;