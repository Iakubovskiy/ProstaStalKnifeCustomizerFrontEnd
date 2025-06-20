import { API_BASE_URL } from "../config";

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    url: string,
    method: string = "GET",
    body?: FormData | any,
    headers: HeadersInit = this.getDefaultHeaders(body instanceof FormData)
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}/${url}`, {
      method,
      headers,
      body:
        body instanceof FormData
          ? body
          : body
          ? JSON.stringify(body)
          : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(response.status);
      throw new Error(
        `HTTP Error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    // Перевіряємо чи є контент для парсингу
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // Якщо немає контенту або це не JSON, повертаємо null або порожній об'єкт
    if (
      response.status === 204 || // No Content
      contentLength === "0" ||
      !contentType?.includes("application/json")
    ) {
      return null as T;
    }

    // Спробуємо отримати текст відповіді
    const responseText = await response.text();

    // Якщо текст порожній, повертаємо null
    if (!responseText.trim()) {
      return null as T;
    }

    // Спробуємо розпарсити JSON
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  }

  private getLocaleFromCookies(): string {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/locale=([^;]+)/);
      return match ? match[1] : "ua";
    }
    return "ua";
  }

  private getCurrencyFromCookies(): string {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/currency=([^;]+)/);
      return match ? match[1] : "uah";
    }
    return "uah";
  }

  private getDefaultHeaders(isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    headers["Access-Control-Allow-Origin"] = "*";
    headers["X-Requested-With"] = "XMLHttpRequest";
    headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";

    const locale = this.getLocaleFromCookies();
    const currency = this.getCurrencyFromCookies();

    headers["Accept-Language"] = locale;
    headers["Locale"] = locale;
    headers["Currency"] = currency;

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  public getCurrentLocale(): string {
    return this.getLocaleFromCookies();
  }

  public getCurrentCurrency(): string {
    return this.getCurrencyFromCookies();
  }

  public getCurrentSettings() {
    return {
      locale: this.getCurrentLocale(),
      currency: this.getCurrentCurrency(),
    };
  }

  getAll<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(resource);
  }

  get<T>(resource: string): Promise<T> {
    return this.request<T>(resource);
  }

  getById<T>(resource: string, id: number | string): Promise<T> {
    return this.request<T>(`${resource}/${id}`);
  }

  create<T>(resource: string, data: FormData | any): Promise<T> {
    return this.request<T>(resource, "POST", data);
  }

  update<T>(
    resource: string,
    id: number | string,
    data: FormData | any
  ): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "PUT", data);
  }

  partialUpdate<T>(
    resource: string,
    id: number | string,
    data: FormData | any
  ): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "PATCH", data);
  }

  delete<T>(resource: string, id: number | string): Promise<T> {
    return this.request<T>(`${resource}/${id}`, "DELETE");
  }

  public async NotStandardPartialUpdate<T>(
      url: string,
      body?: FormData | any,
      headers: HeadersInit = this.getDefaultHeaders(body instanceof FormData)
  ): Promise<T> {
    const method = "PATCH";
    const response = await fetch(`${this.baseURL}/${url}`, {
      method,
      headers,
      body:
          body instanceof FormData
              ? body
              : body
                  ? JSON.stringify(body)
                  : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(response.status);
      throw new Error(
          `HTTP Error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    // Перевіряємо чи є контент для парсингу
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // Якщо немає контенту або це не JSON, повертаємо null або порожній об'єкт
    if (
        response.status === 204 || // No Content
        contentLength === "0" ||
        !contentType?.includes("application/json")
    ) {
      return null as T;
    }

    // Спробуємо отримати текст відповіді
    const responseText = await response.text();

    // Якщо текст порожній, повертаємо null
    if (!responseText.trim()) {
      return null as T;
    }

    // Спробуємо розпарсити JSON
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  }

  public async NotStandardDelete<T>(
      url: string,
      body?: FormData | any,
      headers: HeadersInit = this.getDefaultHeaders(body instanceof FormData)
  ): Promise<T> {
    const method = "DELETE";
    const response = await fetch(`${this.baseURL}/${url}`, {
      method,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(response.status);
      throw new Error(
          `HTTP Error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    // Перевіряємо чи є контент для парсингу
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");

    // Якщо немає контенту або це не JSON, повертаємо null або порожній об'єкт
    if (
        response.status === 204 || // No Content
        contentLength === "0" ||
        !contentType?.includes("application/json")
    ) {
      return null as T;
    }

    // Спробуємо отримати текст відповіді
    const responseText = await response.text();

    // Якщо текст порожній, повертаємо null
    if (!responseText.trim()) {
      return null as T;
    }

    // Спробуємо розпарсити JSON
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON:", responseText);
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  }
}

export default APIService;
