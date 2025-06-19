// /services/BladeShapeTypeService.ts

import APIService from "./ApiService";

class BladeShapeTypeService {
  private apiService: APIService;
  private resource: string = "blade-shape-types";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<BladeShapeType[]> {
    return this.apiService.getAll<BladeShapeType>(this.resource);
  }

  async getById(id: string): Promise<BladeShapeType> {
    return this.apiService.getById<BladeShapeType>(this.resource, id);
  }

  async create(data: Omit<BladeShapeType, "id">): Promise<BladeShapeType> {
    // Відправляємо об'єкт з полем 'name: string', як і вимагає API
    return this.apiService.create<BladeShapeType>(this.resource, data);
  }

  async update(id: string, data: BladeShapeType): Promise<BladeShapeType> {
    return this.apiService.update<BladeShapeType>(this.resource, id, data);
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }
}

export default BladeShapeTypeService;
