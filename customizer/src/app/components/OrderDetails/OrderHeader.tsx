import React, { useEffect, useState } from 'react';
import { Card } from '@nextui-org/react';
import OrderService from '../../services/OrderService';

interface OrderHeaderProps {
    orderId: string;
}

const orderService = new OrderService();

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId }) => {
    const [order, setOrder] = useState<{ number: string; status: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getById(orderId);
                setOrder(data);
            } catch (err) {
                setError('Не вдалося завантажити замовлення');
            }
        };

        fetchOrder();
    }, [orderId]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Card className="mb-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Замовлення #{order?.number}</h3>
                </div>
                <div>
                    <small>Статус: {order?.status}</small>
                </div>
            </div>
        </Card>
    );
};
