import APIService from "./ApiService";
import type { Engraving } from "@/app/Interfaces/Engraving";
import type { EngravingDTO } from "@/app/DTOs/EngravingDTO";

class EngravingService {
  private apiService: APIService;
  private resource: string = "engravings";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<Engraving[]> {
    const res = await this.apiService.getAll<Engraving>(this.resource);
    return res;
  }

  async getAllActive(): Promise<Engraving[]> {
    const res = await this.apiService.getAll<Engraving>(
        `${this.resource}/active`
    );
    return res;
  }

  async getById(id: string): Promise<Engraving> {
    const res = await this.apiService.getById<Engraving>(this.resource, id);
    return res;
  }

  async create(data: EngravingDTO): Promise<Engraving> {
    const createdDto = await this.apiService.create<Engraving>(
        this.resource,
        data
    );
    return createdDto;
  }

  async update(id: string, data: EngravingDTO): Promise<Engraving> {
    const updatedDto = await this.apiService.update<Engraving>(
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

export default EngravingService;