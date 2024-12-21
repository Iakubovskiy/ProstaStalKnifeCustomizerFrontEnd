"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import OrderStatuses from "@/app/Models/OrderStatuses";
import { useRouter } from "next/router";
import OrderStatusesService from "@/app/services/OrderStatusesService";
import "../../styles/globals.css";
import { Input, Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
import styles from "./eng.module.css";
const initialOrderStatusesData: OrderStatuses = {
  id: 0,
  status: "",
};

const OrderStatusesPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [OrderStatuses, setOrderStatuses] = useState<OrderStatuses>(
    initialOrderStatusesData
  );
  const [Engravingservice, setEngravingservice] =
    useState<OrderStatusesService>(new OrderStatusesService());
  const handleSave = async () => {
    console.log("Saving data:", OrderStatuses);

    if (OrderStatuses) {
      var response;
      if (parseInt(id as string, 10) == 0) {
        response = await Engravingservice.create(OrderStatuses);
      }
      response = await Engravingservice.update(
        parseInt(id as string, 10),
        OrderStatuses
      );

      alert("Збережено");
    } else {
      alert("Заповніть поля");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    setOrderStatuses((prev) => ({
      ...prev,
      price: isNaN(newPrice) ? 0 : newPrice,
    }));
  };
  useEffect(() => {
    const fetchOrderStatuses = async () => {
      if (id) {
        // Перетворюємо id на число
        const numericId = parseInt(id as string, 10);

        if (isNaN(numericId)) {
          console.error("ID is not a valid number");
          return;
        }
        if (numericId == 0) {
          setCreating(true);
          setLoading(false);
        } else {
          try {
            const fetchedOrderStatuses = await Engravingservice.getById(
              numericId
            );
            setOrderStatuses(fetchedOrderStatuses);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/OrderStatusesPage/" + id);
          }
        }
      }
      console.log(OrderStatuses);
    };
    fetchOrderStatuses();
  }, [id]);
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <Spinner
          size="lg"
          color="warning"
          label="Loading handle color data..."
        />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Статуси замовлення
          </h1>
          <div className={styles.input}>
            <label
              htmlFor="OrderStatuses"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Статус
            </label>
            <Input
              id="OrderStatuses"
              type="text"
              defaultValue={OrderStatuses.status}
              onChange={handlePriceChange}
              aria-label="Engraving Status"
              placeholder="Введіть статус"
              size="lg"
              style={{
                width: "100%",
              }}
            />
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Зберегти
          </button>
        </div>
      </div>
    );
  }
};

export default OrderStatusesPage;
