import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Button, Select, SelectItem } from '@nextui-org/react';
import OrderService from '../../services/OrderService';
import DeliveryType from '@/app/Models/DeliveryType';
import DeliveryDataDTO from '@/app/DTO/DeliveryDataDTO';
import DeliveryTypeService from "@/app/services/DeliveryTypeService";

interface OrderFormData {
    number: string;
    clientFullName: string;
    status: string;
    total: number;
    comment?: string;
    clientPhoneNumber: string;
    city: string;
    country: string;
    email: string;
    deliveryTypeId: string;
}

export const OrderForm: React.FC<{ orderId: string; deliveryTypes: DeliveryType[] }> = ({ orderId, deliveryTypes }) => {
    const [order, setOrder] = useState<OrderFormData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const orderService = new OrderService();
    const deliveryTypeService = new DeliveryTypeService();

    const form = useForm<OrderFormData>();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const fetchedOrder = await orderService.getById(orderId);
                const orderData: OrderFormData = {
                    number: fetchedOrder.number,
                    clientFullName: fetchedOrder.clientFullName,
                    status: fetchedOrder.status,
                    total: fetchedOrder.total,
                    clientPhoneNumber: fetchedOrder.clientPhoneNumber,
                    city: fetchedOrder.city,
                    country: fetchedOrder.countryForDelivery,
                    email: fetchedOrder.email,
                    deliveryTypeId: fetchedOrder.deliveryType.id,
                    comment: fetchedOrder.comment || '',
                };
                setOrder(orderData);
                form.reset(orderData);  // Оновлюємо значення форми після перетворення
                setIsLoading(false);
            } catch (err) {
                setError('Не вдалося завантажити замовлення');
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, form]);

    const onSubmit = async (data: OrderFormData) => {
        try {
            if (data.status !== order?.status) {
                await orderService.updateStatus(orderId, data.status);
            }
            if (
                data.clientFullName !== order?.clientFullName ||
                data.clientPhoneNumber !== order?.clientPhoneNumber ||
                data.email !== order?.email ||
                data.city !== order?.city ||
                data.country !== order?.country
            ) {
                const deliveryData: DeliveryDataDTO = {
                    ClientFullName: data.clientFullName,
                    ClientPhoneNumber: data.clientPhoneNumber,
                    Email: data.email,
                    City: data.city,
                    CountryForDelivery: data.country,
                };
                await orderService.updateDeliveryData(orderId, deliveryData);
            }
            if (data.deliveryTypeId !== order?.deliveryTypeId) {
                const type = await deliveryTypeService.getById(data.deliveryTypeId);
                await orderService.updateDeliveryType(orderId, type);
            }

            console.log('Замовлення успішно оновлено!');
        } catch (error) {
            console.error('Не вдалося оновити замовлення:', error);
        }
    };

    if (isLoading) return <p>Завантаження...</p>;
    if (error) return <p>Помилка: {error}</p>;

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Input
                    label="Номер замовлення"
                    {...form.register('number', { required: 'Поле обов’язкове' })}
                />
                {form.formState.errors.number && (
                    <small style={{ color: 'red' }}>{form.formState.errors.number.message}</small>
                )}
            </div>

            <div>
                <Input
                    label="Ім'я клієнта"
                    {...form.register('clientFullName', { required: 'Поле обов’язкове' })}
                />
                {form.formState.errors.clientFullName && (
                    <small style={{ color: 'red' }}>{form.formState.errors.clientFullName.message}</small>
                )}
            </div>

            <div>
                <Input
                    label="Загальна сума"
                    type="number"
                    {...form.register('total', {
                        required: 'Поле обов’язкове',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Сума не може бути від’ємною' },
                    })}
                />
                {form.formState.errors.total && (
                    <small style={{ color: 'red' }}>{form.formState.errors.total.message}</small>
                )}
            </div>

            <div>
                <Input label="Коментар" {...form.register('comment')} />
            </div>

            <div>
                <Select
                    label="Оберіть тип доставки"
                    placeholder="Тип доставки"
                    value={order?.deliveryTypeId || ''}
                    onChange={(e) => form.setValue('deliveryTypeId', e.target.value)}
                >
                    {deliveryTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                            {type.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <Button type="submit">
                Зберегти зміни
            </Button>
        </form>
    );
};
