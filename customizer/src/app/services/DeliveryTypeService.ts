import APIService from "./ApiService";
import DeliveryType from "../Models/DeliveryType";

class DeliveryTypeService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "DeliveryType";
  }

  // Отримати всі DeliveryTypes
  async getAll(): Promise<DeliveryType[]> {
    const response = await this.apiService.getAll<DeliveryType>(this.resource);
    return response;
  }

  // Отримати DeliveryType за id
  async getById(id: number): Promise<DeliveryType> {
    const response = await this.apiService.getById<DeliveryType>(
      this.resource,
      id
    );
    return response;
  }

  // Створити новий DeliveryType
  async create(deliveryType: DeliveryType): Promise<DeliveryType> {
    const formData = new FormData();

    // Додаємо дані як звичайні поля
    formData.append("Id", deliveryType.name);
    formData.append("Name", deliveryType.name);
    formData.append("Price", deliveryType.price.toString());
    formData.append("Comment", deliveryType.comment ?? "");

    const response = await this.apiService.create<DeliveryType>(
      this.resource,
      formData
    );
    return response;
  }

  // Оновити DeliveryType
  async update(id: number, deliveryType: DeliveryType): Promise<DeliveryType> {
    const formData = new FormData();

    // Додаємо дані як звичайні поля
    formData.append("Id", deliveryType.name);
    formData.append("Name", deliveryType.name);
    formData.append("Price", deliveryType.price.toString());
    formData.append("Comment", deliveryType.comment ?? "");
    const response = await this.apiService.update<DeliveryType>(
      this.resource,
      id,
      formData
    );
    return response;
  }

  // Видалити DeliveryType
  async delete(id: number): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }
}

export default DeliveryTypeService;
