import APIService from "./ApiService";
import type { SheathColor } from "@/app/Interfaces/SheathColor";
import type { SheathColorDTO } from "@/app/DTOs/SheathColorDTO";
import { SheathColorForCanvas } from "../Interfaces/Knife/SheathColorForCanvas";

class SheathColorService {
  private apiService: APIService;
  private resource: string = "sheath-colors";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<SheathColor[]> {
    const res = await this.apiService.getAll<SheathColor>(this.resource);
    return res;
  }

  async getAllActive(): Promise<SheathColor[]> {
    const res = await this.apiService.getAll<SheathColor>(
      `${this.resource}/active`
    );
    return res;
  }
  async getAllActiveForCanvas(): Promise<SheathColorForCanvas[]> {
    const fullObjects = await this.apiService.getAll<SheathColor>(
      `${this.resource}/active`
    );

    const canvasObjects = fullObjects.map((item) => {
      const canvasObject: SheathColorForCanvas = {
        id: item.id,
        prices: item.prices || [],
        colorCode: item.colorCode || "#808080",
        engravingColorCode: item.engravingColorCode || "#FFFFFF",
        colorMap: item.colorMap,
        normalMap: item.texture?.normalMap || null,
        roughnessMap: item.texture?.roughnessMap || null,
        color: item.color,
      };
      return canvasObject;
    });

    return canvasObjects;
  }

  async getById(id: string): Promise<SheathColor> {
    const res = await this.apiService.getById<SheathColor>(this.resource, id);
    return res;
  }

  async create(data: SheathColorDTO): Promise<SheathColor> {
    const createdDto = await this.apiService.create<SheathColor>(
      this.resource,
      data
    );
    return createdDto;
  }

  async update(id: string, data: SheathColorDTO): Promise<SheathColor> {
    const updatedDto = await this.apiService.update<SheathColor>(
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

export default SheathColorService;
