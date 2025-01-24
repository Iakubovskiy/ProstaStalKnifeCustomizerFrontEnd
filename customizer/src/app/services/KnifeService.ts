import APIService from "./ApiService";
import Knife from "../Models/Knife";

class KnifeService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Knife";
  }
  async getAll(): Promise<Knife[]> {
    const response = await this.apiService.getAll<Knife>(this.resource);
    return response;
  }
  async getAllActive(): Promise<Knife[]> {
    const response = await this.apiService.getAll<Knife>(
        `${this.resource}/active`
    );
    return response;
  }
  async getById(id: string): Promise<Knife> {
    const response = await this.apiService.getById<Knife>(this.resource, id);
    return response;
  }
  async create(knife: Knife): Promise<Knife> {
    const formData = new FormData();
    formData.append("ShapeId", knife.shape.id.toString());
    formData.append(
      "BladeCoatingColorId",
      knife.bladeCoatingColor.id.toString()
    );
    formData.append("HandleColorId", knife.handleColor.id.toString());
    formData.append("SheathColorId", knife.sheathColor.id.toString());
    if(knife.fastening)
      formData.append(`FasteningId`, knife.fastening.id.toString());
    if (knife.engravings && knife.engravings.length > 0) {
      const engravingIds = knife.engravings.map((eng) => eng.id);
      formData.append("EngravingsJson", JSON.stringify(engravingIds));
    }
    const response = await this.apiService.create<Knife>(
      this.resource,
      formData
    );
    return response;
  }
  async update(id: string, knife: Knife): Promise<Knife> {
    const formData = new FormData();
    formData.append("ShapeId", knife.shape.id.toString());
    formData.append(
      "BladeCoatingColorId",
      knife.bladeCoatingColor.id.toString()
    );
    formData.append("HandleColorId", knife.handleColor.id.toString());
    formData.append("SheathColorId", knife.sheathColor.id.toString());
    if(knife.fastening)
      formData.append(`FasteningId`, knife.fastening.id.toString());
    knife.engravings?.forEach((engraving, index) => {
      formData.append(`Engravings[${index}]`, engraving.id.toString());
    });
    const response = await this.apiService.update<Knife>(
      this.resource,
      id,
      formData
    );
    return response;
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }

  async activate(id: string): Promise<Knife> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<Knife>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }

  async deactivate(id: string): Promise<Knife> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<Knife>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default KnifeService;
