import APIService from "./ApiService";
import OrderStatuses from "../Models/OrderStatuses";

class OrderStatusesService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "OrderStatus";
  }

  async getAll(): Promise<OrderStatuses[]> {
    const response = await this.apiService.getAll<OrderStatuses>(this.resource);
    // @ts-ignore
    return response.orderStatuss;
  }

  async getById(id: number): Promise<OrderStatuses> {
    const response = await this.apiService.getById<OrderStatuses>(
      this.resource,
      id
    );
    return response;
  }

  async create(orderStatus: OrderStatuses): Promise<OrderStatuses> {
    const formData = new FormData();

    // Додаємо дані як звичайні поля

    formData.append("Id", "0");
    console.log("Status:", orderStatus.status);
    formData.append("Status", orderStatus.status);

    const response = await this.apiService.create<OrderStatuses>(
      this.resource,
      formData
    );
    return response;
  }

  async update(id: number, orderStatus: OrderStatuses): Promise<OrderStatuses> {
    const formData = new FormData();

    formData.append("status", orderStatus.status);

    const response = await this.apiService.update<OrderStatuses>(
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

export default OrderStatusesService;
