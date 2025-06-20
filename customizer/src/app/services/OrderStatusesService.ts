import APIService from "./ApiService";

class OrderStatusesService {
  private apiService: APIService;
  private resource: string = "order-statuses";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<string[]> {
    const res = await this.apiService.getAll<string>(this.resource);
    return res;
  }
}

export default OrderStatusesService;