import React, { useState, useEffect } from "react";
import Knife from "@/app/Models/Knife";
import DeliveryType from "@/app/Models/DeliveryType";
import OrderService from "@/app/services/OrderService";
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import "../../styles/globals.css";
import KnifeService from "@/app/services/KnifeService";
import EngravingPriceService from "@/app/services/EngravingPriceService";

const CartAndOrderPage = () => {
  const [cartItems, setCartItems] = useState<Knife[]>([]);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [clientInfo, setClientInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
  });
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    number | null
  >(null);
  const [comment, setComment] = useState<string>("");
  const [engravingPriceService, setengravingPriceService] =
    useState<EngravingPriceService>(new EngravingPriceService());
  const [engravingPrice, setengravingPrice] = useState<EngravingPrice[]>([]);
  const orderService = new OrderService();
  const deliveryTypeService = new DeliveryTypeService();
  const knifeService = new KnifeService();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
    // const engpr: EngravingPrice[] = await engravingPriceService.getAll();
    // setengravingPrice();
    deliveryTypeService.getAll().then((types) => setDeliveryTypes(types));
  }, []);
  const handleSelectionChange = (key: string | number | undefined) => {
    if (key) {
      setSelectedDeliveryType(parseInt(key.toString(), 10));
      console.log(key);
    }
  };
  const createOrder = async () => {
    if (
      !clientInfo.fullName ||
      !clientInfo.phoneNumber ||
      !clientInfo.city ||
      !selectedDeliveryType
    ) {
      alert("Заповніть обов'язкові поля");
      return;
    }

    const total = cartItems.reduce((sum, item) => {
      let uniqueSides;
      if (item.engraving != null) {
        const uniqueSides1 = new Set(
          item.engraving.map((engraving) => engraving.side)
        );
        uniqueSides = uniqueSides1.size;
      } else {
        uniqueSides = 0;
      }
      const engravingPriceService = new EngravingPriceService();
      // const prices = await engravingPriceService.getAll();
      const itemTotal =
        item.quantity *
        (item.shape.price +
          item.bladeCoating.price +
          (item.sheathColor.price || 0) +
          (item.fastening?.reduce((fSum, f) => fSum + f.price, 0) || 0));
      return sum + itemTotal;
    }, 0);

    const orderData: Order = {
      id: 0,
      number: `ORD-${Date.now()}`,
      total,
      knifes: cartItems,
      delivery: deliveryTypes.find((type) => type.id === selectedDeliveryType)!,
      clientFullName: clientInfo.fullName,
      clientPhoneNumber: clientInfo.phoneNumber,
      countryForDelivery: clientInfo.country,
      city: clientInfo.city,
      email: clientInfo.email,
      comment: comment || null,
      status: { id: 1, status: "Активний" },
    };

    try {
      console.log("Order Data: ", orderData);
      const createdOrder = await orderService.create(orderData);
      alert("Order created successfully!");
      console.log("Created Order: ", createdOrder);
      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to create order: ", error);
      alert("Failed to create order.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Кошик та Замовлення</h1>

        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ваша корзина</h2>
          {cartItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableColumn>Назва</TableColumn>
                <TableColumn>Кількість</TableColumn>
                <TableColumn>Ціна</TableColumn>
                <TableColumn>Дії</TableColumn>
              </TableHeader>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.shape.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity.toString()}
                        readOnly
                        min={1}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          const updatedItems = [...cartItems];
                          updatedItems[index].quantity = newQuantity;
                          setCartItems(updatedItems);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedItems)
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      $
                      {item.quantity *
                        (item.shape.price + item.bladeCoating.price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        onClick={() => {
                          const updatedItems = cartItems.filter(
                            (_, i) => i !== index
                          );
                          setCartItems(updatedItems);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedItems)
                          );
                        }}
                      >
                        Прибрати
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Ваша корзина пуста</p>
          )}
        </Card>

        {/* Order Form */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Оформлення замовлення</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Повне ім'я"
              required
              value={clientInfo.fullName}
              onChange={(e) =>
                setClientInfo((prev) => ({ ...prev, fullName: e.target.value }))
              }
            />
            <Input
              label="Номер телефону"
              required
              value={clientInfo.phoneNumber}
              onChange={(e) =>
                setClientInfo((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
            <Input
              label="Email"
              type="email"
              required
              value={clientInfo.email}
              onChange={(e) =>
                setClientInfo((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <Input
              label="Країна"
              required
              value={clientInfo.country}
              onChange={(e) =>
                setClientInfo((prev) => ({ ...prev, country: e.target.value }))
              }
            />
            <Input
              label="Місто"
              required
              value={clientInfo.city}
              onChange={(e) =>
                setClientInfo((prev) => ({ ...prev, city: e.target.value }))
              }
            />
            <Select
              label="Тип доставки"
              required
              selectedKeys={selectedDeliveryType ? [selectedDeliveryType] : []}
              onSelectionChange={(selection) => {
                const selectedId = Array.from(selection)[0];
                console.log(selectedId);
                setSelectedDeliveryType(Number(selectedId));
              }}
            >
              {deliveryTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} - ${type.price}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Input
            label="Коментар (опціонально)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button className="mt-4" onClick={createOrder}>
            Оформити замовлення
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CartAndOrderPage;
