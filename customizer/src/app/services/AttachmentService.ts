// /services/AttachmentService.ts

import APIService from "./ApiService";
import { AttachmentDTO } from "@/app/DTOs/AttachmentDTO";
import ProductTagService from "./ProductTagService";
import { Attachment } from "../Interfaces/Attachment";

class AttachmentService {
  private apiService: APIService;
  private productTagService: ProductTagService; // Додаємо екземпляр
  private resource: string = "attachments";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.productTagService = new ProductTagService(apiService); // Ініціалізуємо
  }

  // --- 2. Приватний метод для зворотного мапінгу (API -> UI) ---
  private async mapApiToModel(dto: any): Promise<Attachment> {
    // API повертає `tagsIds`, а нам потрібні повні об'єкти `ProductTag`.
    // Ми отримуємо всі доступні теги і фільтруємо їх за ID.
    const allTags = await this.productTagService.getAll();
    const selectedTags = allTags.filter((tag) => dto.tagsIds?.includes(tag.id));

    // Повертаємо об'єкт, що відповідає інтерфейсу Attachment
    return {
      ...dto,
      tags: selectedTags,
    };
  }

  // --- 3. Оновлюємо методи GET, щоб вони використовували мапінг ---
  async getAll(): Promise<Attachment[]> {
    const dtoList = await this.apiService.getAll<any>(this.resource);
    // Використовуємо Promise.all, щоб виконати всі асинхронні мапінги паралельно
    return Promise.all(dtoList.map((dto) => this.mapApiToModel(dto)));
  }

  async getAllActive(): Promise<Attachment[]> {
    const dtoList = await this.apiService.getAll<any>(
      `${this.resource}/active`
    );
    return Promise.all(dtoList.map((dto) => this.mapApiToModel(dto)));
  }

  async getById(id: string): Promise<Attachment> {
    const dto = await this.apiService.getById<any>(this.resource, id);
    return this.mapApiToModel(dto);
  }

  // --- 4. Метод mapModelToDto залишається таким, як ми його зробили раніше ---
  private mapModelToDto(data: Partial<Attachment>): AttachmentDTO {
    if (!data.image?.id) throw new Error("Зображення є обов'язковим.");
    if (!data.model?.id) throw new Error("3D модель є обов'язковою.");
    if (!data.type?.id) throw new Error("Тип додатку є обов'язковим.");
    if (!data.names?.["ua"])
      throw new Error("Назва для української локалі ('ua') є обов'язковою.");

    return {
      isActive: data.isActive ?? true,
      imageFileId: data.image.id,
      modelFileId: data.model.id,
      typeId: data.type.id,
      price: data.price ?? 0,
      names: data.names,
      titles: data.titles,
      descriptions: data.descriptions,
      metaTitles: data.metaTitles,
      metaDescriptions: data.metaDescriptions,
      colors: data.colors,
      materials: data.materials,
      tagsIds: data.tags?.map((tags) => tags.id) || [],
    };
  }

  async create(attachmentData: Omit<Attachment, "id">): Promise<Attachment> {
    const dtoToSend = this.mapModelToDto(attachmentData);
    const createdDto = await this.apiService.create<any>(
      this.resource,
      dtoToSend
    );
    // Мапимо відповідь назад до моделі UI
    return this.mapApiToModel(createdDto);
  }

  async update(id: string, attachmentData: Attachment): Promise<Attachment> {
    const dtoToSend = this.mapModelToDto(attachmentData);
    const updatedDto = await this.apiService.update<any>(
      this.resource,
      id,
      dtoToSend
    );
    // Мапимо відповідь назад до моделі UI
    return this.mapApiToModel(updatedDto);
  }

  // --- Методи delete, activate, deactivate не потребують змін, але activate/deactivate мають повертати Promise<Attachment> ---
  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<Attachment> {
    const dto = await this.apiService.partialUpdate<any>(
      `${this.resource}/activate`,
      id,
      {}
    );
    return this.mapApiToModel(dto);
  }

  async deactivate(id: string): Promise<Attachment> {
    const dto = await this.apiService.partialUpdate<any>(
      `${this.resource}/deactivate`,
      id,
      {}
    );
    return this.mapApiToModel(dto);
  }
}

export default AttachmentService;
