import APIService from "./ApiService";

class AttachmentTypeService {
  private apiService: APIService;
  private resource: string = "attachment-types";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async getAll(): Promise<AttachmentType[]> {
    const dtoList = await this.apiService.getAll<AttachmentType>(this.resource);
    return dtoList;
  }

  async getById(id: string): Promise<AttachmentType> {
    const dto = await this.apiService.getById<AttachmentType>(
      this.resource,
      id
    );
    return dto;
  }

  async create(
    attachmentTypeData: Omit<AttachmentType, "id">
  ): Promise<AttachmentType> {
    const createdDto = await this.apiService.create<AttachmentType>(
      this.resource,
      attachmentTypeData
    );
    return createdDto;
  }

  async delete(id: string): Promise<void> {
    await this.apiService.delete<void>(this.resource, id);
  }
}

export default AttachmentTypeService;
