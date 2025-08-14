import APIService from "./ApiService";
import type { AppFile } from "@/app/Interfaces/File";

class FileService {
  private apiService: APIService;
  private resource: string = "files";

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
  }

  async upload(file: File): Promise<AppFile> {
    const formData = new FormData();
    console.log("Uploading file:", file);
    formData.append("file", file);

    return this.apiService.create<AppFile>(this.resource, formData);
  }

  async getById(id: string): Promise<AppFile> {
    const res = await this.apiService.getById<AppFile>(this.resource, id);
    return res;
  }

  async getJpegFileFromUrl(url: string) : Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], "file.jpg", { type: "image/jpeg" });
  }
}

export default FileService;
