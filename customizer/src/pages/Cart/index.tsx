import React, { useState, useEffect } from "react";
import Knife from "@/app/Models/Knife";
import { Button, Card, Input, Table } from "@nextui-org/react";

type OrderInfo = {
  fullName: string;
  address: string;
  email: string;
  phone: string;
};

const CartAndOrderPage = () => {
  const [cartItems, setCartItems] = useState<Knife[]>([]);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    fullName: "",
    address: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    console.log("Order placed:", { ...orderInfo, cartItems });
    localStorage.removeItem("cart");
    setCartItems([]);
    setOrderInfo({ fullName: "", address: "", email: "", phone: "" });
    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cart and Order</h1>

        {/* Cart Items Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {cartItems.length > 0 ? (
            <Table>
              <Table.Header>
                <Table.Column>Knife</Table.Column>
                <Table.Column>Quantity</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {cartItems.map((item, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <div>
                        <p>Name: {item.shape.name}</p>
                        <p>Coating: {item.bladeCoating.name}</p>
                        <p>Handle Color: {item.handleColor.color}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        type="number"
                        value={item.quantity.toString()}
                        min={1}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="error"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </Card>

        {/* Order Information Section */}
        {cartItems.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="fullName"
                value={orderInfo.fullName}
                onChange={handleOrderInputChange}
              />
              <Input
                label="Address"
                name="address"
                value={orderInfo.address}
                onChange={handleOrderInputChange}
              />
              <Input
                label="Email"
                name="email"
                value={orderInfo.email}
                type="email"
                onChange={handleOrderInputChange}
              />
              <Input
                label="Phone"
                name="phone"
                value={orderInfo.phone}
                type="tel"
                onChange={handleOrderInputChange}
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button color="primary" onClick={handlePlaceOrder}>
                Place Order
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartAndOrderPage;
