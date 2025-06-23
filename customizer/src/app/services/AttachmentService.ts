// /services/AttachmentService.ts

import APIService from "./ApiService";
import { AttachmentDTO } from "@/app/DTOs/AttachmentDTO";
import ProductTagService from "./ProductTagService";
import { Attachment } from "../Interfaces/Attachment";
import { AttachmentForCanvas } from "../Interfaces/Knife/AttachmentForCanvas";

class AttachmentService {
  private apiService: APIService;
  private productTagService: ProductTagService;
  private resource: string = "attachments";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.productTagService = new ProductTagService(apiService);
  }

  // --- ОПТИМІЗОВАНИЙ МЕТОД ---
  // Метод, що виконує мапінг, тепер приймає список тегів, щоб уникнути повторних запитів
  private mapApiToModel(dto: any, allTags: ProductTag[]): Attachment {
    const selectedTags = allTags.filter((tag) => dto.tagsIds?.includes(tag.id));
    return {
      ...dto,
      tags: selectedTags,
    };
  }

  // --- ОПТИМІЗОВАНИЙ МЕТОД ---
  // Тепер робить лише 2 запити до API замість N+1
  async getAll(): Promise<Attachment[]> {
    const [dtoList, allTags] = await Promise.all([
      this.apiService.getAll<any[]>(this.resource),
      this.productTagService.getAll(),
    ]);
    return dtoList.map((dto) => this.mapApiToModel(dto, allTags));
  }

  // --- ОПТИМІЗОВАНИЙ МЕТОД ---
  async getAllActive(): Promise<Attachment[]> {
    const [dtoList, allTags] = await Promise.all([
      this.apiService.getAll<any[]>(`${this.resource}/active`),
      this.productTagService.getAll(),
    ]);
    return dtoList.map((dto) => this.mapApiToModel(dto, allTags));
  }
  // --- НОВИЙ МЕТОД ---
  /**
   * Отримує всі активні додатки, але повертає лише дані для Canvas.
   * Цей метод не потребує даних про теги, тому він дуже швидкий.
   * @returns Масив об'єктів AttachmentForCanvas.
   */
  async getAllActiveForCanvas(): Promise<AttachmentForCanvas[]> {
    // 1. Отримуємо повні об'єкти (або DTO) з API
    const fullObjects = await this.apiService.getAll<Attachment>(
      `${this.resource}/active`
    );

    return fullObjects
      .filter((item) => item.model && item.image)
      .map((item) => ({
        id: item.id,
        model: item.model!,
        image: item.image!,
        name: item.name,
        price: item.price,
        color: item.color,
        material: item.material,
      }));
  }

  // Метод getById також оптимізовано
  async getById(id: string): Promise<Attachment> {
    const [dto, allTags] = await Promise.all([
      this.apiService.getById<any>(this.resource, id),
      this.productTagService.getAll(),
    ]);
    return this.mapApiToModel(dto, allTags);
  }

  private mapModelToDto(data: Partial<Attachment>): AttachmentDTO {
    // ... логіка без змін ...
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
      tagsIds: data.tags?.map((tag: ProductTag) => tag.id) || [],
    };
  }

  async create(attachmentData: Omit<Attachment, "id">): Promise<Attachment> {
    const dtoToSend = this.mapModelToDto(attachmentData);
    const createdDto = await this.apiService.create<any>(
      this.resource,
      dtoToSend
    );
    return this.getById(createdDto.id); // Отримуємо повний об'єкт з розгорнутими тегами
  }

  async update(id: string, attachmentData: Attachment): Promise<Attachment> {
    const dtoToSend = this.mapModelToDto(attachmentData);
    const updatedDto = await this.apiService.update<any>(
      this.resource,
      id,
      dtoToSend
    );
    return this.getById(updatedDto.id); // Отримуємо повний об'єкт з розгорнутими тегами
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }

  // Методи activate/deactivate тепер повертають повний об'єкт
  async activate(id: string): Promise<Attachment> {
    await this.apiService.partialUpdate<any>(
      `${this.resource}/activate`,
      id,
      {}
    );
    return this.getById(id);
  }

  async deactivate(id: string): Promise<Attachment> {
    await this.apiService.partialUpdate<any>(
      `${this.resource}/deactivate`,
      id,
      {}
    );
    return this.getById(id);
  }
}

export default AttachmentService;
