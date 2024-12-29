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

  async getById(id: number): Promise<BladeShape> {
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
    formData.append("name", bladeShape.name);
    formData.append("price", bladeShape.price.toString());
    formData.append("totalLength", bladeShape.totalLength.toString());
    formData.append("bladeLength", bladeShape.bladeLength.toString());
    formData.append("bladeWidth", bladeShape.bladeWidth.toString());
    formData.append("bladeWeight", bladeShape.bladeWeight.toString());
    formData.append("sharpeningAngle", bladeShape.sharpeningAngle.toString());
    formData.append(
      "rockwellHardnessUnits",
      bladeShape.rockwellHardnessUnits.toString()
    );
    formData.append(
      "engravingLocationX",
      bladeShape.engravingLocationX.toString()
    );
    formData.append(
      "engravingLocationY",
      bladeShape.engravingLocationY.toString()
    );
    formData.append(
      "engravingLocationZ",
      bladeShape.engravingLocationZ.toString()
    );
    formData.append(
      "engravingRotationX",
      bladeShape.engravingRotationX.toString()
    );
    formData.append(
      "engravingRotationY",
      bladeShape.engravingRotationY.toString()
    );
    formData.append(
      "engravingRotationZ",
      bladeShape.engravingRotationZ.toString()
    );
    formData.append("bladeShapeModelUrl", "1");
    formData.append("sheathModelUrl", "1");

    // Додавання файлів моделей (якщо є)
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
    id: number,
    bladeShape: BladeShape,
    modelFiles?: { [key: string]: File }
  ): Promise<BladeShape> {
    const formData = new FormData();
    formData.append("Id", "0");
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
    formData.append(
      "engravingLocationX",
      bladeShape.engravingLocationX.toString()
    );
    formData.append(
      "engravingLocationY",
      bladeShape.engravingLocationY.toString()
    );
    formData.append(
      "engravingLocationZ",
      bladeShape.engravingLocationZ.toString()
    );
    formData.append(
      "engravingRotationX",
      bladeShape.engravingRotationX.toString()
    );
    formData.append(
      "engravingRotationY",
      bladeShape.engravingRotationY.toString()
    );
    formData.append(
      "engravingRotationZ",
      bladeShape.engravingRotationZ.toString()
    );
    formData.append("bladeShapeModelUrl", bladeShape.bladeShapeModelUrl);
    formData.append("sheathModelUrl", bladeShape.sheathModelUrl);

    // Додавання файлів моделей (якщо є)
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

  async delete(id: number): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }
}

export default BladeShapeService;
