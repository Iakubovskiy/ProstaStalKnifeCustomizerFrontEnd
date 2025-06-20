import APIService from "./ApiService";
import type { BladeShape } from "@/app/Interfaces/BladeShape";
import type { BladeShapeDTO } from "@/app/DTOs/BladeShapeDTO";
import { BladeShapeForCanvas } from "../Interfaces/Knife/BladeShapeForCanvas";

class BladeShapeService {
  private apiService: APIService;
  private resource: string = "blade-shapes";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<BladeShape[]> {
    const res = await this.apiService.getAll<BladeShape>(this.resource);
    return res;
  }

  async getAllActive(): Promise<BladeShape[]> {
    const res = await this.apiService.getAll<BladeShape>(
      `${this.resource}/active`
    );
    return res;
  }
  async getAllActiveForCanvas(): Promise<BladeShapeForCanvas[]> {
    // 1. Отримуємо повні об'єкти з API
    const fullObjects = await this.apiService.getAll<BladeShape>(
      `${this.resource}/active`
    );

    const locale = new APIService().getCurrentLocale();
    const canvasObjects = fullObjects.map((item) => {
      const canvasObject: BladeShapeForCanvas = {
        id: item.id,
        shapeType: item.shapeType,
        price: item.price || 0,
        bladeShapeImage: item.bladeShapeImage || null,
        name: item.names?.[locale] || item.name || "",
        bladeShapeModel: item.bladeShapeModel,
        sheathModel: item.sheath?.model || null,
      };
      return canvasObject;
    });

    return canvasObjects;
  }

  async getById(id: string): Promise<BladeShape> {
    const res = await this.apiService.getById<BladeShape>(this.resource, id);
    return res;
  }

  async create(data: BladeShapeDTO): Promise<BladeShape> {
    const createdDto = await this.apiService.create<BladeShape>(
      this.resource,
      data
    );
    return createdDto;
  }

  async update(id: string, data: BladeShapeDTO): Promise<BladeShape> {
    const updatedDto = await this.apiService.update<BladeShape>(
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

export default BladeShapeService;
