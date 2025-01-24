import APIService from "./ApiService";
import BladeShape from "../Models/BladeShape";

class BladeShapeService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "BladeShape";
  }

  async getAll(): Promise<BladeShape[]> {
    const response = await this.apiService.getAll<BladeShape>(this.resource);
    return response;
  }

  async getAllActive(): Promise<BladeShape[]> {
    const response = await this.apiService.getAll<BladeShape>(
        `${this.resource}/active`
    );
    return response;
  }

  async getById(id: string): Promise<BladeShape> {
    const response = await this.apiService.getById<BladeShape>(
      this.resource,
      id
    );
    return response;
  }

  async create(
    bladeShape: BladeShape,
    modelFiles: { [key: string]: File }
  ): Promise<BladeShape> {
    const formData = new FormData();
    formData.append("Name", bladeShape.name);
    formData.append("Price", bladeShape.price.toString());
    formData.append("totalLength", bladeShape.totalLength.toString());
    formData.append("bladeLength", bladeShape.bladeLength.toString());
    formData.append("bladeWidth", bladeShape.bladeWidth.toString());
    formData.append("bladeWeight", bladeShape.bladeWeight.toString());
    formData.append("sharpeningAngle", bladeShape.sharpeningAngle.toString());
    formData.append(
        "rockwellHardnessUnits",
        bladeShape.rockwellHardnessUnits.toString()
    );
    formData.append("bladeShapeModelUrl", "1");
    formData.append("sheathModelUrl", "1");
    formData.append("IsActive", bladeShape.isActive.toString());

    Object.keys(modelFiles).forEach((key) => {
      formData.append(key, modelFiles[key]);
    });
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const response = await this.apiService.create<BladeShape>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: string,
    bladeShape: BladeShape,
    modelFiles?: { [key: string]: File }
  ): Promise<BladeShape> {
    const formData = new FormData();
    formData.append("Name", bladeShape.name);
    formData.append("Price", bladeShape.price.toString());
    formData.append("totalLength", bladeShape.totalLength.toString());
    formData.append("bladeLength", bladeShape.bladeLength.toString());
    formData.append("bladeWidth", bladeShape.bladeWidth.toString());
    formData.append("bladeWeight", bladeShape.bladeWeight.toString());
    formData.append("sharpeningAngle", bladeShape.sharpeningAngle.toString());
    formData.append(
        "rockwellHardnessUnits",
        bladeShape.rockwellHardnessUnits.toString()
    );
    formData.append("bladeShapeModelUrl", bladeShape.bladeShapeModelUrl);
    formData.append("sheathModelUrl", bladeShape.sheathModelUrl);
    formData.append("IsActive", bladeShape.isActive.toString());
    formData.append("bladeShapeModelUrl", bladeShape.bladeShapeModelUrl);
    formData.append("sheathModelUrl", bladeShape.sheathModelUrl);

    if (modelFiles) {
      Object.keys(modelFiles).forEach((key) => {
        formData.append(key, modelFiles[key]);
      });
    }

    const response = await this.apiService.update<BladeShape>(
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

  async activate(id: string): Promise<BladeShape> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<BladeShape>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }

  async deactivate(id: string): Promise<BladeShape> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<BladeShape>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default BladeShapeService;
