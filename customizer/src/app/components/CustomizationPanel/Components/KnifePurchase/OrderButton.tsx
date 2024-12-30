import React from 'react';
import { useRouter } from 'next/navigation';
import Knife from '@/app/Models/Knife';

interface Props {
    currentKnife: Knife;
}

export const OrderButton: React.FC<Props> = ({ currentKnife }) => {
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/Cart');
    };

    return (
        <button
            onClick={handleCheckout}
            className="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
            Оформити замовлення
        </button>
    );
};