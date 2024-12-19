import APIService from "./ApiService";
import EngravingPrice from "../Models/EngravingPrice";

class EngravingPriceService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "EngravingPrice";
  }

  async getAll(): Promise<EngravingPrice[]> {
    const response = await this.apiService.getAll<EngravingPrice>(
      this.resource
    );
    return response;
  }

  async getById(id: number): Promise<EngravingPrice> {
    const response = await this.apiService.getById<EngravingPrice>(
      this.resource,
      id
    );
    return response;
  }

  async create(engravingPrice: EngravingPrice): Promise<EngravingPrice> {
    const formData = new FormData();
    formData.append("Id", "0");
    formData.append("Price", engravingPrice.price.toString());

    const response = await this.apiService.create<EngravingPrice>(
      this.resource,
      formData
    );
    return response;
  }

  async update(
    id: number,
    engravingPrice: EngravingPrice
  ): Promise<EngravingPrice> {
    const formData = new FormData();
    formData.append("Id", "0");
    formData.append("Price", engravingPrice.price.toString());

    const response = await this.apiService.update<EngravingPrice>(
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

export default EngravingPriceService;
