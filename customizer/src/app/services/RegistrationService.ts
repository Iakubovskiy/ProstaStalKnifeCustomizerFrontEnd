import APIService from "./ApiService"; // Замініть на свій API-сервіс

class RegistrationService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Registration";
  }

  // Реєстрація користувача
  async register(
    username: string,
    password: string,
    role: string,
    email: string,
    phoneNumber: string
  ): Promise<any> {
    const formData = new FormData();

    // Додаємо поля
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
