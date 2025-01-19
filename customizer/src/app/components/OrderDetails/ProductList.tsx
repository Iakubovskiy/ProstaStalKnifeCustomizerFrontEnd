import React from 'react';
import { ProductCard } from './ProductCard';
import OrderService from '../../services/OrderService';

interface ProductListProps {
    orderId: string;
}

export const ProductList: React.FC<ProductListProps> = ({ orderId }) => {
    const orderService = new OrderService();
    const order = await orderService.getById(orderId);

    return (
        <div className="space-y-4">
            {order.products.map((product, index) => (
                <ProductCard key={index} product={product} />
            ))}
        </div>
    );
};