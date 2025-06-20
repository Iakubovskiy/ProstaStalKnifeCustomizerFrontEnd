import APIService from "./ApiService";
import type { NotificationDTO } from "@/app/DTOs/NotificationDTO";

class NotificationService {
    private apiService: APIService;
    private resource: string = "notifications";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async send(data: NotificationDTO): Promise<void> {
        await this.apiService.create<void>(this.resource, data);
    }
}

export default NotificationService;