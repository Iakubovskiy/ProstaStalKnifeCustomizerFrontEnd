import APIService from "./ApiService";
import type { BladeShape } from "@/app/Interfaces/BladeShape";
import type { BladeShapeDTO } from "@/app/DTOs/BladeShapeDTO";

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