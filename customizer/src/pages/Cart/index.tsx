"use client";
import React, { useState, useEffect } from "react";
import DeliveryType from "@/app/Models/DeliveryType";
import OrderService from "@/app/services/OrderService";
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import KnifeService from "@/app/services/KnifeService";
import PaymentMethodService from "@/app/services/PaymentMethodService";
import EngravingService from "@/app/services/EngravingService";
import { PaymentMethod } from "@/app/Interfaces/PaymentMethod";
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
import { ClientData } from "@/app/DTOs/ClientData";

const CartAndOrderPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [clientInfo, setClientInfo] = useState<ClientData>({
    clientFullName: "",
    clientPhoneNumber: "",
    email: "",
    countryForDelivery: "",
    city: "",
    address: "",
    zipCode: "",
  });

  const [selectedDeliveryType, setSelectedDeliveryType] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Стан для валідації телефону
  const [phoneError, setPhoneError] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);

  const orderService = new OrderService();
  const knifeService = new KnifeService();
  const deliveryTypeService = new DeliveryTypeService();
  const paymentMethodService = new PaymentMethodService();
  const engravingService = new EngravingService();

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Функція валідації номера телефону
  const validatePhoneNumber = (
    phone: string
  ): { isValid: boolean; error: string } => {
    if (!phone.trim()) {
      return { isValid: false, error: "Номер телефону обов'язковий" };
    }

    // Видаляємо всі пробіли, дефіси та дужки для перевірки
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // Перевіряємо чи містить тільки цифри та символ +
    if (!/^[\+]?[0-9]+$/.test(cleanPhone)) {
      return {
        isValid: false,
        error: "Номер може містити тільки цифри, +, пробіли, дефіси та дужки",
      };
    }

    // Перевіряємо довжину (від 10 до 15 цифр, враховуючи міжнародні номери)
    const digitsOnly = cleanPhone.replace(/^\+/, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return {
        isValid: false,
        error: "Номер повинен містити від 10 до 15 цифр",
      };
    }

    // Українські номери (додаткова перевірка)
    if (cleanPhone.startsWith("+380") || cleanPhone.startsWith("380")) {
      const ukrainianDigits = cleanPhone.replace(/^(\+380|380)/, "");
      if (ukrainianDigits.length !== 9) {
        return {
          isValid: false,
          error: "Український номер повинен мати формат +380XXXXXXXXX",
        };
      }
    }

    return { isValid: true, error: "" };
  };

  // Обробник зміни номера телефону
  const handlePhoneChange = (value: string) => {
    setClientInfo((prev) => ({ ...prev, clientPhoneNumber: value }));

    const validation = validatePhoneNumber(value);
    setIsPhoneValid(validation.isValid);
    setPhoneError(validation.error);
  };

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
    paymentMethodService
      .getAllActive()
      .then((methods) => setPaymentMethods(methods));
  }, []);

  const handleCloseToast = () => setShowToast(false);

  const handleDeliverySelectionChange = (keys: any) => {
    if (keys instanceof Set && keys.size > 0) {
      const selectedKey = Array.from(keys)[0] as string;
      setSelectedDeliveryType(selectedKey);
    }
  };

  const handlePaymentSelectionChange = (keys: any) => {
    if (keys instanceof Set && keys.size > 0) {
      const selectedKey = Array.from(keys)[0] as string;
      setSelectedPaymentMethod(selectedKey);
    }
  };

  const calculateTotal = () => {
    const deliveryPrice =
      deliveryTypes.find((d) => d.id === selectedDeliveryType)?.price || 0;
    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return itemsTotal + deliveryPrice;
  };

  const createOrder = async () => {
    const phoneValidation = validatePhoneNumber(
      clientInfo.clientPhoneNumber || ""
    );
    if (!phoneValidation.isValid) {
      setIsPhoneValid(false);
      setPhoneError(phoneValidation.error);
      alert("Будь ласка, введіть коректний номер телефону.");
      return;
    }

    if (
      !clientInfo.clientFullName ||
      !clientInfo.clientPhoneNumber ||
      !clientInfo.city ||
      !selectedDeliveryType ||
      !selectedPaymentMethod
    ) {
      alert(
        "Будь ласка, заповніть усі обов'язкові поля, включаючи доставку та оплату."
      );
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
          console.log(item);
          const knifeData = {
            ...item.productData,
            price: item.price,
          };
          console.log("knifedata:", knifeData);
          console.log("item.price: ", item.price);
          const createdKnife = await knifeService.create(knifeData);
          console.log(createdKnife);
          productId = createdKnife.id;
        } else {
          productId = item.productId;
        }
        orderItems.push({ productId, quantity: item.quantity });
      }

      const orderData: OrderDTO = {
        orderItems: orderItems,
        deliveryTypeId: selectedDeliveryType,
        paymentMethodId: selectedPaymentMethod,
        total: calculateTotal(),
        clientData: clientInfo,
        comment: comment || null,
      };

      const order = await orderService.create(orderData);
      console.log(order);
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

  const getPaymentMethodName = (method: PaymentMethod): string => {
    return method.names?.ua || method.name;
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
                <TableColumn>Ціна</TableColumn>
                <TableColumn>Сума</TableColumn>
                <TableColumn>Дія</TableColumn>
              </TableHeader>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={`${item.type}-${index}`}>
                    <TableCell>{getItemName(item)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
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
                value={clientInfo.clientFullName || ""}
                onChange={(e) =>
                  setClientInfo((prev) => ({
                    ...prev,
                    clientFullName: e.target.value,
                  }))
                }
              />
              <Input
                label="Номер телефону"
                required
                type="tel"
                value={clientInfo.clientPhoneNumber || ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                isInvalid={!isPhoneValid}
                errorMessage={phoneError}
                placeholder="+380XXXXXXXXX"
                color={!isPhoneValid ? "danger" : "default"}
              />
              <Input
                label="Email"
                type="email"
                required
                value={clientInfo.email || ""}
                onChange={(e) =>
                  setClientInfo((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                label="Країна"
                required
                value={clientInfo.countryForDelivery || ""}
                onChange={(e) =>
                  setClientInfo((prev) => ({
                    ...prev,
                    countryForDelivery: e.target.value,
                  }))
                }
              />
              <Input
                label="Місто"
                required
                value={clientInfo.city || ""}
                onChange={(e) =>
                  setClientInfo((prev) => ({ ...prev, city: e.target.value }))
                }
              />
              <Input
                label="Адреса (опціонально)"
                value={clientInfo.address || ""}
                onChange={(e) =>
                  setClientInfo((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
              />
              <Input
                label="Поштовий індекс (опціонально)"
                value={clientInfo.zipCode || ""}
                onChange={(e) =>
                  setClientInfo((prev) => ({
                    ...prev,
                    zipCode: e.target.value,
                  }))
                }
              />
              <Select
                label="Тип доставки"
                selectedKeys={
                  selectedDeliveryType
                    ? new Set([selectedDeliveryType])
                    : undefined
                }
                onSelectionChange={handleDeliverySelectionChange}
                required
              >
                {deliveryTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {`${type.name} - ₴${type.price.toFixed(2)}`}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Спосіб оплати"
                selectedKeys={
                  selectedPaymentMethod
                    ? new Set([selectedPaymentMethod])
                    : undefined
                }
                onSelectionChange={handlePaymentSelectionChange}
                required
              >
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {getPaymentMethodName(method)}
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
              disabled={isLoading || !isPhoneValid}
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
