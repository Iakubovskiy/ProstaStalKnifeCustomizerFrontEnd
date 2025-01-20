import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { OrderHeader } from '@/app/components/OrderDetails/OrderHeader';
import { OrderForm } from '@/app/components/OrderDetails/OrderForm';
import { ProductList } from '@/app/components/OrderDetails/ProductList';
import DeliveryTypeService from '@/app/services/DeliveryTypeService';
import KnifeService from '@/app/services/KnifeService';
import DeliveryType from '@/app/Models/DeliveryType';
import Engraving from "@/app/Models/Engraving";
import OrderService from '@/app/services/OrderService';
import ReturnOrderDTO from "@/app/DTO/ReturnOrderDTO";
const OrderDetailsPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;

    const [order, setOrder] = useState<ReturnOrderDTO | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
    const [engravings, setEngravings] = useState<Engraving[]>([]);
    const [isDeliveryTypesLoading, setIsDeliveryTypesLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const orderService = new OrderService();
            try {
                if (id) {
                    const data = await orderService.getById(id as string);
                    setOrder(data);
                }
            } catch (err) {
                setError('Не вдалося завантажити замовлення');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    useEffect(() => {
        const fetchDeliveryTypes = async () => {
            const deliveryTypesService = new DeliveryTypeService();
            try {
                const data = await deliveryTypesService.getAll();
                setDeliveryTypes(data);
            } catch (err) {
                console.error('Error fetching delivery types:', err);
            } finally {
                setIsDeliveryTypesLoading(false);
            }
        };

        if (id) {
            fetchDeliveryTypes();
        }
    }, [id]);

    useEffect(() => {
        const fetchEngravings = async () => {
            const data: Engraving[] = [];
            const knifeService = new KnifeService();
            if (order?.products) {
                for (const product of order.products) {
                    if (product.productType.toLowerCase() === "knife") {
                        try {
                            const knife = await knifeService.getById(product.productId);
                            if (knife.engravings) {
                                data.push(...knife.engravings);
                            }
                        } catch (error) {
                            console.error(`Error fetching knife data for product ID ${product.productId}:`, error);
                        }
                    }
                }
            }
            setEngravings(data);
        };

        if (order) {
            fetchEngravings();
        }
    }, [order]);

    if (isLoading || isDeliveryTypesLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Завантаження...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600">Помилка завантаження</h2>
                    <p className="mt-2">{error}</p>
                    <button
                        onClick={() => router.push('/orders')}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded"
                    >
                        Повернутись до списку
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <OrderHeader orderId={id as string} />
            <div className="max-w-7xl mx-auto space-y-6">
                <OrderForm orderId={id as string} deliveryTypes={deliveryTypes} />
                <ProductList orderId={id as string} />
                <EngravingFiles engravings={engravings} />
            </div>
        </div>
    );
};

interface EngravingFilesProps {
    engravings: Engraving[];
}

const EngravingFiles: React.FC<EngravingFilesProps> = ({ engravings }) => {
    if (engravings.length === 0) {
        return <p>Немає доступних файлів для гравіювання.</p>;
    }

    return (
        <div>
            <h3 className="text-lg font-semibold">Файли для гравіювання</h3>
            <ul className="list-disc pl-5 space-y-2">
                {engravings.map((engraving, index) => (
                    engraving.pictureUrl && (
                        <li key={index}>
                            <a
                                href={engraving.pictureUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Завантажити файл {index + 1}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default OrderDetailsPage;
