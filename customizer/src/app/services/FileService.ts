import APIService from "./ApiService";
import type {AppFile} from "@/app/Interfaces/File";
import {API_BASE_URL} from "../config";

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

  async getById(id: string): Promise<AppFile> {
    const res = await this.apiService.getById<AppFile>(this.resource, id);
    return res;
  }

  async getJpegFileFromUrl(url: string) : Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], "file.jpg", { type: "image/jpeg" });
  }

  async convertSvgToDxf(svgFile: File): Promise<AppFile> {
    const formData = new FormData();
    formData.append("file", svgFile, svgFile.name);
    const url = `${API_BASE_URL}/files/convert/svg-to-dxf`;

    const response = await fetch(url,{
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const fileLocalUrl = URL.createObjectURL(blob);
    return {
      id: crypto.randomUUID(),
      fileUrl: fileLocalUrl,
    };
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }

}

export default FileService;
