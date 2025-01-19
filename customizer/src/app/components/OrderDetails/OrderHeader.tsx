import React from 'react';
import { Card } from '@nextui-org/react';
import { useOrder } from '../../hooks/useOrder';

interface OrderHeaderProps {
    orderId: string;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId }) => {
    const { order } = useOrder(orderId);

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
