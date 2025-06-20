import APIService from "./ApiService";
import type { BladeCoatingColor } from "@/app/Interfaces/BladeCoatingColor";
import type { BladeCoatingDTO } from "@/app/DTOs/BladeCoatingDTO";

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