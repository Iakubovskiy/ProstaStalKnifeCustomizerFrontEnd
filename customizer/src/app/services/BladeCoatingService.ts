import APIService from "./ApiService";
import BladeCoating from "../Models/BladeCoating";

class BladeCoatingService {
    private apiService: APIService;
    private resource: string;

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
        this.resource = "BladeCoating";
    }

    async getAll(): Promise<BladeCoating[]> {
        const response = await this.apiService.getAll<BladeCoating>(
            this.resource
        );
        return response;
    }

    async getById(id: number): Promise<BladeCoating> {
        const response = await this.apiService.getById<BladeCoating>(
            this.resource,
            id
        );
        return response;
    }

    async create(
        bladeCoatingColor: BladeCoating,
        material: File
    ): Promise<BladeCoating> {
        const formData = new FormData();

        formData.append("coatingJson", JSON.stringify(bladeCoatingColor));
        formData.append("material", material);

        const response = await this.apiService.create<BladeCoating>(
            this.resource,
            formData
        );
        return response;
    }

    async update(
        id: number,
        bladeCoating: BladeCoating,
        material: File | null
    ): Promise<BladeCoating> {
        const formData = new FormData();

        formData.append("coatingJson", JSON.stringify(bladeCoating));
        if (material) {
            formData.append("material", material);
        }

        const response = await this.apiService.update<BladeCoating>(
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

export default BladeCoatingService;