// /services/ProductTagService.ts

import APIService from "./ApiService";

class ProductTagService {
  private apiService: APIService;
  private resource: string = "product-tags";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<ProductTag[]> {
    return this.apiService.getAll<ProductTag>(this.resource);
  }

  async getById(id: string): Promise<ProductTag> {
    return this.apiService.getById<ProductTag>(this.resource, id);
  }

  async create(data: Omit<ProductTag, "id">): Promise<ProductTag> {
    // Компонент сам має підготувати об'єкт з полем `names: LocalizedContent`.
    return this.apiService.create<ProductTag>(this.resource, data);
  }

  async update(id: string, data: ProductTag): Promise<ProductTag> {
    return this.apiService.update<ProductTag>(this.resource, id, data);
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }
}

export default ProductTagService;
