import { API_BASE_URL } from "../config";
import DeliveryType from "./../Models/DeliveryType";

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
    console.log(`${this.baseURL}/${url}`);
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
    return response.json();
  }
  private getDefaultHeaders(isFormData: boolean = false): HeadersInit {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    headers["Access-Control-Allow-Origin"] = "*";
    headers["X-Requested-With"] = "XMLHttpRequest";
    headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS";
    // Приклад додавання токену авторизації
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }
  getAll<T>(resource: string): Promise<T[]> {
    return this.request<T[]>(resource);
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
}

export default APIService;
