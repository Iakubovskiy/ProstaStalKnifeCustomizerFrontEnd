"use client";
import React, { useEffect, useState } from "react";
import EngravingPrice from "@/app/Models/EngravingPrice";
import { useRouter } from "next/router";
import EngravingPriceService from "@/app/services/EngravingPriceService";
import "../../styles/globals.css";
import { Input, Spinner } from "@nextui-org/react";
import styles from "./eng.module.css";
const initialEngravingPriceData: EngravingPrice = {
  id: "",
  price: 0,
};

const EngravingPricePage = () => {
  const router = useRouter();
  const guid = "01978afc-4a56-7ee5-be83-a7cf6950ac94";
  const [isLoading, setLoading] = useState<boolean>(true);

  const [EngravingPrice, setEngravingPrice] = useState<EngravingPrice>(
    initialEngravingPriceData
  );
  const EngravingService = new EngravingPriceService();
  const handleSave = async () => {
    console.log("Saving data:", EngravingPrice);

    if (EngravingPrice) {
      await EngravingService.update(guid as string, EngravingPrice);

      alert("Збережено");
    } else {
      alert("Оберіть файл та заповніть поля");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    setEngravingPrice((prev) => ({
      ...prev,
      price: isNaN(newPrice) ? 0 : newPrice,
    }));
  };
  useEffect(() => {
    const fetchEngravingPrice = async () => {
      if (guid) {
        try {
          const fetchedEngravingPrice = await EngravingService.get();
          setEngravingPrice(fetchedEngravingPrice);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching sheath color:", error);
          alert("Сталася помилка під час отримання даних. Перевірте ID.");
          router.push("/EngravingPricePage/" + guid);
        }
      }
      console.log(EngravingPrice);
    };
    fetchEngravingPrice();
  }, [guid]);
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
            Ціна гравіювання
          </h1>
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
              defaultValue={EngravingPrice.price.toString()}
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

export default EngravingPricePage;
