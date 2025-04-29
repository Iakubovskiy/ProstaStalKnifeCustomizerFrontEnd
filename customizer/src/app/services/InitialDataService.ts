import APIService from "./ApiService";
import InitialData from "@/app/DTO/InitialData";

class InitialDataService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Initial";
  }

  async getData(): Promise<InitialData> {
    const response = await this.apiService.get<InitialData>(this.resource);
    return response;
  }
}

export default InitialDataService;
