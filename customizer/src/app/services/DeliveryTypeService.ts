import APIService from "./ApiService";
import DeliveryType from "../Models/DeliveryType";

class DeliveryTypeService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "DeliveryType";
  }

  async getAll(): Promise<DeliveryType[]> {
    const response = await this.apiService.getAll<DeliveryType>(this.resource);
    return response;
  }

  async getById(id: string): Promise<DeliveryType> {
    const response = await this.apiService.getById<DeliveryType>(
      this.resource,
      id
    );
    return response;
  }

  async create(deliveryType: DeliveryType): Promise<DeliveryType> {
    const formData = new FormData();

    formData.append("Id", deliveryType.name);
    formData.append("Name", deliveryType.name);
    formData.append("Price", deliveryType.price.toString());
    formData.append("Comment", deliveryType.comment ?? "");
    formData.append("IsActive", deliveryType.isActive.toString());

    const response = await this.apiService.create<DeliveryType>(
      this.resource,
      formData
    );
    return response;
  }

  async update(id: string, deliveryType: DeliveryType): Promise<DeliveryType> {
    const formData = new FormData();

    formData.append("Id", deliveryType.name);
    formData.append("Name", deliveryType.name);
    formData.append("Price", deliveryType.price.toString());
    formData.append("Comment", deliveryType.comment ?? "");
    formData.append("IsActive", deliveryType.isActive.toString());
    const response = await this.apiService.update<DeliveryType>(
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

  async activate(id: string): Promise<DeliveryType> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<DeliveryType>(
        `${this.resource}/activate`,
        id,
        formData
    );
    return response;
  }

  async deactivate(id: string): Promise<DeliveryType> {
    const formData = new FormData();
    const response = await this.apiService.partialUpdate<DeliveryType>(
        `${this.resource}/deactivate`,
        id,
        formData
    );
    return response;
  }
}

export default DeliveryTypeService;
