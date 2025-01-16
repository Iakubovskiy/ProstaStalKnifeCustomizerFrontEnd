import APIService from "./ApiService";
import BladeCoatingColor from "../Models/BladeCoatingColor";

class BladeCoatingColorService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "BladeCoatingColor";
  }

  async getAll(): Promise<BladeCoatingColor[]> {
    const response = await this.apiService.getAll<BladeCoatingColor>(
      this.resource
    );
    return response;
  }

  async getById(id: string): Promise<BladeCoatingColor> {
    const response = await this.apiService.getById<BladeCoatingColor>(
      this.resource,
      id
    );
    return response;
  }

  async create(
    bladeCoatingColor: BladeCoatingColor,
    colorMap: File | null,
    normalMap: File | null,
    roughnessMap: File | null
  ): Promise<BladeCoatingColor> {
    const formData = new FormData();
    formData.append("Type", bladeCoatingColor.type);
    formData.append("Color", bladeCoatingColor.color);
    formData.append("ColorCode", bladeCoatingColor.colorCode);
    formData.append("EngravingColorCode", bladeCoatingColor.engravingColorCode);
    formData.append("Price", bladeCoatingColor.price.toString());
    formData.append("IsActive", bladeCoatingColor.isActive.toString());
    formData.append("ColorMapUrl", "1");
    formData.append("NormalMapUrl", "1");
    formData.append("RoughnessMapUrl", "1");
    if(colorMap)
      formData.append("colorMap", colorMap);
    if (normalMap)
      formData.append("normalMap", normalMap);
    if(roughnessMap)
      formData.append("roughnesMap", roughnessMap);

    const response = await this.apiService.create<BladeCoatingColor>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: number,
    bladeCoatingColor: BladeCoatingColor,
    colorMap: File | null,
    normalMap: File | null,
    roughnessMap: File | null
  ): Promise<BladeCoatingColor> {
    const formData = new FormData();

    formData.append("Color", bladeCoatingColor.color);
    formData.append("ColorCode", bladeCoatingColor.colorCode);
    formData.append("EngravingColorCode", bladeCoatingColor.engravingColorCode);
    formData.append("Type", bladeCoatingColor.type);
    formData.append("Color", bladeCoatingColor.color);
    formData.append("ColorCode", bladeCoatingColor.colorCode);
    formData.append("EngravingColorCode", bladeCoatingColor.engravingColorCode);
    formData.append("Price", bladeCoatingColor.price.toString());
    formData.append("IsActive", bladeCoatingColor.isActive.toString());
    formData.append("ColorMapUrl", "1");
    formData.append("NormalMapUrl", "1");
    formData.append("RoughnessMapUrl", "1");
    if(colorMap)
      formData.append("colorMap", colorMap);
    if (normalMap)
      formData.append("normalMap", normalMap);
    if(roughnessMap)
      formData.append("roughnesMap", roughnessMap);

    const response = await this.apiService.update<BladeCoatingColor>(
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

  async activate(id: string): Promise<BladeCoatingColor> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<BladeCoatingColor>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }

  async deactivate(id: string): Promise<BladeCoatingColor> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<BladeCoatingColor>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default BladeCoatingColorService;
