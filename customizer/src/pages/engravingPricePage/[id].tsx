"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import EngravingPrice from "@/app/Models/EngravingPrice";
import { useRouter } from "next/router";
import EngravingPriceService from "@/app/services/EngravingPriceService";
import "../../styles/globals.css";
import { Input, Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
const initialEngravingPriceData: EngravingPrice = {
  id: 1,
  price: 0,
};

const EngravingPricePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);

  const [EngravingPrice, setEngravingPrice] = useState<EngravingPrice>(
    initialEngravingPriceData
  );
  const [Engravingservice, setEngravingservice] =
    useState<EngravingPriceService>(new EngravingPriceService());
  const handleSave = async () => {
    console.log("Saving data:", EngravingPrice);

    if (EngravingPrice) {
      var response;

      response = await Engravingservice.update(
        parseInt(id as string, 10),
        EngravingPrice
      );

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
      if (id) {
        // Перетворюємо id на число
        const numericId = parseInt(id as string, 10);

        if (isNaN(numericId)) {
          console.error("ID is not a valid number");
          return;
        } else {
          try {
            const fetchedEngravingPrice = await Engravingservice.getById(
              numericId
            );
            setEngravingPrice(fetchedEngravingPrice);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/EngravingPricePage/" + id);
          }
        }
      }
      console.log(EngravingPrice);
    };
    fetchEngravingPrice();
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
            Ціна гравіювання
          </h1>
          <div className="mb-6">
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
