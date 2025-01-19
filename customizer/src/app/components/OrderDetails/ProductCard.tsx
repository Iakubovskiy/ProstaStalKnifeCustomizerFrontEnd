import React, {Suspense} from 'react';
import { Card } from '@nextui-org/react';
import Product from '../../Models/Product';
import CustomCanvas from '../CustomCanvas/CustomCanvas';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    return (
        <Card>
                <div className="w-full md:w-1/2 h-[300px]">
                    <Suspense fallback={<div>Loading 3D Model...</div>}>
                        <CustomCanvas />
                    </Suspense>
                </div>

        </Card>
    );
};