import APIService from "./ApiService";
import type { LoginDTO } from "@/app/DTOs/LoginDTO";
import type { RegisterDTO } from "@/app/DTOs/RegisterDTO";
import type { UpdateUserDTO } from "@/app/DTOs/UpdateUserDTO";
import type { User } from "@/app/Interfaces/User";
import type { ClientData } from "@/app/DTOs/ClientData";

class UserService {
    private apiService: APIService;
    private resource: string = "users";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async login(data: LoginDTO): Promise<string> {
        const token = await this.apiService.create<string>(
            `${this.resource}/login`,
            data
        );
        return token;
    }

    async register(data: RegisterDTO): Promise<User> {
        const createdUser = await this.apiService.create<User>(
            `${this.resource}/register`,
            data
        );
        return createdUser;
    }

    async getCurrentUser(): Promise<User> {
        const user = await this.apiService.get<User>(
            `${this.resource}/current`
        );
        return user;
    }

    async getAll(): Promise<User[]> {
        const users = await this.apiService.getAll<User>(this.resource);
        return users;
    }

    async getById(id: string): Promise<User> {
        const user = await this.apiService.getById<User>(this.resource, id);
        return user;
    }

    async update(id: string, data: UpdateUserDTO): Promise<User> {
        const updatedUser = await this.apiService.update<User>(
            this.resource,
            id,
            data
        );
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        await this.apiService.delete<void>(this.resource, id);
    }

    async getCurrentUserData(): Promise<ClientData> {
        const userData = await this.apiService.get<ClientData>(
            `${this.resource}/user-data`
        );
        return userData;
    }

    async updateCurrentUserData(data: ClientData): Promise<ClientData> {
        const updatedUserData = await this.apiService.update<ClientData>(
            `${this.resource}/user-data`,
            "PUT",
            data
        );
        return updatedUserData;
    }

    async getUserRoles(): Promise<string[]> {
        const roles = await this.apiService.get<string[]>(
            `${this.resource}/user-roles`
        );
        return roles;
    }
}

export default UserService;