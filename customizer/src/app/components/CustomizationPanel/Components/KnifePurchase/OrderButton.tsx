import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const OrderButton: React.FC = () => {
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/Cart');
    };
    const { t } = useTranslation();

    return (
        <button
            onClick={handleCheckout}
            className="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
            {t("orderButtons.order")}
        </button>
    );
};