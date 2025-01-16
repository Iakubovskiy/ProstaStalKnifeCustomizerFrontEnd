import APIService from "./ApiService";
import HandleColor from "../Models/HandleColor";

class HandleColorService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "HandleColor";
  }

  async getAll(): Promise<HandleColor[]> {
    const response = await this.apiService.getAll<HandleColor>(this.resource);
    return response;
  }

  async getById(id: string): Promise<HandleColor> {
    const response = await this.apiService.getById<HandleColor>(
      this.resource,
      id
    );
    return response;
  }

  async create(
      color: HandleColor,
      colorMap: File | null,
      normalMap: File | null,
      roughnessMap: File | null
  ): Promise<HandleColor> {
    const formData = new FormData();
    formData.append("ColorName", color.colorName);
    formData.append("ColorCode", color.colorCode);
    formData.append("Material", color.material);
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

    const response = await this.apiService.create<HandleColor>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: string,
    color: HandleColor,
    colorMap: File | null,
    normalMap: File | null,
    roughnessMap: File | null
  ): Promise<HandleColor> {
    const formData = new FormData();
    formData.append("ColorName", color.colorName);
    formData.append("ColorCode", color.colorCode);
    formData.append("Material", color.material);
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

    const response = await this.apiService.update<HandleColor>(
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

  async activate(id: string): Promise<HandleColor> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<HandleColor>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }

  async deactivate(id: string): Promise<HandleColor> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<HandleColor>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default HandleColorService;
