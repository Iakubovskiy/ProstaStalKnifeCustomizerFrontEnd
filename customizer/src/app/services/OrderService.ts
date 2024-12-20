import APIService from "./ApiService";
import Order from "../Models/Order";
import DeliveryDataDTO from "@/app/DTO/DeliveryDataDTO";

class OrderService {
    private apiService: APIService;
    private resource: string;

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
        this.resource = "Order";
    }

    async getAll(): Promise<Order[]> {
        const response = await this.apiService.getAll<Order>(
            this.resource
        );
        return response;
    }

    async getById(id: number): Promise<Order> {
        const response = await this.apiService.getById<Order>(
            this.resource,
            id
        );
        return response;
    }

    async create(
        Order: Order
    ): Promise<Order> {
        const formData = new FormData();

        formData.append("Id", "0");
        formData.append("Number", Order.number);
        formData.append("Total", Order.total.toString());
        formData.append("StatusId", Order.status.id.toString());
        formData.append("DeliveryTypeId", Order.delivery.id.toString());
        formData.append("KnivesIdsJson", JSON.stringify(Order.knifes.map(knife => knife.id)));
        formData.append("ClientFullName", Order.clientFullName);
        formData.append("ClientPhoneNumber", Order.clientPhoneNumber);
        formData.append("CountryForDelivery", Order.countryForDelivery);
        formData.append("City", Order.city);
        formData.append("Email", Order.email);
        if(Order.comment)
            formData.append("Comment", Order.comment);

        const response = await this.apiService.create<Order>(
            this.resource,
            formData
        );
        return response;
    }

    async updateStatus(
        id: number,
        status: string
    ): Promise<Order> {
        const formData = new FormData();

        formData.append("status", status);

        const response = await this.apiService.partialUpdate<Order>(
            `${this.resource}/update/status`,
            id,
            formData
        );
        return response;
    }

    async updateDeliveryData(
        id: number,
        deliveryData: DeliveryDataDTO
    ): Promise<Order> {
        const formData = new FormData();

        formData.append("ClientFullName", deliveryData.ClientFullName);
        formData.append("ClientPhoneNumber", deliveryData.ClientPhoneNumber);
        formData.append("CountryForDelivery", deliveryData.CountryForDelivery);
        formData.append("City", deliveryData.City);
        formData.append("Email", deliveryData.Email);

        const response = await this.apiService.partialUpdate<Order>(
            `${this.resource}/update/delivery-data`,
            id,
            formData
        );
        return response;
    }

    async updateDeliveryType(
        id: number,
        deliveryType: DeliveryType
    ): Promise<Order> {
        const formData = new FormData();

        formData.append("Id", deliveryType.id.toString());
        formData.append("Name", deliveryType.name);
        formData.append("Price", deliveryType.price.toString());
        if(deliveryType.comment)
            formData.append("Comment", deliveryType.comment);

        const response = await this.apiService.partialUpdate<Order>(
            `${this.resource}/update/delivery-type`,
            id,
            formData
        );
        return response;
    }

    async delete(id: number): Promise<boolean> {
        const response = await this.apiService.delete<{ isDeleted: boolean }>(
            this.resource,
            id
        );
        return response.isDeleted;
    }
}

export default OrderService;
