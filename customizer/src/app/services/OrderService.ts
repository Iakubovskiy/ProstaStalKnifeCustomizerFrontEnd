import APIService from "./ApiService";
import type { Order } from "@/app/Interfaces/Order";
import type { OrderDTO } from "@/app/DTOs/OrderDTO";
import type { ClientData } from "@/app/DTOs/ClientData";

class OrderService {
  private apiService: APIService;
  private resource: string = "orders";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<Order[]> {
    const res = await this.apiService.getAll<Order>(this.resource);
    return res;
  }

  async getById(id: string): Promise<Order> {
    const res = await this.apiService.getById<Order>(this.resource, id);
    return res;
  }

  async create(data: OrderDTO): Promise<Order> {
    if (!data.status) {
      data.status = "New";
    }
    const createdOrder = await this.apiService.create<Order>(
      this.resource,
      data
    );
    return createdOrder;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updatedOrder = await this.apiService.partialUpdate<Order>(
      `${this.resource}/update/status`,
      id,
      status
    );
    return updatedOrder;
  }

  async updateDeliveryData(id: string, data: ClientData): Promise<Order> {
    const updatedOrder = await this.apiService.partialUpdate<Order>(
      `${this.resource}/update/delivery-data`,
      id,
      data
    );
    return updatedOrder;
  }

  async updateItemQuantity(
    orderId: string,
    productId: string,
    quantity: number
  ): Promise<Order> {
    const updatedOrder = await this.apiService.NotStandardPartialUpdate<Order>(
      `${this.resource}/${orderId}/items/${productId}/quantity`,
      quantity
    );
    return updatedOrder;
  }

  async deleteItem(orderId: string, productId: string): Promise<Order> {
    const updatedOrder = await this.apiService.NotStandardDelete<Order>(
      `${this.resource}/${orderId}/items/${productId}`,
      "DELETE"
    );
    return updatedOrder;
  }
}

export default OrderService;
