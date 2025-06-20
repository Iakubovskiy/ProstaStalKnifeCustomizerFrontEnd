import APIService from "./ApiService";
import type { Texture } from "@/app/Interfaces/Texture";
import type { TextureDTO } from "@/app/DTOs/TextureDTO";

class TextureService {
  private apiService: APIService;
  private resource: string = "textures";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  // --- Методи GET залишаються без змін, оскільки вони повертають Texture, що влаштовує UI ---
  async getAll(): Promise<Texture[]> {
    return this.apiService.getAll<Texture>(this.resource);
  }

  async getById(id: string): Promise<Texture> {
    return this.apiService.getById<Texture>(this.resource, id);
  }

  // --- А методи POST та PUT потребують перетворення ---

  /**
   * Створює нову текстуру.
   * @param data - Дані у форматі моделі Texture (зручному для UI).
   * @returns Створений об'єкт Texture.
   */
  async create(data: Omit<Texture, "id">): Promise<Texture> {
    // Перевірка, чи файли були завантажені
    if (!data.normalMap?.id || !data.roughnessMap?.id) {
      throw new Error(
        "Необхідно завантажити обидва файли: Normal Map та Roughness Map."
      );
    }

    // Створюємо DTO для відправки на сервер
    const dtoToSend: TextureDTO = {
      name: data.name,
      normalMapId: data.normalMap.id,
      roughnessMapId: data.roughnessMap.id,
    };

    // Відправляємо DTO, а не модель
    return this.apiService.create<Texture>(this.resource, dtoToSend);
  }

  /**
   * Оновлює існуючу текстуру.
   * @param id - ID об'єкта для оновлення.
   * @param data - Нові дані у форматі моделі Texture.
   * @returns Оновлений об'єкт Texture.
   */
  async update(id: string, data: Texture): Promise<Texture> {
    if (!data.normalMap?.id || !data.roughnessMap?.id) {
      throw new Error(
        "Необхідно завантажити обидва файли: Normal Map та Roughness Map."
      );
    }

    // Створюємо DTO для відправки на сервер
    const dtoToSend: TextureDTO = {
      name: data.name,
      normalMapId: data.normalMap.id,
      roughnessMapId: data.roughnessMap.id,
    };

    // Відправляємо DTO, а не модель
    return this.apiService.update<Texture>(this.resource, id, dtoToSend);
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  // Методи activate/deactivate відсутні в Swagger для текстур, тому я їх прибрав для чистоти.
  // Якщо вони потрібні, їх можна додати за аналогією.
}

export default TextureService;
