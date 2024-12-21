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

  async getById(id: number): Promise<Fastening> {
    const response = await this.apiService.getById<Fastening>(
      this.resource,
      id
    );
    return response;
  }

  async create(fastening: Fastening, model: File): Promise<Fastening> {
    const formData = new FormData();

    formData.append("Id", "0");
    formData.append("Name", fastening.name);
    formData.append("Color", fastening.color);
    formData.append("ColorCode", fastening.colorCode);
    formData.append("price", fastening.price.toString());
    formData.append("Material", fastening.material);
    formData.append("ModelUrl", fastening.modelUrl? fastening.modelUrl: "");
    formData.append("model", model);
    const response = await this.apiService.create<Fastening>(
      this.resource,
      formData
    );

    formData.append("model", model);
    return response;
  }

  // Оновити Fastening
  async update(
    id: number,
    fastening: Fastening,
    model: File | null
  ): Promise<Fastening> {
    const formData = new FormData();

    // Додаємо дані як звичайні поля
    formData.append("Id", "0");
    formData.append("Name", fastening.name);
    formData.append("Color", fastening.color);
    formData.append("ColorCode", fastening.colorCode);
    formData.append("price", fastening.price.toString());
    formData.append("Material", fastening.material);
    formData.append("ModelUrl", fastening.modelUrl);
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

  // Видалити Fastening
  async delete(id: number): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }
}

export default FasteningService;
