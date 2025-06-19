import APIService from "./ApiService";

interface AuthResponse {
  token: string;
}

class AuthService {
  private apiService: APIService;
  private resource: string;

  constructor(apiService: APIService = new APIService()) {
    this.apiService = apiService;
    this.resource = "Auth";
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();

    formData.append("Username", username);
    formData.append("Password", password);

    try {
      const response: AuthResponse = await this.apiService.create(
        this.resource + "/login",
        formData
      );

      if (response && response.token) {
        localStorage.setItem("token", response.token);
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

  getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token !== null;
  }
}
export default AuthService;
