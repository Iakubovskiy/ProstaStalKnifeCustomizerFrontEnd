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
  id: "",
  color: "",
  material: "",
  colorCode: "",
  price: 0,
  engravingColorCode: "",
  isActive: true,
  colorMapUrl: "",
  normalMapUrl: "",
  roughnessMapUrl: "",
};

const SheathColorPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [color, setColor] = useState<string>(initialSheathColorData.colorCode);
  const [Engravingcolor, setEngravingcolor] = useState<string>(
      initialSheathColorData.engravingColorCode
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [colorMapFile, setColorMapFile] = useState<File | null>(null);
  const [normalMapFile, setNormalMapFile] = useState<File | null>(null);
  const [roughnessMapFile, setRoughnessMapFile] = useState<File | null>(null);
  const [SheathColor, setSheathColor] = useState<SheathColor>(
      initialSheathColorData
  );
  const handleservice = new SheathColorService();

  const handleColorMapSelected = (selectedFile: File | null) => {
    setColorMapFile(selectedFile);
  };
  const handleNormalMapSelected = (selectedFile: File | null) => {
    setNormalMapFile(selectedFile);
  };
  const handleRoughnessMapSelected = (selectedFile: File | null) => {
    setRoughnessMapFile(selectedFile);
  };

  const handleObjectChange = (updatedData: SheathColor) => {
    setSheathColor(updatedData);
    console.log(SheathColor);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedPrice = parseFloat(event.target.value);
    setSheathColor((prev) => ({ ...prev, price: isNaN(updatedPrice) ? 0 : updatedPrice }));
  };

  const handleSave = async () => {
    if (SheathColor) {
      if (isCreating) {
        await handleservice.create(SheathColor, colorMapFile, normalMapFile,roughnessMapFile);
      } else {
        await handleservice.update(
            id as string,
            SheathColor,
            colorMapFile,
            normalMapFile,
            roughnessMapFile
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
        if (id === "0") {
          setCreating(true);
          setLoading(false);
        } else {
          try {
            const fetchedsheathColor = await handleservice.getById(id as string);
            setSheathColor(fetchedsheathColor);
            setColor(fetchedsheathColor.colorCode);
            setEngravingcolor(fetchedsheathColor.engravingColorCode);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/sheathColorPage/0");
          }
        }
      }
    };
    fetchSheathColor();
  }, [id]);

  const SheathColorChange = (newColor: string) => {
    setColor(newColor);
    SheathColor.colorCode = newColor;
  };

  const SheathEngravingColorChange = (newColor: string) => {
    setEngravingcolor(newColor);
    SheathColor.engravingColorCode = newColor;
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
            <h1 className="text-2xl text-black font-bold text-center mb-4">Піхви</h1>

            <div className="mb-6">
              <DragNDrop
                  onFileSelected={handleColorMapSelected}
                  validExtensions={[".jpg", "jpeg", ".png"]}
              />
            </div>
            <div className="mb-6">
              <DragNDrop
                  onFileSelected={handleNormalMapSelected}
                  validExtensions={[".jpg", "jpeg", ".png"]}
              />
            </div>
            <div className="mb-6">
              <DragNDrop
                  onFileSelected={handleRoughnessMapSelected}
                  validExtensions={[".jpg", "jpeg", ".png"]}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Оберіть кольори</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h4 className="text-md mb-2 font-medium text-black">Колір піхв</h4>
                  <ColorPicker value={color} onChange={SheathColorChange}/>
                </div>
                <div className="flex-1">
                  <h4 className="text-md mb-2 font-medium text-black">Колір гравіювання</h4>
                  <ColorPicker
                      value={Engravingcolor}
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

            <div className="mb-6">
              <label className="block text-md font-medium text-black mb-2" htmlFor="price">
                Ціна
              </label>
              <input
                  type="number"
                  id="price"
                  value={SheathColor.price}
                  onChange={handlePriceChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring text-black focus:ring-blue-200"
                  placeholder="Введіть ціну"
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
