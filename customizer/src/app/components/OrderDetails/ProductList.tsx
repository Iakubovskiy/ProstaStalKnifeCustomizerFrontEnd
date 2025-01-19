import React, {useEffect, useState} from 'react';
import { ProductCard } from './ProductCard';
import OrderService from '../../services/OrderService';
import ReturnOrderDTO from "@/app/DTO/ReturnOrderDTO";

interface ProductListProps {
    orderId: string;
}

export const ProductList: React.FC<ProductListProps> = ({ orderId }) => {
    const [order, setOrder] = useState<ReturnOrderDTO | null>(null);
    const orderService = new OrderService();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 1;
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const fetchedOrder = await orderService.getById(orderId);
                setOrder(fetchedOrder);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (!order) {
        return <div>Завантаження...</div>;
    }

    // Розрахунок поточної сторінки
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = order.products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(order.products.length / productsPerPage)) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return (
        <div className="space-y-4">
            {currentProducts.map((product, index) => (
                <ProductCard key={index} id={product.productId} type={product.productType} />
            ))}

            <div className="flex justify-between mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1 ? 'bg-gray-300' : 'bg-primary text-white'
                    }`}
                >
                    Попередня
                </button>
                <button
                    disabled={currentPage === Math.ceil(order.products.length / productsPerPage)}
                    onClick={handleNextPage}
                    className={`px-4 py-2 rounded ${
                        currentPage === Math.ceil(order.products.length / productsPerPage)
                            ? 'bg-gray-300'
                            : 'bg-primary text-white'
                    }`}
                >
                    Наступна
                </button>
            </div>
        </div>
    );
};