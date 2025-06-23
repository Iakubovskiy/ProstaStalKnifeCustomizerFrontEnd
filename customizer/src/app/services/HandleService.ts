// /services/HandleService.ts

import APIService from "./ApiService";
import { Handle } from "@/app/Interfaces/Handle";
import { HandleColorDTO } from "@/app/DTOs/HandleColorDTO";
import { HandleColorForCanvas } from "../Interfaces/Knife/HandleColorForCanvas";

class HandleService {
  private apiService: APIService;
  // Згідно зі Swagger, ресурс називається "handles" у множині
  private resource: string = "handles";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  // Методи GET повертають модель Handle, яка зручна для UI
  async getAll(): Promise<Handle[]> {
    return this.apiService.getAll<Handle>(this.resource);
  }

  async getAllActive(): Promise<Handle[]> {
    return this.apiService.getAll<Handle>(`${this.resource}/active`);
  }
  async getAllActiveForCanvas(): Promise<HandleColorForCanvas[]> {
    const fullObjects = await this.apiService.getAll<Handle>(
      `${this.resource}/active`
    );
    const canvasObjects = fullObjects.map((item) => {
      const canvasObject: HandleColorForCanvas = {
        id: item.id,
        price: item.price || 0,
        colorCode: item.colorCode || "#FFFFFF",
        modelUrl: (item as any).handleModelUrl || null,
        colorMap: item.colorMap,
        normalMap: item.texture?.normalMap || null,
        roughnessMap: item.texture?.roughnessMap || null,
        color: item.color,
        material: item.material,
      };
      return canvasObject;
    });

    return canvasObjects;
  }
  async getById(id: string): Promise<Handle> {
    return this.apiService.getById<Handle>(this.resource, id);
  }

  // Приватний метод для перетворення моделі Handle у HandleColorDTO
  private mapModelToDto(
    data: Partial<Handle>,
    bladeShapeTypeId: string | null
  ): HandleColorDTO {
    // Перевірка наявності обов'язкового поля
    if (!bladeShapeTypeId) {
      throw new Error(
        "Blade Shape Type ID є обов'язковим для створення/оновлення руків'я."
      );
    }

    return {
      colors: data.colors,
      colorCode: data.colorCode,
      isActive: data.isActive ?? true,
      materials: data.materials,
      textureId: data.texture?.id,
      colorMapId: data.colorMap?.id,
      handleModelId: undefined,
      price: data.price ?? 0,
      bladeShapeTypeId: bladeShapeTypeId,
    };
  }

  /**
   * Створює нове руків'я.
   * @param data - Дані у форматі моделі Handle
   * @param bladeShapeTypeId - ID типу форми леза, для якого створюється руків'я
   */
  async create(
    data: Omit<Handle, "id">,
    bladeShapeTypeId: string
  ): Promise<Handle> {
    const dtoToSend = this.mapModelToDto(data, bladeShapeTypeId);
    return this.apiService.create<Handle>(this.resource, dtoToSend);
  }

  /**
   * Оновлює існуюче руків'я.
   * @param id - ID руків'я
   * @param data - Нові дані у форматі моделі Handle
   * @param bladeShapeTypeId - ID типу форми леза
   */
  async update(
    id: string,
    data: Handle,
    bladeShapeTypeId: string
  ): Promise<Handle> {
    const dtoToSend = this.mapModelToDto(data, bladeShapeTypeId);
    return this.apiService.update<Handle>(this.resource, id, dtoToSend);
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<Handle> {
    return this.apiService.partialUpdate<Handle>(
      `${this.resource}/activate`,
      id,
      {}
    );
  }

  async deactivate(id: string): Promise<Handle> {
    return this.apiService.partialUpdate<Handle>(
      `${this.resource}/deactivate`,
      id,
      {}
    );
  }
}

export default HandleService;
