// /services/HandleService.ts

import APIService from "./ApiService";
import { Handle } from "@/app/Interfaces/Handle";
import { HandleColorDTO } from "@/app/DTOs/HandleColorDTO";

class HandleService {
  private apiService: APIService;
  private resource: string = "handles";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  // Методи GET залишаються без змін
  async getAll(): Promise<Handle[]> {
    return this.apiService.getAll<Handle>(this.resource);
  }

  async getAllActive(): Promise<Handle[]> {
    return this.apiService.getAll<Handle>(`${this.resource}/active`);
  }

  async getById(id: string): Promise<Handle> {
    return this.apiService.getById<Handle>(this.resource, id);
  }

  // --- ВИПРАВЛЕНО ТУТ ---
  private mapModelToDto(
    data: Partial<Handle>,
    bladeShapeTypeId: string | null
  ): HandleColorDTO {
    if (!bladeShapeTypeId) {
      throw new Error(
        "Blade Shape Type ID є обов'язковим для створення/оновлення руків'я."
      );
    }

    // Перевіряємо, чи `colors` та `materials` не є порожніми
    if (!data.colors || Object.keys(data.colors).length === 0) {
      throw new Error("Поле 'Colors' є обов'язковим і не може бути порожнім.");
    }
    if (!data.materials || Object.keys(data.materials).length === 0) {
      throw new Error(
        "Поле 'Materials' є обов'язковим і не може бути порожнім."
      );
    }

    return {
      // Використовуємо правильні імена полів: `colors` та `materials`
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

  async create(
    data: Omit<Handle, "id">,
    bladeShapeTypeId: string
  ): Promise<Handle> {
    const dtoToSend = this.mapModelToDto(data, bladeShapeTypeId);
    return this.apiService.create<Handle>(this.resource, dtoToSend);
  }

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
