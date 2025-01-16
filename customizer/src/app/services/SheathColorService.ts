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

  async getById(id: string): Promise<SheathColor> {
    const response = await this.apiService.getById<SheathColor>(
      this.resource,
      id
    );
    return response;
  }

  async create(
      color: SheathColor,
      colorMap: File | null,
      normalMap: File | null,
      roughnessMap: File | null
  ): Promise<SheathColor> {
    const formData = new FormData();
    formData.append("Color", color.color);
    formData.append("ColorCode", color.colorCode);
    formData.append("Material", color.material);
    formData.append("Price", color.price.toString());
    formData.append("EngravingColorCode", color.engravingColorCode);
    formData.append("IsActive", color.isActive.toString());
    formData.append("ColorMapUrl", "1");
    formData.append("NormalMapUrl", "1");
    formData.append("RoughnessMapUrl", "1");
    if(colorMap)
      formData.append("colorMap", colorMap);
    if (normalMap)
      formData.append("normalMap", normalMap);
    if(roughnessMap)
      formData.append("roughnesMap", roughnessMap);

    const response = await this.apiService.create<SheathColor>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: string,
    color: SheathColor,
    colorMap: File | null,
    normalMap: File | null,
    roughnessMap: File | null
  ): Promise<SheathColor> {
    const formData = new FormData();
    formData.append("Color", color.color);
    formData.append("ColorCode", color.colorCode);
    formData.append("Material", color.material);
    formData.append("Price", color.price.toString());
    formData.append("EngravingColorCode", color.engravingColorCode);
    formData.append("IsActive", color.isActive.toString());
    formData.append("ColorMapUrl", "1");
    formData.append("NormalMapUrl", "1");
    formData.append("RoughnessMapUrl", "1");
    if(colorMap)
      formData.append("colorMap", colorMap);
    if (normalMap)
      formData.append("normalMap", normalMap);
    if(roughnessMap)
      formData.append("roughnesMap", roughnessMap);

    const response = await this.apiService.update<SheathColor>(
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

  async activate(id: string): Promise<SheathColor> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<SheathColor>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }
  async deactivate(id: string): Promise<SheathColor> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<SheathColor>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default SheathColorService;
