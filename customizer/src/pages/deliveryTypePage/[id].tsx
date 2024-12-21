"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import DeliveryType from "@/app/Models/DeliveryType";
import { useRouter } from "next/router";
import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import "../../styles/globals.css";
import { Input, Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
import styles from "./eng.module.css";
const initialDeliveryTypeData: DeliveryType = {
  id: 1,
  name: "",
  price: 0,
  comment: "",
};

const DeliveryTypePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [DeliveryType, setDeliveryType] = useState<DeliveryType>(
    initialDeliveryTypeData
  );
  const [DeliveryTypeservice, setDeliveryTypeservice] =
    useState<DeliveryTypeService>(new DeliveryTypeService());

  const handleSave = async () => {
    console.log("Saving data:", DeliveryType);

    if (DeliveryType) {
      var response;
      if (isCreating) {
        response = await DeliveryTypeservice.create(DeliveryType);
      } else {
        response = await DeliveryTypeservice.update(
          parseInt(id as string, 10),
          DeliveryType
        );
      }

      alert("Збережено");
    } else {
      alert("Заповніть поля");
    }
  };
  useEffect(() => {
    const fetchDeliveryType = async () => {
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
            const fetchedDeliveryType = await DeliveryTypeservice.getById(
              numericId
            );
            setDeliveryType(fetchedDeliveryType);
            if (!fetchedDeliveryType.comment) {
              fetchedDeliveryType.comment = "";
            }
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/DeliveryTypePage/0");
          }
        }
      }
      console.log(DeliveryType);
    };
    fetchDeliveryType();
  }, [id]);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    setDeliveryType((prev) => ({
      ...prev,
      price: isNaN(newPrice) ? 0 : newPrice,
    }));
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDeliveryType((prev) => ({
      ...prev,
      name: newName,
    }));
  };
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newComment = e.target.value;
    setDeliveryType((prev) => ({
      ...prev,
      comment: newComment,
    }));
  };
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
            Кольори руків'я
          </h1>
          <div className={styles.input}>
            <label
              htmlFor="engravingPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Назва
            </label>
            <Input
              id="engravingPrice"
              defaultValue={DeliveryType.name}
              onChange={handleNameChange}
              aria-label="Engraving Price"
              placeholder="Введіть назву"
              size="lg"
              style={{
                width: "100%",
              }}
            />
          </div>
          <div className={styles.input}>
            <label
              htmlFor="engravingPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ціна
            </label>
            <Input
              id="engravingPrice"
              type="number"
              defaultValue={DeliveryType.price.toString()}
              onChange={handlePriceChange}
              aria-label="Engraving Price"
              placeholder="Введіть ціну"
              size="lg"
              min={0}
              step={0.01}
              style={{
                width: "100%",
              }}
            />
          </div>
          <div className={styles.input}>
            <label
              htmlFor="engravingPrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Коментар
            </label>
            <Input
              id="engravingPrice"
              defaultValue={DeliveryType.comment || ""}
              onChange={handleCommentChange}
              aria-label="Engraving Price"
              placeholder="Введіть Коментар"
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

export default DeliveryTypePage;
