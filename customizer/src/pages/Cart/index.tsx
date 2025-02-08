import React, { useState, useEffect } from "react";
import Knife from "@/app/Models/Knife";
import DeliveryType from "@/app/Models/DeliveryType";
import OrderService from "@/app/services/OrderService";
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import Engraving from "../../app/Models/Engraving";
import EngravingPrice from "../../app/Models/EngravingPrice";
import EngravingService from "../../app/services/EngravingService";
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
import CreateOrderDTO from "@/app/DTO/CreateOrderDTO";
import Product from "@/app/Models/Product";
import Fastening from "@/app/Models/Fastening";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import BladeShape from "@/app/Models/BladeShape";
import HandleColor from "@/app/Models/HandleColor";
import SheathColor from "@/app/Models/SheathColor";

interface ProductInOrder{
  product: Product,
  quantity: number;
}

interface SerializedProduct {
  id: string;
  isActive: boolean;
}

// Розширений інтерфейс для серіалізованого Knife
interface SerializedKnife extends SerializedProduct {
  shape: BladeShape;
  bladeCoatingColor: BladeCoatingColor;
  handleColor: HandleColor;
  sheathColor: SheathColor;
  fastening: SerializedFastening | null;
  engravings: Engraving[] | null;
}

// Інтерфейс для серіалізованого Fastening
interface SerializedFastening extends SerializedProduct {
  name: string;
  color: string;
  colorCode: string;
  price: number;
  material: string;
  modelUrl: string;
}

const reconstructProduct = (plainObject: SerializedProduct | SerializedKnife | SerializedFastening): Product => {
  if ('shape' in plainObject && 'bladeCoatingColor' in plainObject) {
    const knifeObj = plainObject as SerializedKnife;
    return new Knife(
        knifeObj.id,
        knifeObj.shape,
        knifeObj.handleColor,
        knifeObj.sheathColor,
        knifeObj.isActive,
        knifeObj.bladeCoatingColor,
        knifeObj.fastening ? new Fastening(
            knifeObj.fastening.name,
            knifeObj.fastening.color,
            knifeObj.fastening.colorCode,
            knifeObj.fastening.price,
            knifeObj.fastening.material,
            knifeObj.fastening.modelUrl,
            knifeObj.fastening.id,
            knifeObj.fastening.isActive
        ) : null,
        knifeObj.engravings
    );
  }

  else if ('name' in plainObject && 'colorCode' in plainObject) {
    const fasteningObj = plainObject as SerializedFastening;
    return new Fastening(
        fasteningObj.name,
        fasteningObj.color,
        fasteningObj.colorCode,
        fasteningObj.price,
        fasteningObj.material,
        fasteningObj.modelUrl,
        fasteningObj.id,
        fasteningObj.isActive
    );
  }
  return new Product(plainObject.id, plainObject.isActive);
};

