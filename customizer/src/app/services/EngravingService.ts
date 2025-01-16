import APIService from "./ApiService";
import Engraving from "../Models/Engraving";

class EngravingService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Engraving";
  }

  async getAll(): Promise<Engraving[]> {
    const response = await this.apiService.getAll<Engraving>(this.resource);
    return response;
  }

  async getById(id: string): Promise<Engraving> {
    const response = await this.apiService.getById<Engraving>(
      this.resource,
      id
    );
    return response;
  }

  async create(engraving: Engraving, engPic: File | null): Promise<Engraving> {
    const formData = new FormData();

    formData.append("Name", engraving.name ?? "");
    formData.append("Side", engraving.side.toString());
    formData.append("Text", engraving.text ?? "");
    formData.append("Font", engraving.font?.toString() ?? "");
    formData.append("pictureUrl", engraving.pictureUrl ?? "");
    formData.append("rotationX", engraving.rotationX.toString());
    formData.append("rotationY", engraving.rotationY.toString());
    formData.append("rotationZ", engraving.rotationZ.toString());
    formData.append("locationX", engraving.locationX.toString());
    formData.append("locationY", engraving.locationY.toString());
    formData.append("locationZ", engraving.locationZ.toString());
    formData.append("scaleX", engraving.scaleX.toString());
    formData.append("scaleY", engraving.scaleY.toString());
    formData.append("scaleZ", engraving.scaleZ.toString());
    if (engPic) {
      formData.append("engravingPicrutre", engPic);
    }
    const response = await this.apiService.create<Engraving>(
      this.resource,
      formData
    );
    return response;
  }

  // Оновити Engraving
  async update(
    id: string,
    engraving: Engraving,
    engPic: File | null
  ): Promise<Engraving> {
    const formData = new FormData();
    formData.append("Name", engraving.name ?? "");
    formData.append("Side", engraving.side.toString());
    formData.append("Text", engraving.text ?? "");
    formData.append("Font", engraving.font?.toString() ?? "");
    formData.append("pictureUrl", engraving.pictureUrl ?? "");
    formData.append("rotationX", engraving.rotationX.toString());
    formData.append("rotationY", engraving.rotationY.toString());
    formData.append("rotationZ", engraving.rotationZ.toString());
    formData.append("locationX", engraving.locationX.toString());
    formData.append("locationY", engraving.locationY.toString());
    formData.append("locationZ", engraving.locationZ.toString());
    formData.append("scaleX", engraving.scaleX.toString());
    formData.append("scaleY", engraving.scaleY.toString());
    formData.append("scaleZ", engraving.scaleZ.toString());
    if (engPic) {
      formData.append("engravingPicrutre", engPic);
    }

    const response = await this.apiService.update<Engraving>(
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
}

export default EngravingService;
