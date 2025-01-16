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

  async getById(id: string): Promise<OrderStatuses> {
    const response = await this.apiService.getById<OrderStatuses>(
      this.resource,
      id
    );
    return response;
  }

  async create(orderStatus: OrderStatuses): Promise<OrderStatuses> {
    const formData = new FormData();
    formData.append("Status", orderStatus.status);

    const response = await this.apiService.create<OrderStatuses>(
      this.resource,
      formData
    );
    return response;
  }

  async update(id: string, orderStatus: OrderStatuses): Promise<OrderStatuses> {
    const formData = new FormData();
    formData.append("status", orderStatus.status);
    const response = await this.apiService.update<OrderStatuses>(
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

export default OrderStatusesService;
