import React, { useState, useEffect } from "react";
import DeliveryType from "@/app/Models/DeliveryType";
import OrderService from "@/app/services/OrderService";
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import KnifeService from "@/app/services/KnifeService";
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
  Spinner,
} from "@nextui-org/react";
import "../../styles/globals.css";
import Toast from "../../app/components/Toast/Toast";
import { CartItem } from "@/app/Interfaces/CartItem";
import { OrderDTO } from "@/app/DTOs/OrderDTO";
import { OrderItemDTO } from "@/app/DTOs/OrderItemDTO";

const CartAndOrderPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [clientInfo, setClientInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
  });
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const orderService = new OrderService();
  const knifeService = new KnifeService();
  const deliveryTypeService = new DeliveryTypeService();

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem("cart");
      }
    }
    deliveryTypeService.getAllActive().then((types) => setDeliveryTypes(types));
  }, []);

  const handleCloseToast = () => setShowToast(false);

  const handleSelectionChange = (keys: any) => {
    // Обробник для Select від NextUI
    if (keys instanceof Set && keys.size > 0) {
      const selectedKey = Array.from(keys)[0] as string;
      setSelectedDeliveryType(selectedKey);
    }
  };

  const calculateTotal = () => {
    const deliveryPrice =
      deliveryTypes.find((d) => d.id === selectedDeliveryType)?.price || 0;
    // FIX: Тепер item.price існує, помилки не буде
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return itemsTotal + deliveryPrice;
  };

  const createOrder = async () => {
    if (
      !clientInfo.fullName ||
      !clientInfo.phoneNumber ||
      !clientInfo.city ||
      !selectedDeliveryType
    ) {
      alert("Будь ласка, заповніть усі обов'язкові поля.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Ваш кошик порожній.");
      return;
    }
    setIsLoading(true);

    try {
      const orderItems: OrderItemDTO[] = [];

      for (const item of cartItems) {
        let productId: string;
        if (item.type === "custom_knife") {
          console.log("Creating custom knife:", item.productData);
          const createdKnife = await knifeService.create(item.productData);
          productId = createdKnife.id;
        } else {
          productId = item.productId;
        }
        orderItems.push({ productId, quantity: item.quantity });
      }

      const orderData: OrderDTO = {
        orderItems: orderItems,
        deliveryTypeId: selectedDeliveryType,
        paymentMethodId: "some-default-payment-id",
        total: calculateTotal(),
        clientData: {
          clientFullName: clientInfo.fullName,
          clientPhoneNumber: clientInfo.phoneNumber,
          email: clientInfo.email,
          countryForDelivery: clientInfo.country,
          city: clientInfo.city,
        },
        comment: comment || null,
      };

      console.log("Creating order with data:", orderData);
      await orderService.create(orderData);

      setToastMessage("Замовлення успішно створено!");
      setShowToast(true);
      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to create order:", error);
      alert(
        "Сталася помилка при створенні замовлення. Будь ласка, спробуйте ще раз."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updatedItems = cartItems.filter(
      (_, index) => index !== indexToRemove
    );
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setToastMessage("Товар видалено з кошика");
    setShowToast(true);
  };

  const getItemName = (item: CartItem): string => {
    if (item.type === "custom_knife") {
      return item.productData.names["ua"] || "Кастомний ніж";
    }
    return item.name || `Продукт #${item.productId.substring(0, 8)}...`;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Кошик та Замовлення</h1>

        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Ваш кошик</h2>
          {cartItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableColumn>Назва</TableColumn>
                <TableColumn>Кількість</TableColumn>
                <TableColumn>Ціна за одиницю</TableColumn>
                <TableColumn>Сума</TableColumn>
                <TableColumn>Дії</TableColumn>
              </TableHeader>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={`${item.type}-${index}`}>
                    <TableCell>{getItemName(item)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    {/* FIX: Тепер item.price існує */}
                    <TableCell>₴{item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      ₴{(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="danger"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Прибрати
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Ваш кошик порожній</p>
          )}
        </Card>

        {cartItems.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Оформлення замовлення
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Повне ім'я"
                required
                value={clientInfo.fullName}
                onChange={(e) =>
                  setClientInfo((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
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
                  setClientInfo((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
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
                // FIX: Передаємо Set, що є більш правильним для NextUI
                selectedKeys={
                  selectedDeliveryType
                    ? new Set([selectedDeliveryType])
                    : undefined
                }
                onSelectionChange={handleSelectionChange}
                required
              >
                {deliveryTypes.map((type) => (
                  // Тут помилки не було, але перевіряємо, що key та value - це рядки
                  <SelectItem key={type.id} value={type.id}>
                    {`${type.name} - ₴${type.price.toFixed(2)}`}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Input
              label="Коментар (опціонально)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="text-right font-bold text-xl mt-6">
              Загальна сума: ₴{calculateTotal().toFixed(2)}
            </div>
            <Button
              className="mt-4"
              color="primary"
              onClick={createOrder}
              disabled={isLoading}
            >
              {isLoading ? <Spinner color="white" /> : "Оформити замовлення"}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartAndOrderPage;
