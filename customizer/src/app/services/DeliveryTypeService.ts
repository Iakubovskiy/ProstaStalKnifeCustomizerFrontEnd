import { DeliveryTypeDTO } from "../DTOs/DeliveryTypeDTO";
import APIService from "./ApiService";

class DeliveryTypeService {
  private apiService: APIService;
  private resource: string = "delivery-types";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<DeliveryType[]> {
    const res = await this.apiService.getAll<DeliveryType>(this.resource);
    console.log("Delivery types:", res);
    return res;
  }

  async getAllActive(): Promise<DeliveryType[]> {
    const res = await this.apiService.getAll<DeliveryType>(
      `${this.resource}/active`
    );
    console.log("Active delivery types:", res);
    return res;
  }

  async getById(id: string): Promise<DeliveryType> {
    const res = await this.apiService.getById<DeliveryType>(this.resource, id);
    console.log("Delivery type by id:", res);
    return res;
  }

  async create(
    deliveryTypeData: Omit<DeliveryType, "id">
  ): Promise<DeliveryType> {
    const createdDto = await this.apiService.create<DeliveryType>(
      this.resource,
      deliveryTypeData
    );
    return createdDto;
  }

  async update(
    id: string,
    deliveryTypeData: DeliveryType
  ): Promise<DeliveryType> {
    console.log("Updated delivery type:", deliveryTypeData);
    const updatedDto = await this.apiService.update<DeliveryType>(
      this.resource,
      id,
      deliveryTypeData
    );

    return updatedDto;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<DeliveryType> {
    console.log("Activating delivery type with ID:", id);

    try {
      const updatedDto = await this.apiService.partialUpdate<DeliveryType>(
        `${this.resource}/activate`,
        id,
        {}
      );

      console.log("Activation response:", updatedDto);

      // Якщо API не повертає оновлений об'єкт, отримуємо його окремо
      if (!updatedDto) {
        console.log("No response from activate, fetching updated item...");
        const refreshedItem = await this.getById(id);
        console.log("Refreshed item after activation:", refreshedItem);
        return refreshedItem;
      }

      return updatedDto;
    } catch (error) {
      console.error("Error during activation:", error);
      // У випадку помилки, спробуємо отримати актуальний стан
      const refreshedItem = await this.getById(id);
      return refreshedItem;
    }
  }

  async deactivate(id: string): Promise<DeliveryType> {
    try {
      // Спробуємо використати PATCH запит з порожнім тілом
      const updatedDto = await this.apiService.partialUpdate<DeliveryType>(
        `${this.resource}/deactivate`,
        id,
        {} // Порожній об'єкт замість FormData
      );

      if (!updatedDto) {
        const refreshedItem = await this.getById(id);
        return refreshedItem;
      }

      return updatedDto;
    } catch (error) {
      console.error("Error during deactivation:", error);
      const refreshedItem = await this.getById(id);
      return refreshedItem;
    }
  }
}

export default DeliveryTypeService;
