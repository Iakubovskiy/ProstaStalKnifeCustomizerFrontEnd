"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import SheathColor from "@/app/Models/SheathColor";
import { useRouter } from "next/router";
import SheathColorService from "@/app/services/SheathColorService";
import "../../styles/globals.css";
import { Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
const initialSheathColorData: SheathColor = {
  id: 1,
  colorName: "",
  material: "",
  colorCode: "",
  materialUrl: "",
  price: 0,
  EngravingColorCode: "",
};

const SheathColorPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [color, setColor] = useState<string>(initialSheathColorData.colorCode);
  const [Engravingcolor, setEngravingcolor] = useState<string>(
    initialSheathColorData.EngravingColorCode
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [SheathColor, setSheathColor] = useState<SheathColor>(
    initialSheathColorData
  );
  const [handleservice, setHandleservice] = useState<SheathColorService>(
    new SheathColorService()
  );
  const handleFileSelected = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  const handleObjectChange = (updatedData: SheathColor) => {
    setSheathColor(updatedData); // Оновлюємо об'єкт у стані
    console.log(SheathColor);
  };
  const handleSave = async () => {
    console.log("Saving data:", SheathColor, "Uploaded File:", file);

    if (file && SheathColor) {
      var response;
      if (isCreating) {
        response = await handleservice.create(SheathColor, file);
      } else {
        response = await handleservice.update(
          parseInt(id as string, 10),
          SheathColor,
          file
        );
      }

      alert("Збережено");
    } else {
      alert("Оберіть файл та заповніть поля");
    }
  };
  useEffect(() => {
    const fetchSheathColor = async () => {
      if (id) {
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
            const fetchedsheathColor = await handleservice.getById(numericId);
            setSheathColor(fetchedsheathColor);
            console.log("1");
            console.log(fetchedsheathColor.colorCode);
            console.log("1");
            setColor(fetchedsheathColor.colorCode);
            setEngravingcolor(fetchedsheathColor.EngravingColorCode);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/sheathColorPage/0");
          }
        }
      }
      console.log(SheathColor);
    };
    fetchSheathColor();
  }, [id]);
  const SheathColorChange = (newColor: any) => {
    setColor(newColor);
    SheathColor.colorCode = newColor;
  };
  const SheathEngravingColorChange = (newColor: any) => {
    setEngravingcolor(newColor);
    SheathColor.colorCode = newColor;
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <Spinner size="lg" color="warning" label="Завантаження" />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Піхви</h1>

          <div className="mb-6">
            <DragNDrop onFileSelected={handleFileSelected} />
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Оберіть кольори</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h4 className="text-md font-medium">Колір піхв</h4>
                <ColorPicker value={color} onChange={SheathColorChange} />
              </div>
              <div className="flex-1">
                <h4 className="text-md font-medium">Колір гравіювання</h4>
                <ColorPicker
                  value={color}
                  onChange={SheathEngravingColorChange}
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <Characteristics
              data={SheathColor}
              isReadOnly1={false}
              currentBladeCoatingColor={color}
              onChange={handleObjectChange}
              type="SheathColor"
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

export default SheathColorPage;
