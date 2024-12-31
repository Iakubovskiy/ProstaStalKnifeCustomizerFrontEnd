import APIService from "./ApiService";
import SheathColor from "../Models/SheathColor";

class SheathColorService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "SheathColor";
  }

  async getAll(): Promise<SheathColor[]> {
    const response = await this.apiService.getAll<SheathColor>(this.resource);
    return response;
  }

  async getById(id: number): Promise<SheathColor> {
    const response = await this.apiService.getById<SheathColor>(
      this.resource,
      id
    );
    return response;
  }

  async create(color: SheathColor, material: File): Promise<SheathColor> {
    const formData = new FormData();
    formData.append("Id", "0");
    formData.append("Color", color.colorName);
    formData.append("ColorCode", color.colorCode);
    formData.append("Material", color.material);
    formData.append("MaterialUrl", "");
    formData.append("Price", color.price.toString());
    formData.append("handleMaterial", material);
    formData.append("EngravingColorCode", color.EngravingColorCode);

    const response = await this.apiService.create<SheathColor>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: number,
    color: SheathColor,
    material?: File
  ): Promise<SheathColor> {
    const formData = new FormData();
    formData.append("Id", "0");
    formData.append("Color", color.colorName);
    formData.append("ColorCode", color.colorCode);
    formData.append("Material", color.material);
    formData.append("MaterialUrl", "");
    formData.append("Price", color.price.toString());
    formData.append("EngravingColorCode", color.EngravingColorCode);
    if (material) {
      formData.append("handleMaterial", material);
    }

    const response = await this.apiService.update<SheathColor>(
      this.resource,
      id,
      formData
    );
    return response;
  }

  async delete(id: number): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }
}

export default SheathColorService;
