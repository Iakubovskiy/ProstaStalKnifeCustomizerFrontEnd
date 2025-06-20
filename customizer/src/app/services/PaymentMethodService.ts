import APIService from "./ApiService";
import type { PaymentMethod } from "@/app/Interfaces/PaymentMethod";
import type { PaymentMethodDTO } from "@/app/DTOs/PaymentMethodDTO";

class PaymentMethodService {
    private apiService: APIService;
    private resource: string = "payment-methods";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async getAll(): Promise<PaymentMethod[]> {
        const res = await this.apiService.getAll<PaymentMethod>(this.resource);
        return res;
    }

    async getAllActive(): Promise<PaymentMethod[]> {
        const res = await this.apiService.getAll<PaymentMethod>(
            `${this.resource}/active`
        );
        return res;
    }

    async getById(id: string): Promise<PaymentMethod> {
        const res = await this.apiService.getById<PaymentMethod>(this.resource, id);
        return res;
    }

    async create(data: PaymentMethodDTO): Promise<PaymentMethod> {
        const createdDto = await this.apiService.create<PaymentMethod>(
            this.resource,
            data
        );
        return createdDto;
    }

    async update(id: string, data: PaymentMethodDTO): Promise<PaymentMethod> {
        const updatedDto = await this.apiService.update<PaymentMethod>(
            this.resource,
            id,
            data
        );
        return updatedDto;
    }

    async delete(id: string): Promise<void> {
        await this.apiService.delete<void>(this.resource, id);
    }

    async activate(id: string): Promise<void> {
        await this.apiService.partialUpdate<void>(
            `${this.resource}/activate`,
            id,
            {}
        );
    }

    async deactivate(id: string): Promise<void> {
        await this.apiService.partialUpdate<void>(
            `${this.resource}/deactivate`,
            id,
            {}
        );
    }
}

export default PaymentMethodService;