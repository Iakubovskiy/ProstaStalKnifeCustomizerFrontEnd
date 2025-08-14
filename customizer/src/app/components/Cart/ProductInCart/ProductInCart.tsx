import './style.css';
import Image from 'next/image';
import QuantityInput from './QuantityInput/QuantityInput';

interface ProductInCartProps {
    index: number;
    name: string;
    pictureUrl: string;
    price: number;
    quantity: number;
    removeFromCart: (indexToRemove:number) => void;
    addQuantity: () => void;
    reduceQuantity: () => void;
}

const ProductInCart = (
        {index, name, pictureUrl, price, quantity, removeFromCart, addQuantity, reduceQuantity}: ProductInCartProps
    ) => {
    return (
        <div className="product-card">
            <div className="product-image-container">
                <Image src={pictureUrl} alt={name} className="product-image" width={130} height={130}/>
            </div>
            <div className="product-info">
                <div className="flex flex-row justify-between">
                <div>
                    <p className="product-name">{name}</p>
                    <p className="product-price">Ціна: {price} грн</p>
                </div>
                <div>
                        <Image
                            src="/icons/Cart/trash-icon.svg"
                            alt="delete icon"
                            width={30}
                            height={30}
                            className="product-delete-icon"
                            onClick={() => removeFromCart(index)}
                        />
                    </div>
                </div>
                <div className="product-total">
                    <QuantityInput quantity={quantity} addQuantity={addQuantity} reduceQuantity={reduceQuantity} />
                    <p className="product-price-total">Всього: {price*quantity} грн</p>
                </div>
            </div>

        </div>
    );
}

export default ProductInCart;