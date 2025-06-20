// /services/AttachmentService.ts

import APIService from "./ApiService";
import { Attachment } from "@/app/Interfaces/Attachment";
import { AttachmentDTO } from "@/app/DTOs/AttachmentDTO";

class AttachmentService {
  private apiService: APIService;
  private resource: string = "attachments";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  // Методи GET повертають зручну для UI модель Attachment
  async getAll(): Promise<Attachment[]> {
    return this.apiService.getAll<Attachment>(this.resource);
  }

  async getAllActive(): Promise<Attachment[]> {
    return this.apiService.getAll<Attachment>(`${this.resource}/active`);
  }

  async getById(id: string): Promise<Attachment> {
    return this.apiService.getById<Attachment>(this.resource, id);
  }

  // Приватний метод для перетворення моделі в DTO
  private mapModelToDto(data: Partial<Attachment>): AttachmentDTO {
    // Валідація обов'язкових полів перед відправкою
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
      name: data.names,
      title: data.titles,
      description: data.descriptions,
      metaTitle: data.metaTitles,
      metaDescription: data.metaDescriptions,
      color: data.colors,
      material: data.materials,
      // tagsIds відсутнє в моделі Attachment, якщо потрібно - додайте
      tagsIds: [],
    };
  }

  /**
   * Створює новий додаток
   * @param attachmentData - Дані у форматі моделі Attachment
   */
  async create(attachmentData: Omit<Attachment, "id">): Promise<Attachment> {
    const dtoToSend = this.mapModelToDto(attachmentData);
    return this.apiService.create<Attachment>(this.resource, dtoToSend);
  }

  /**
   * Оновлює існуючий додаток
   * @param id - ID додатку
   * @param attachmentData - Нові дані у форматі моделі Attachment
   */
  async update(id: string, attachmentData: Attachment): Promise<Attachment> {
    const dtoToSend = this.mapModelToDto(attachmentData);
    return this.apiService.update<Attachment>(this.resource, id, dtoToSend);
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  async activate(id: string): Promise<Attachment> {
    return this.apiService.partialUpdate<Attachment>(
      `${this.resource}/activate`,
      id,
      {}
    );
  }

  async deactivate(id: string): Promise<Attachment> {
    return this.apiService.partialUpdate<Attachment>(
      `${this.resource}/deactivate`,
      id,
      {}
    );
  }
}

export default AttachmentService;
