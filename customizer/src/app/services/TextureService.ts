import APIService from "./ApiService";
import type { Texture } from "@/app/Interfaces/Texture";
import type { TextureDTO } from "@/app/DTOs/TextureDTO";

class TextureService {
  private apiService: APIService;
  private resource: string = "textures";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<Texture[]> {
    const res = await this.apiService.getAll<Texture>(this.resource);
    return res;
  }

  async getAllActive(): Promise<Texture[]> {
    const res = await this.apiService.getAll<Texture>(
        `${this.resource}/active`
    );
    return res;
  }

  async getById(id: string): Promise<Texture> {
    const res = await this.apiService.getById<Texture>(this.resource, id);
    return res;
  }

  async create(data: TextureDTO): Promise<Texture> {
    const createdDto = await this.apiService.create<Texture>(
        this.resource,
        data
    );
    return createdDto;
  }

  async update(id: string, data: TextureDTO): Promise<Texture> {
    const updatedDto = await this.apiService.update<Texture>(
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

export default TextureService;