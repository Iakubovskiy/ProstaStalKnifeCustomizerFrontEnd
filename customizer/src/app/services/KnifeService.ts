import APIService from "./ApiService";
import Knife from "../Models/Knife";

class KnifeService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Knife";
  }

  // Отримати всі ножі
  async getAll(): Promise<Knife[]> {
    const response = await this.apiService.getAll<any>(this.resource);
    return response; // Перевіряємо наявність поля data в відповіді
  }

  // Отримати ніж за id
  async getById(id: number): Promise<Knife> {
    const response = await this.apiService.getById<Knife>(this.resource, id);
    return response;
  }

  // Створити новий ніж
  async create(knife: Knife): Promise<Knife> {
    const formData = new FormData();

    // Додаємо основні поля для Knife (є посилання на Shape, BladeCoating, HandleColor, SheathColor)
    formData.append("Id", knife.id.toString());

    // Додаємо дані для Shape
    formData.append("ShapeId", knife.shape.id.toString());

    // Додаємо BladeCoating
    formData.append("BladeCoatingId", knife.bladeCoating.id.toString());

    // Додаємо HandleColor
    formData.append(
      "BladeCoatingColorId",
      knife.bladeCoatingColor.id.toString()
    );
    formData.append("HandleColorId", knife.handleColor.id.toString());

    // Додаємо SheathColor
    formData.append("SheathColorId", knife.sheathColor.id.toString());

    // Додаємо Fastening
    knife.fastening?.forEach((fastening, index) => {
      formData.append(`FasteningJson[${index}]`, fastening.id.toString());
    });

    // Додаємо Engravings
    knife.engraving?.forEach((engraving, index) => {
      formData.append(`EngravingsJson[${index}]`, engraving.id.toString());
    });

    // Додаємо кількість
    formData.append("Quantity", knife.quantity.toString());

    const response = await this.apiService.create<Knife>(
      this.resource,
      formData
    );
    return response;
  }

  // Оновити ніж
  async update(id: number, knife: Knife): Promise<Knife> {
    const formData = new FormData();

    // Додаємо основні поля для Knife (є посилання на Shape, BladeCoating, HandleColor, SheathColor)
    formData.append("Id", knife.id.toString());

    // Додаємо дані для Shape
    formData.append("ShapeId", knife.shape.id.toString());

    // Додаємо BladeCoating
    formData.append("BladeCoatingId", knife.bladeCoating.id.toString());

    // Додаємо HandleColor
    formData.append(
      "BladeCoatingColorId",
      knife.bladeCoatingColor.id.toString()
    );
    formData.append("HandleColorId", knife.handleColor.id.toString());

    // Додаємо SheathColor
    formData.append("SheathColorId", knife.sheathColor.id.toString());

    // Додаємо Fastening
    knife.fastening?.forEach((fastening, index) => {
      formData.append(`Fastening[${index}]`, fastening.id.toString());
    });

    // Додаємо Engravings
    knife.engraving?.forEach((engraving, index) => {
      formData.append(`Engravings[${index}]`, engraving.id.toString());
    });

    // Додаємо кількість
    formData.append("Quantity", knife.quantity.toString());

    const response = await this.apiService.update<Knife>(
      this.resource,
      id,
      formData
    );
    return response;
  }

  // Видалити ніж
  async delete(id: number): Promise<boolean> {
    const response = await this.apiService.delete<{ isDeleted: boolean }>(
      this.resource,
      id
    );
    return response.isDeleted;
  }
}

export default KnifeService;
