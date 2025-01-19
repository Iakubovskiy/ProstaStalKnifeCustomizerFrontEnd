import React, {Suspense, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { OrderHeader } from '@/app/components/OrderDetails/OrderHeader';
import { OrderForm } from '@/app/components/OrderDetails/OrderForm';
import { ProductList } from '@/app/components/OrderDetails/ProductList';
import { useOrder } from '@/app/hooks/useOrder';
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import DeliveryType from "@/app/Models/DeliveryType";

const OrderDetailsPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const { isLoading, error } = useOrder(id as string);

    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
    const [isDeliveryTypesLoading, setIsDeliveryTypesLoading] = useState(true);

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
            <p className="mt-2">{(error as Error).message}</p>
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
        <OrderHeader orderId={id as string}/>
        <div className="max-w-7xl mx-auto space-y-6">
          <OrderForm orderId={id as string} deliveryTypes={deliveryTypes}/>
          <Suspense
              fallback={
                <div className="w-full h-[200px] flex items-center justify-center">
                    Завантаження ...
                </div>
              }
          >
            <ProductList orderId={id as string} />
          </Suspense>
        </div>
      </div>
  );
};

export default OrderDetailsPage;