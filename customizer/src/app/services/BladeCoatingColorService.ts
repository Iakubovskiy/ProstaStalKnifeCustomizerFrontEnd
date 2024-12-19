import APIService from "./ApiService";
import BladeCoatingColor from "../Models/BladeCoatingColor";

class BladeCoatingColorService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "BladeCoatingColor";
  }

  // Get all BladeCoatingColors
  async getAll(): Promise<BladeCoatingColor[]> {
    const response = await this.apiService.getAll<BladeCoatingColor>(
      this.resource
    );
    return response;
  }

  // Get BladeCoatingColor by id
  async getById(id: number): Promise<BladeCoatingColor> {
    const response = await this.apiService.getById<BladeCoatingColor>(
      this.resource,
      id
    );
    return response;
  }

  // Create new BladeCoatingColor
  async create(
    bladeCoatingColor: BladeCoatingColor
  ): Promise<BladeCoatingColor> {
    const formData = new FormData();

    // Add data as form fields
    formData.append("Id", "0");
    formData.append("Color", bladeCoatingColor.color);
    formData.append("ColorCode", bladeCoatingColor.colorCode);
    formData.append("EngravingColorCode", bladeCoatingColor.engravingColorCode);

    const response = await this.apiService.create<BladeCoatingColor>(
      this.resource,
      formData
    );
    return response;
  }

  // Update BladeCoatingColor
  async update(
    id: number,
    bladeCoatingColor: BladeCoatingColor
  ): Promise<BladeCoatingColor> {
    const formData = new FormData();

    // Add data as form fields
    formData.append("Id", "0");
    formData.append("Color", bladeCoatingColor.color);
    formData.append("ColorCode", bladeCoatingColor.colorCode);
    formData.append("EngravingColorCode", bladeCoatingColor.engravingColorCode);

    const response = await this.apiService.update<BladeCoatingColor>(
      this.resource,
      id,
      formData
    );
    return response;
  }

  // Delete BladeCoatingColor
  async delete(id: number): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }
}

export default BladeCoatingColorService;