const CartAndOrderPage = () => {
  const [cartItems, setCartItems] = useState<ProductInOrder[]>([]);
  const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
  const [clientInfo, setClientInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    country: "",
    city: "",
  });
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<
    string | null
  >(null);
  const [comment, setComment] = useState<string>("");
  const engravingPriceService = new EngravingPriceService();
  const [engravingPrice, setEngravingPrice] = useState<number>(0);
  const orderService = new OrderService();
  const deliveryTypeService = new DeliveryTypeService();

  const createEngravings = async (knife: Knife): Promise<Engraving[]> => {
    const engravingService = new EngravingService();
    const createdEngravings: Engraving[] = [];

    if (knife.engravings && knife.engravings.length > 0) {
      for (const engraving of knife.engravings) {
        let file: File | null = null;

        if (engraving.pictureUrl) {
          file = await blobUrlToFile(engraving.pictureUrl);
        }

        const createdEngraving = await engravingService.create(engraving, file);
        createdEngravings.push(createdEngraving);
      }
    }

    return createdEngravings;
  };
  const blobUrlToFile = async (
    blobUrl: string,
    fileName: string = "image.png"
  ): Promise<File> => {
    try {
      // Отримуємо Blob з URL
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error("Error converting blob URL to file:", error);
      throw error;
    }
  };
  const createKnivesInBackend = async (
    cartItems: Knife[]
  ): Promise<Knife[]> => {
    const knifeService = new KnifeService();
    const createdKnives: Knife[] = [];

    try {
      for (const knife of cartItems) {
        const createdEngravings = await createEngravings(knife);
        if (knife.fastening?.id == ""){
          knife.fastening = null;
        }
        const knifeWithNewEngravings = {
          ...knife,
          engravings: createdEngravings,
        };
        console.log(knifeWithNewEngravings);

        const createdKnife = await knifeService.create(knifeWithNewEngravings);
        createdKnives.push(createdKnife);
      }
      return createdKnives;
    } catch (error) {
      console.error("Failed to create knives:", error);
      throw new Error("Failed to create knives in backend");
    }
  };
  useEffect(() => {
    const handleGet = async () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Reconstruct class instances for each item in cart
        const reconstructedCart = parsedCart.map((item: ProductInOrder) => ({
          product: reconstructProduct(item.product),
          quantity: item.quantity,
        }));
        setCartItems(reconstructedCart);
      }

      const engpr: EngravingPrice[] = await engravingPriceService.getAll();
      if (engpr.length > 0) {
        setEngravingPrice(engpr[0].price);
      }

      deliveryTypeService.getAllActive().then((types) => setDeliveryTypes(types));
    };
    handleGet();
  }, []);
  const handleSelectionChange = (key: string | number | undefined) => {
    if (key) {
      setSelectedDeliveryType(key.toString());
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

    try {
      cartItems.sort((a,b)=>{
        if(a.product instanceof Knife && !(b.product instanceof Knife))
          return -1;
        else if(!(a.product instanceof Knife) && b.product instanceof Knife)
          return 1;
        return 0;
      });

      const knives:Knife[] = [];
      const lastKnifeIndex = cartItems.findLastIndex(item => item.product instanceof Knife);
      for(let i = 0; i <= lastKnifeIndex; i++) {
          knives.push(cartItems[i].product as Knife);
      }
      const createdKnives = await createKnivesInBackend(knives);
      const remainingProducts = cartItems.slice(lastKnifeIndex + 1).map(item => item.product.id);
      const allProductIds = [...createdKnives.map(knife => knife.id), ...remainingProducts];
      const quantities = cartItems.map(item=>item.quantity)

      const total = createdKnives.reduce((sum, item) => {
        let uniqueSides;
        if (item.engravings != null) {
          const uniqueSides1 = new Set(
            item.engravings.map((engraving) => engraving.side)
          );
          uniqueSides = uniqueSides1.size;
        } else {
          uniqueSides = 0;
        }
        const engraving = engravingPrice * uniqueSides;
        const itemTotal =
          (item.shape.price +
            engraving +
            (item.sheathColor.price || 0) +
            (item.fastening?.price || 0));
        return sum + itemTotal;
      }, 0);

      const orderData: CreateOrderDTO = {
        number: `ORD-${Date.now()}`,
        total,
        products: allProductIds,
        productQuantities: quantities,
        deliveryTypeId: selectedDeliveryType,
        clientFullName: clientInfo.fullName,
        clientPhoneNumber: clientInfo.phoneNumber,
        countryForDelivery: clientInfo.country,
        city: clientInfo.city,
        email: clientInfo.email,
        comment: comment || null,
        status: "Активний",
      };
      console.log(orderData);
      await orderService.create(orderData);
      alert("Замовлення успішно створено!");
      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to process order: ", error);
      alert("Помилка при створенні замовлення.");
    }
  };
  console.log(cartItems);
  for(const item of cartItems) {
    console.log(item.product.constructor.name);
  }
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
                  <TableRow key={item.product.id}>
                    <TableCell>{item.product instanceof Knife
                        ? item.product.shape.name
                        : item.product instanceof Fastening
                            ? item.product.name
                            : "Без назви"}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity.toString()}
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
                      ₴
                      {(item.product instanceof Knife?
                          item.product.shape.price + item.product.bladeCoatingColor.price + item.product.sheathColor.price
                          + (item.product.fastening?.price ?? 0) +
                          (item.product.engravings?.length ?
                              new Set(item.product.engravings.map(engraving => engraving.side)).size * engravingPrice
                              : 0)
                          : item.product instanceof Fastening?
                              item.product.price
                              :0) * item.quantity
                      }
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
                setSelectedDeliveryType(selectedId.toString());
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
