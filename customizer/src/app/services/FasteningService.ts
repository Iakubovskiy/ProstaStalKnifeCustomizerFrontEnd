import APIService from "./ApiService";
import Fastening from "../Models/Fastening";

class FasteningService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Fastening";
  }

  async getAll(): Promise<Fastening[]> {
    const response = await this.apiService.getAll<Fastening>(this.resource);
    return response;
  }

  async getAllActive(): Promise<Fastening[]> {
    const response = await this.apiService.getAll<Fastening>(
        `${this.resource}/active`
    );
    return response;
  }

  async getById(id: string): Promise<Fastening> {
    const response = await this.apiService.getById<Fastening>(
      this.resource,
      id
    );
    return response;
  }

  async create(fastening: Fastening, model: File): Promise<Fastening> {
    const formData = new FormData();
    formData.append("Name", fastening.name);
    formData.append("Color", fastening.color);
    formData.append("ColorCode", fastening.colorCode);
    formData.append("price", fastening.price.toString());
    formData.append("Material", fastening.material);
    formData.append("ModelUrl", fastening.modelUrl? fastening.modelUrl: "");
    formData.append("IsActive", fastening.isActive.toString());
    formData.append("model", model);
    const response = await this.apiService.create<Fastening>(
      this.resource,
      formData
    );

    formData.append("model", model);
    return response;
  }

  async update(
    id: string,
    fastening: Fastening,
    model: File | null
  ): Promise<Fastening> {
    const formData = new FormData();
    formData.append("Name", fastening.name);
    formData.append("Color", fastening.color);
    formData.append("ColorCode", fastening.colorCode);
    formData.append("price", fastening.price.toString());
    formData.append("Material", fastening.material);
    formData.append("ModelUrl", fastening.modelUrl);
    formData.append("IsActive", fastening.isActive.toString());
    if (model) {
      formData.append("model", model);
    }
    const response = await this.apiService.update<Fastening>(
      this.resource,
      id,
      formData
    );
    return response;
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }

  async activate(id: string): Promise<Fastening> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<Fastening>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }

  async deactivate(id: string): Promise<Fastening> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<Fastening>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default FasteningService;
