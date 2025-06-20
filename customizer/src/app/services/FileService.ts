import APIService from "./ApiService";
import type { File } from "@/app/Interfaces/File";

class FileService {
    private apiService: APIService;
    private resource: string = "files";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getById(id: string): Promise<File> {
        const res = await this.apiService.getById<File>(this.resource, id);
        return res;
    }

    async upload(file: globalThis.File): Promise<File> {
        const formData = new FormData();
        formData.append("file", file);
        const res = await this.apiService.create<File>(
            `${this.resource}/upload`,
            formData
        );
        return res;
    }

    async uploadMultiple(files: globalThis.File[]): Promise<File[]> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        const res = await this.apiService.create<File[]>(
            `${this.resource}/upload-multiple`,
            formData
        );
        return res;
    }

    async delete(id: string): Promise<void> {
        await this.apiService.delete<void>(this.resource, id);
    }
}

export default FileService;