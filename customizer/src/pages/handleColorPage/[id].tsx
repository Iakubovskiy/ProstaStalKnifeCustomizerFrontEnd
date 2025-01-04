"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import HandleColor from "@/app/Models/HandleColor";
import { useRouter } from "next/router";
import HandleColorService from "@/app/services/HandleColorService";
import "../../styles/globals.css";
import { Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
const initialHandleColorData: HandleColor = {
  id: 1,
  colorName: "",
  material: "",
  colorCode: "",
  materialUrl: "",
};

const HandleColorPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [color, setColor] = useState<string>(initialHandleColorData.colorCode);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [handleColor, setHandleColor] = useState<HandleColor>(
    initialHandleColorData
  );
  const [handleservice, setHandleservice] = useState<HandleColorService>(
    new HandleColorService()
  );
  const handleFileSelected = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  const handleObjectChange = (updatedData: HandleColor) => {
    setHandleColor(updatedData); // Оновлюємо об'єкт у стані
    console.log(handleColor);
  };
  const handleSave = async () => {
    console.log("Saving data:", handleColor, "Uploaded File:", file);

    if (file && handleColor) {
      var response;
      if (isCreating) {
        response = await handleservice.create(handleColor, file);
      } else {
        response = await handleservice.update(
          parseInt(id as string, 10),
          handleColor,
          file
        );
      }

      alert("Збережено");
    } else {
      alert("Оберіть файл та заповніть поля");
    }
  };
  useEffect(() => {
    const fetchHandleColor = async () => {
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
            const fetchedHandleColor = await handleservice.getById(numericId);
            setHandleColor(fetchedHandleColor);
            console.log("1");
            console.log(fetchedHandleColor.colorCode);
            console.log("1");
            setColor(fetchedHandleColor.colorCode);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/handleColorPage/0");
          }
        }
      }
      console.log(handleColor);
    };
    fetchHandleColor();
  }, [id]);
  const handleColorChange = (newColor: any) => {
    setColor(newColor); // Оновлюємо колір
    handleColor.colorCode = newColor;
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
          <h1 className="text-2xl text-black font-bold text-center mb-4">
            Кольори руків'я
          </h1>

          <div className="mb-6">
            <DragNDrop
              onFileSelected={handleFileSelected}
              validExtensions={[".jpg", "jpeg", ".png"]}
            />
          </div>
          <div className="mb-6">
            <h3 className="text-lg mb-4 font-semibold">Оберіть колір</h3>
            <ColorPicker value={color} onChange={handleColorChange} />
          </div>
          <div className="mb-6">
            <Characteristics
              data={handleColor}
              isReadOnly1={false}
              currentBladeCoatingColor={color}
              onChange={handleObjectChange}
              type="HandleColor"
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

export default HandleColorPage;
