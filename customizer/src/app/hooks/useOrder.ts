import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrderService from '../services/OrderService';
import DeliveryType from "@/app/Models/DeliveryType";
import DeliveryDataDTO from "@/app/DTO/DeliveryDataDTO";
import ReturnOrderDTO from "@/app/DTO/ReturnOrderDTO";

type QueryKey = ['order', string];

export const useOrder = (orderId: string) => {
    const queryClient = useQueryClient();
    const orderService = new OrderService();

    const { data: order, isLoading, error } = useQuery<ReturnOrderDTO, Error, ReturnOrderDTO, QueryKey>({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getById(orderId),
        enabled: !!orderId,
    });

    const updateOrderStatusMutation = useMutation({
        mutationFn: (data: Partial<string>) => orderService.updateStatus(orderId!, data!),
        onSuccess: () => {
            if (orderId) {
                queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            }
        },
    });

    const updateDeliveryDataMutation = useMutation({
        mutationFn: (data: DeliveryDataDTO) => orderService.updateDeliveryData(orderId!, data),
        onSuccess: () => {
            if (orderId) {
                queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            }
        },
    });

    const updateDeliveryTypeMutation = useMutation({
        mutationFn: (data: DeliveryType) => orderService.updateDeliveryType(orderId!, data),
        onSuccess: () => {
            if (orderId) {
                queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            }
        },
    });

    return {
        order,
        isLoading,
        error,
        updateOrderStatus: updateOrderStatusMutation.mutate,
        updateDeliveryData: updateDeliveryDataMutation.mutate,
        updateDeliveryType: updateDeliveryTypeMutation.mutate,
        isUpdatingStatus: updateOrderStatusMutation.isPending,
        isUpdatingDeliveryData: updateDeliveryDataMutation.isPending,
        isUpdatingDeliveryType: updateDeliveryTypeMutation.isPending,
    };
};