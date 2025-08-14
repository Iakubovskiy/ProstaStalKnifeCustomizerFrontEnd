import './style.css';

interface QuantityInputProps {
    quantity: number;
    addQuantity: () => void;
    reduceQuantity: () => void;
}

const QuantityInput = ({quantity, addQuantity, reduceQuantity}: QuantityInputProps) => {
    return (
        <div className="quantity-input-block">
            <label className="quantity-input-label">Кількість:</label>
            <div className="quantity-input-container">
                <button className="quantity-control-button" onClick={reduceQuantity}>
                    -
                </button>
                <input className="quantity-input" type="text" value={quantity} readOnly />
                <button className="quantity-control-button" onClick={addQuantity}>
                    +
                </button>
            </div>
        </div>
    )
}

export default QuantityInput;