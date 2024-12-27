import APIService from "./ApiService";

class RegistrationService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Registration";
  }

  async register(
    username: string,
    password: string,
    role: string,
    email: string,
    phoneNumber: string
  ): Promise<any> {
    const formData = new FormData();

    formData.append("Username", username);
    formData.append("Password", password);
    formData.append("Role", role);
    formData.append("Email", email);
    formData.append("PhoneNumber", phoneNumber);

    const response = await this.apiService.create(
      this.resource + "/register",
      formData
    );
    return response;
  }
}

export default RegistrationService;
