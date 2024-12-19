import APIService from "./ApiService";
import SheathColor from "../Models/SheathColor"; // Шлях до моделі

class SheathColorService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "SheathColor";
  }

  async getAll(): Promise<SheathColor[]> {
    const response = await this.apiService.getAll<SheathColor>(this.resource);
    return response; // Тут вже повернені `SheathColor[]`
  }

  async getById(id: number): Promise<SheathColor> {
    const response = await this.apiService.getById<SheathColor>(
      this.resource,
      id
    );
    return response; // Об'єкт типу `SheathColor`
  }

  async create(color: SheathColor, material: File): Promise<SheathColor> {
    const formData = new FormData();
    formData.append("color", JSON.stringify(color));
    formData.append("material", material);

    const response = await this.apiService.create<SheathColor>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: number,
    color: SheathColor,
    material?: File
  ): Promise<SheathColor> {
    const formData = new FormData();
    formData.append("color", JSON.stringify(color));
    if (material) {
      formData.append("material", material);
    }

    const response = await this.apiService.update<SheathColor>(
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
    return response.isDeleted; // Повертає результат видалення
  }
}

export default SheathColorService;
