import { AttachmentTypeDTO } from "../DTOs/AttachmentTypeDTO";
import APIService from "./ApiService";

class AttachmentTypeService {
  private apiService: APIService;
  private resource: string = "attachment-types";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<AttachmentType[]> {
    const dtoList = await this.apiService.getAll<AttachmentType>(this.resource);
    console.log("AttachmentTypeService getAll", dtoList);
    return dtoList;
  }

  async getById(id: string): Promise<AttachmentType> {
    const dto = await this.apiService.getById<AttachmentType>(
      this.resource,
      id
    );
    return dto;
  }
  private mapModelToDto(model: Partial<AttachmentType>): AttachmentTypeDTO {
    const locale = this.apiService.getCurrentLocale();

    if (model.names && Object.keys(model.names).length > 0) {
      return { name: model.names };
    }
    return {
      name: { [locale]: model.name || "" },
    };
  }
  async create(
    attachmentTypeData: Omit<AttachmentType, "id">
  ): Promise<AttachmentType> {
    const dtoToSend = this.mapModelToDto(attachmentTypeData);

    const createdResponse = await this.apiService.create<AttachmentType>(
      this.resource,
      dtoToSend
    );

    return createdResponse;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }
}

export default AttachmentTypeService;
