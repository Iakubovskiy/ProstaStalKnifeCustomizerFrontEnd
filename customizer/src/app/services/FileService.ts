// /services/FileService.ts

import APIService from "./ApiService";
class FileService {
  private apiService: APIService;
  private resource: string = "files";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async upload(file: File): Promise<AppFile> {
    const formData = new FormData();

    formData.append("file", file);

    return this.apiService.create<AppFile>(this.resource, formData);
  }
}

export default FileService;
