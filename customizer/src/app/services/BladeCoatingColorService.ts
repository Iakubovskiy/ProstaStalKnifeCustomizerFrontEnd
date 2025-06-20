import APIService from "./ApiService";
import type { BladeCoatingColor } from "@/app/Interfaces/BladeCoatingColor";
import type { BladeCoatingDTO } from "@/app/DTOs/BladeCoatingDTO";
import { BladeCoatingColorForCanvas } from "../Interfaces/Knife/BladeCoatingColorForCanvas";

class BladeCoatingColorService {
  private apiService: APIService;
  private resource: string = "blade-coating-colors";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<BladeCoatingColor[]> {
    const res = await this.apiService.getAll<BladeCoatingColor>(this.resource);
    return res;
  }

  async getAllActive(): Promise<BladeCoatingColor[]> {
    const res = await this.apiService.getAll<BladeCoatingColor>(
      `${this.resource}/active`
    );
    return res;
  }

  async getAllActiveForCanvas(): Promise<BladeCoatingColorForCanvas[]> {
    // 1. Отримуємо повні об'єкти з API
    const fullObjects = await this.apiService.getAll<BladeCoatingColor>(
      `${this.resource}/active`
    );

    // 2. Перетворюємо (мапимо) кожен повний об'єкт на полегшену версію
    const canvasObjects = fullObjects.map((item) => {
      // Створюємо новий об'єкт, що відповідає інтерфейсу BladeCoatingColorForCanvas
      const canvasObject: BladeCoatingColorForCanvas = {
        id: item.id,
        colorCode: item.colorCode || "#1810f3",
        engravingColorCode: item.engravingColorCode,
        colorMap: item.colorMap || null,
        normalMap: item.texture?.normalMap || null,
        roughnessMap: item.texture?.roughnessMap || null,
      };
      return canvasObject;
    });

    return canvasObjects;
  }
  async getById(id: string): Promise<BladeCoatingColor> {
    const res = await this.apiService.getById<BladeCoatingColor>(
      this.resource,
      id
    );
    return res;
  }

  async create(data: BladeCoatingDTO): Promise<BladeCoatingColor> {
    const createdDto = await this.apiService.create<BladeCoatingColor>(
      this.resource,
      data
    );
    return createdDto;
  }

  async update(id: string, data: BladeCoatingDTO): Promise<BladeCoatingColor> {
    const updatedDto = await this.apiService.update<BladeCoatingColor>(
      this.resource,
      id,
      data
    );
    return updatedDto;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<void> {
    await this.apiService.partialUpdate<void>(
      `${this.resource}/activate`,
      id,
      {}
    );
  }

  async deactivate(id: string): Promise<void> {
    await this.apiService.partialUpdate<void>(
      `${this.resource}/deactivate`,
      id,
      {}
    );
  }
}

export default BladeCoatingColorService;
