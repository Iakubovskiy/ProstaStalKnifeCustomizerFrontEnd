import APIService from "./ApiService";
import HandleColor from "../Models/HandleColor";

class HandleColorService {
    private apiService: APIService;
    private resource: string;

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
        this.resource = "HandleColor";
    }

    async getAll(): Promise<HandleColor[]> {
        const response = await this.apiService.getAll<HandleColor>(this.resource);
        return response;
    }

    async getById(id: number): Promise<HandleColor> {
        const response = await this.apiService.getById<HandleColor>(
            this.resource,
            id
        );
        return response;
    }

    async create(color: HandleColor, material: File): Promise<HandleColor> {
        const formData = new FormData();
        formData.append("color", JSON.stringify(color));
        formData.append("material", material);

        const response = await this.apiService.create<HandleColor>(
            this.resource,
            formData
        );
        return response;
    }

    async update(
        id: number,
        color: HandleColor,
        material?: File
    ): Promise<HandleColor> {
        const formData = new FormData();
        formData.append("color", JSON.stringify(color));
        if (material) {
            formData.append("material", material);
        }

        const response = await this.apiService.update<HandleColor>(
            this.resource,
            id,
            formData
        );
        return response;
    }

    async delete(id: number): Promise<boolean> {
        const response = await this.apiService.delete<{ isDeleted: boolean }>(
            this.resource,
            id
        );
        return response.isDeleted;
    }
}

export default HandleColorService;