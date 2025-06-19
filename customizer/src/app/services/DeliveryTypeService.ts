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
    console.log("Active delivery types:", res);
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
    // API повертає 200 OK без тіла, тому тип повернення - void
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<DeliveryType> {
    console.log("Activating delivery type with ID:", id);
    const formData = new FormData();

    const updatedDto = await this.apiService.partialUpdate<DeliveryType>(
      `activate/${this.resource}`,
      id,
      formData
    );
    if (!updatedDto) {
      return await this.getById(id);
    }

    return updatedDto;
  }

  async deactivate(id: string): Promise<DeliveryType> {
    console.log("Deactivating delivery type with ID:", id);
    const formData = new FormData();

    const updatedDto = await this.apiService.partialUpdate<DeliveryType>(
      `deactivate/${this.resource}`,
      id,
      formData
    );
    if (!updatedDto) {
      return await this.getById(id);
    }

    return updatedDto;
  }
}

export default DeliveryTypeService;
