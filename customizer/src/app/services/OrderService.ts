import APIService from "./ApiService";
import Order from "../Models/Order";
import DeliveryType from "../Models/DeliveryType";
import DeliveryDataDTO from "@/app/DTO/DeliveryDataDTO";
import ReturnOrderDTO from "@/app/DTO/ReturnOrderDTO";
import CreateOrderDTO from "@/app/DTO/CreateOrderDTO";

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

    async getById(id: string): Promise<ReturnOrderDTO> {
        const response = await this.apiService.getById<ReturnOrderDTO>(
            this.resource,
            id
        );
        return response;
    }

    async create(
        Order: CreateOrderDTO
    ): Promise<Order> {
        const formData = new FormData();

        formData.append("Number", Order.number);
        formData.append("Total", Order.total.toString());
        formData.append("Status", Order.status);
        formData.append("DeliveryTypeId", Order.deliveryTypeId);
        formData.append("ProductIdsJson", JSON.stringify(Order.products));
        formData.append("ProductQuantitiesJson", JSON.stringify(Order.productQuantities));
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
        id: string,
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
        id: string,
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
        id: string,
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

    async delete(id: string): Promise<boolean> {
        const response = await this.apiService.delete<{ isDeleted: boolean }>(
            this.resource,
            id
        );
        return response.isDeleted;
    }
}

export default OrderService;
