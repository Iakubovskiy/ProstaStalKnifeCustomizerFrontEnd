"use client";
import React, { useEffect, useState } from "react";
import DeliveryType from "@/app/Models/DeliveryType";
import { useRouter } from "next/router";
import "../../styles/globals.css";
import {Input, Select, SelectItem, Spinner} from "@nextui-org/react";
import styles from "./eng.module.css";
import deliveryTypeService from "@/app/services/DeliveryTypeService";
const initialDeliveryTypeData: DeliveryType = {
  id: "",
  name: "",
  price: 0,
  comment: "",
  isActive: true,
};

const DeliveryTypePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [DeliveryType, setDeliveryType] = useState<DeliveryType>(
    initialDeliveryTypeData
  );
  const DeliveryTypeService = new deliveryTypeService();

  const handleSave = async () => {
    console.log("Saving data:", DeliveryType);

    if (DeliveryType) {
      if (isCreating) {
        await DeliveryTypeService.create(DeliveryType);
      } else {
        await DeliveryTypeService.update(
          id as string,
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
        if (id === "0") {
          setCreating(true);
          setLoading(false);
        } else {
          try {
            const fetchedDeliveryType = await DeliveryTypeService.getById(
              id as string
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

  const handleActiveChange = (value: string) => {
    const active = value === "true";
    setDeliveryType((prev) => ({
      ...prev,
      isActive: active,
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
          <h1 className="text-2xl font-bold text-center mb-4">Типи доставки</h1>
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
          <div className={styles.input}>
            <label
                htmlFor="isActive"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
              Активний
            </label>
            <Select
                id="isActive"
                selectedKeys={new Set([DeliveryType.isActive.toString()])}
                onSelectionChange={(keys) => handleActiveChange(Array.from(keys).join(""))}
                aria-label="Is Active"
                size="lg"
                style={{
                  width: "100%",
                }}
            >
              <SelectItem key="true">Active</SelectItem>
              <SelectItem key="false">Inactive</SelectItem>
            </Select>
          </div>
          <button
              onClick={handleSave}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-3"
          >
            Зберегти
          </button>
        </div>
      </div>
    );
  }
};

export default DeliveryTypePage;
