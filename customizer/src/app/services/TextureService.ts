// /services/TextureService.ts

import APIService from "./ApiService";

type TextureApiObject = {
  id?: string;
  name?: string;
  normalMapId: string;
  roughnessMapId: string;
};

class TextureService {
  private apiService: APIService;
  private resource: string = "textures";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  private mapModelToApi(model: Partial<Texture>): Omit<TextureApiObject, "id"> {
    if (!model.normalMap?.id || !model.roughnessMap?.id) {
      throw new Error("Normal Map ID and Roughness Map ID are required.");
    }
    return {
      name: model.name,
      normalMapId: model.normalMap.id,
      roughnessMapId: model.roughnessMap.id,
    };
  }

  /**
   * Отримує всі текстури.
   * @returns Масив об'єктів Texture.
   */
  async getAll(): Promise<Texture[]> {
    const apiObjects = await this.apiService.getAll<Texture>(this.resource);
    return apiObjects;
  }

  async getById(id: string): Promise<Texture> {
    const apiObject = await this.apiService.getById<Texture>(this.resource, id);
    return apiObject;
  }

  /**
   * Створює нову текстуру.
   * @param data - Дані для створення у форматі моделі Texture.
   * @returns Створений об'єкт Texture.
   */
  async create(data: Omit<Texture, "id">): Promise<Texture> {
    const apiObject = this.mapModelToApi(data);
    const createdApiObject = await this.apiService.create<Texture>(
      this.resource,
      apiObject
    );
    return createdApiObject;
  }

  async update(id: string, data: Texture): Promise<Texture> {
    const apiObject = this.mapModelToApi(data);
    const updatedApiObject = await this.apiService.update<Texture>(
      this.resource,
      id,
      apiObject
    );
    return updatedApiObject;
  }

  /**
   * Видаляє текстуру за ID.
   * @param id - ID об'єкта для видалення.
   */
  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }
}

export default TextureService;
