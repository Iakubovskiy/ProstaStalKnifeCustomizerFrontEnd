import APIService from "./ApiService";

interface AuthResponse {
  token: string;
}

class AuthService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Auth"; // Ваш API шлях для аутентифікації
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();

    // Додаємо поля для логіна
    formData.append("Username", username);
    formData.append("Password", password);

    try {
      // Викликаємо API для аутентифікації
      const response: AuthResponse = await this.apiService.create(
        this.resource + "/login",
        formData
      );

      // Зберігаємо отриманий токен в localStorage
      if (response && response.token) {
        localStorage.setItem("token", response.token); // Токен зберігається
        return response;
      }
      throw new Error("Login failed");
    } catch (error) {
      throw new Error(
        "An error occurred during login: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  // Логік виходу
  async logout(): Promise<any> {
    try {
      await this.apiService.create(this.resource + "/logout", new FormData());

      localStorage.removeItem("token");
      return { status: "Logged out successfully" };
    } catch (error) {
      throw new Error(
        "An error occurred during logout: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  // Отримання токену з localStorage
  getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Перевірка, чи токен є
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token !== null;
  }
}
export default AuthService;
