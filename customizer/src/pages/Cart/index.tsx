"use client";
import React, { useState, useEffect } from "react";
import DeliveryType from "@/app/Models/DeliveryType";
import OrderService from "@/app/services/OrderService";
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import KnifeService from "@/app/services/KnifeService";
import PaymentMethodService from "@/app/services/PaymentMethodService";
import { PaymentMethod } from "@/app/Interfaces/PaymentMethod";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Image,
} from "@nextui-org/react";
import "../../styles/globals.css";
import Toast from "../../app/components/Toast/Toast";
import { CartItem } from "@/app/Interfaces/CartItem";
import { OrderDTO } from "@/app/DTOs/OrderDTO";
import { OrderItemDTO } from "@/app/DTOs/OrderItemDTO";
import { ClientData } from "@/app/DTOs/ClientData";
import './cart-style.css';
import CartInput from '@/app/components/Cart/CartInput/input';
import CartSelect from '@/app/components/Cart/Select/Select';
import ProductInCart from '@/app/components/Cart/ProductInCart/ProductInCart'

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

  const [phoneError, setPhoneError] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(true);

  const orderService = new OrderService();
  const knifeService = new KnifeService();
  const deliveryTypeService = new DeliveryTypeService();
  const paymentMethodService = new PaymentMethodService();

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const validatePhoneNumber = (
    phone: string
  ): { isValid: boolean; error: string } => {
    if (!phone.trim()) {
      return { isValid: false, error: "Номер телефону обов'язковий" };
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    if (!/^[\+]?[0-9]+$/.test(cleanPhone)) {
      setClientInfo((prev) => ({
        ...prev,
        clientPhoneNumber: (cleanPhone.replace(/(?!^)\+/g, "")).replace(/[^+\d]/g, ""),
      }));
      return {
        isValid: false,
        error: "Номер може містити тільки цифри, +, пробіли, дефіси та дужки",
      };
    }

    const digitsOnly = cleanPhone.replace(/^\+/, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return {
        isValid: false,
        error: "Номер повинен містити від 10 до 15 цифр",
      };
    }

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

  const handlePhoneChange = (value: string) => {
    setClientInfo((prev) => ({
      ...prev,
      clientPhoneNumber: value,
    }));
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

  const handleDeliverySelectionChange = (value:string) => {
    setSelectedDeliveryType(value);
  };

  const handlePaymentSelectionChange = (value: string) => {
    setSelectedPaymentMethod(value);
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

  const getDeliveryTypePrice = () => {
    const deliveryType = deliveryTypes.find(
      (type) => type.id === selectedDeliveryType
    );
    if (deliveryType) {
      return deliveryType.price.toFixed(2);
    }
    return "0.00";
  }

  const getPaymentMethodCommision = () => {
    const paymentMethod = paymentMethods.find(
        (method) => method.id === selectedPaymentMethod
    );
    if (paymentMethod) {
      return paymentMethod.description;
    }
    return "0.00";
  }

  return (
    <div className="min-h-screen p-2 bg-gray-50">
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
      />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Оформлення замовлення</h1>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-40 ">
          <div>
            {cartItems.length > 0 && (
                <>
                  <h3 className="section-label">Дані отримувача</h3>
                  <div className="container data-container">
                    <CartInput
                        type={'text'}
                        name={'fullName'}
                        labelText={"ПІБ"}
                        placeholder={"ПІБ"}
                        value={clientInfo.clientFullName || ""}
                        onChange={(name) =>
                            setClientInfo((prev) => ({
                              ...prev,
                              clientFullName: name,
                            }))
                        }
                    />
                    <CartInput
                        type={'text'} name={'phoneNumber'}
                        labelText={"Номер телефону"}
                        placeholder={"+380XXXXXXXXX"}
                        value={clientInfo.clientPhoneNumber || ""}
                        onChange={handlePhoneChange}
                    />
                    <CartInput
                        type={'email'}
                        name={'email'}
                        labelText={"Email"}
                        placeholder={"Email"}
                        value={clientInfo.email || ""}
                        onChange={(email) =>
                            setClientInfo((prev) => ({
                              ...prev,
                              email: email,
                            }))
                        }
                    />
                    <CartInput
                        type={'text'}
                        name={'country'}
                        labelText={"Країна"}
                        placeholder={"Країна"}
                        value={clientInfo.countryForDelivery || ""}
                        onChange={(country) =>
                            setClientInfo((prev) => ({
                              ...prev,
                              countryForDelivery: country,
                            }))
                        }
                    />
                    <CartInput
                        type={'text'}
                        name={'city'}
                        labelText={"Місто"}
                        placeholder={"Місто"}
                        value={clientInfo.city || ""}
                        onChange={(city) =>
                            setClientInfo((prev) => ({
                              ...prev,
                              city: city,
                            }))
                        }
                    />
                    {/*<CartInput type={'text'} name={'fullName'} labelText={"Месенджер"} placeholder={"Месенджер"}/>*/}
                  </div>
                  <h3 className="section-label">Доставка</h3>
                  <div className="container data-container">
                    <CartSelect
                      name='deliveryType'
                      labelText="Метод доставки"
                      optionKeys={deliveryTypes.map((type) => type.id)}
                      options={deliveryTypes.map((type) =>
                            `${type.name} - ₴${type.price.toFixed(2)}`
                      )}
                      value={selectedDeliveryType}
                      onChange={handleDeliverySelectionChange}
                    />

                    <CartInput
                        name={"address"}
                        labelText={"Адреса"}
                        type={"text"}
                        placeholder={"Адреса"}
                        value={clientInfo.address || ""}
                        onChange={(value: string)=> {
                          setClientInfo((prev) => ({
                            ...prev,
                            address: value,
                          }))
                        }}
                    />
                    <CartInput
                        name={"zip-code"}
                        labelText={"Zip-code"}
                        type={"text"}
                        placeholder={"Zip-code"}
                        value={clientInfo.zipCode || ""}
                        onChange={(value: string)=> {
                          setClientInfo((prev) => ({
                            ...prev,
                            zipCode: value,
                          }))
                        }}
                    />
                  </div>
                  <h3 className="section-label">Оплата</h3>
                  <div className="container data-container">
                    <CartSelect
                        name='paymentMethod'
                        labelText="Спосіб оплати"
                        optionKeys={paymentMethods.map((method) => method.id)}
                        options={paymentMethods.map((method) =>
                            `${method.name} - ${method.description}`
                        )}
                        value={selectedPaymentMethod}
                        onChange={handlePaymentSelectionChange}
                    />
                  </div>
                </>
            )}
          </div>

          <div>
            <h3 className="section-label">Перелік товарів</h3>
            <div className="product-data-container">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                      <ProductInCart
                          key = {index}
                          index={index}
                          name={getItemName(item)}
                          pictureUrl={item.photoUrl}
                          price={item.price}
                          quantity={item.quantity}
                          removeFromCart={handleRemoveItem}
                          addQuantity={() => {
                            setCartItems((prev) => {
                              const updatedItems = [...prev];
                              updatedItems[index].quantity += 1;
                              localStorage.setItem(
                                  "cart",
                                  JSON.stringify(cartItems)
                              );
                              return updatedItems;
                            });
                          }}
                          reduceQuantity={() => {
                            if (item.quantity > 1) {
                              setCartItems((prev) => {
                                const updatedItems = [...prev];
                                updatedItems[index].quantity -= 1;
                                localStorage.setItem(
                                    "cart",
                                    JSON.stringify(cartItems)
                                );
                                return updatedItems;
                              });
                            }
                          }}
                      />
                  ))}
                  <div className="additional-data">
                    <p className="additional-data-text">Вартість доставки: {getDeliveryTypePrice()} грн</p>
                  </div>
                  <div className="additional-data">
                    <p className="additional-data-text">Комісія за оплату: {getPaymentMethodCommision()} грн</p>
                  </div>
                  <div className="total-section">
                    <p className="total-text">Загальна вартість: {calculateTotal()} грн</p>
                    <button onClick={() => createOrder()} className="create-order-button">Оформити замовлення</button>
                  </div>
                </>
              ) : (
                <p>Ваш кошик порожній</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartAndOrderPage;
