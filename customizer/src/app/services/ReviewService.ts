import APIService from "./ApiService";
import type { Product } from "@/app/Interfaces/Product";
import type { ReviewDTO } from "@/app/DTOs/ReviewDTO";

class ReviewService {
    private apiService: APIService;
    private resource: string = "reviews";

    constructor(apiService: APIService = new APIService()) {
        this.apiService = apiService;
    }

    async createReview(
        productId: string,
        data: Omit<ReviewDTO, "id">
    ): Promise<Product> {
        const res = await this.apiService.create<Product>(
            `products/${productId}/reviews`,
            data
        );
        return res;
    }

    async deleteReview(reviewId: string): Promise<void> {
        await this.apiService.delete<void>(this.resource, reviewId);
    }

    async isReviewAllowed(
        productId: string,
        userId: string
    ): Promise<boolean> {
        const res = await this.apiService.get<boolean>(
            `${this.resource}/product/${productId}/allowed/${userId}`
        );
        return res;
    }
}

export default ReviewService;
