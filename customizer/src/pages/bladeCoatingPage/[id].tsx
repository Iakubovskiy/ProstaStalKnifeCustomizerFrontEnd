"use client";
import React, { useState, useEffect } from "react";
import BladeCoatingColorComponent from "@/app/components/BladeCoatingColorPicker/BladeCoatingColorPicker";
import BladeCoating from "@/app/Models/BladeCoating";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import {
  Spinner,
  Input,
  InputProps,
  InternalForwardRefRenderFunction,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import BladeCoatingService from "@/app/services/BladeCoatingService";
import "../../styles/globals.css";

const initialBladeCoating: BladeCoating = {
  id: 0,
  name: "",
  price: 0,
  materialUrl: "",
  colors: [],
};
const BladeCoatingPage = () => {
  const [bladeCoating, setBladeCoating] =
    useState<BladeCoating>(initialBladeCoating);
  const [bladecoatingservice, setbladecoatingservice] =
    useState<BladeCoatingService>(new BladeCoatingService());
  const [isCreating, setCreating] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchBladeCoating = async () => {
      if (id) {
        const numericId = parseInt(id as string, 10);
        if (isNaN(numericId)) {
          alert("Invalid ID");
          return;
        }
        if (numericId === 0) {
          setCreating(true);
          setLoading(false);
        } else {
          try {
            const fetchedData: BladeCoating = await bladecoatingservice.getById(
              numericId
            );
            setBladeCoating(fetchedData);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching blade coating:", error);
          }
        }
      }
    };

    fetchBladeCoating();
  }, [id]);

  const handleAddColor = () => {
    const newColor: BladeCoatingColor = {
      id: bladeCoating.colors.length + 1,
      color: "",
      colorCode: "#ffffff",
      engravingColorCode: "#000000",
    };
    setBladeCoating({
      ...bladeCoating,
      colors: [...bladeCoating.colors, newColor],
    });
  };

  const handleRemoveColor = (id: number) => {
    setBladeCoating({
      ...bladeCoating,
      colors: bladeCoating.colors.filter((color) => color.id !== id),
    });
  };

  const handleColorChange = (updatedColor: BladeCoatingColor) => {
    setBladeCoating({
      ...bladeCoating,
      colors: bladeCoating.colors.map((color) =>
        color.id === updatedColor.id ? updatedColor : color
      ),
    });
  };

  const handleSave = async () => {
    var response;
    const numericId = parseInt(id as string, 10);

    if (file) {
      if (isCreating) {
        response = await bladecoatingservice.create(bladeCoating, file);

        alert("Створено");
      } else {
        response = await bladecoatingservice.update(
          numericId,
          bladeCoating,
          file
        );

        alert("Оновлено");
      }
    } else {
      alert("Оберіть файл");
    }
  };

  const handleFileSelected = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner
          size="lg"
          color="warning"
          label="Loading blade coating data..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 bg-gray-200">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isCreating ? "Create Blade Coating" : "Edit Blade Coating"}
        </h1>
        <div className="mb-6">
          <DragNDrop
            onFileSelected={handleFileSelected}
            validExtensions={[".jpg", "jpeg", ".png"]}
            fileUrl={!isCreating ? bladeCoating.materialUrl : undefined}
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-4">
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип покриття
                </label>
                <Input
                  value={bladeCoating.name}
                  onChange={(e) =>
                    setBladeCoating({ ...bladeCoating, name: e.target.value })
                  }
                  variant="bordered"
                  placeholder="Тип"
                  classNames={{
                    input: [
                      "text-black",
                      "placeholder:text-gray-400",
                      "px-4",
                      "py-2",
                      "rounded-md",
                    ],
                  }}
                  aria-label="Blade Coating Type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ціна
                </label>
                <Input
                  defaultValue={bladeCoating.price.toString()}
                  type="number"
                  onChange={(e) =>
                    setBladeCoating({
                      ...bladeCoating,
                      price: parseFloat(e.target.value),
                    })
                  }
                  classNames={{
                    input: [
                      "text-black",
                      "placeholder:text-gray-400",
                      "px-4",
                      "py-2",
                      "rounded-md",
                    ],
                  }}
                  placeholder="Price"
                  aria-label="Blade Coating Price"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-bold">Кольори</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
            {bladeCoating.colors.map((color) => (
              <div key={color.id} className="relative">
                <BladeCoatingColorComponent
                  value={color}
                  isReadOnly1={false}
                  onChange={handleColorChange}
                />
                <button
                  onClick={() => handleRemoveColor(color.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleAddColor}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Додати
          </button>
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
};

export default BladeCoatingPage;
