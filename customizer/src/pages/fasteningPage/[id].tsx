"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import Fastening from "@/app/Models/Fastening";
import { useRouter } from "next/router";
import FasteningService from "@/app/services/FasteningService";
import "../../styles/globals.css";
import { Input, Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
import styles from "./fasteningPage.module.css";
const initialFasteningData: Fastening = {
  id: 1,
  name: "",
  material: "",
  color: "",
  colorCode: "#000000",
  modelUrl: "1",
  price: 0,
};

const FasteningPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [color, setColor] = useState<string>(initialFasteningData.colorCode);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [fastening, setFastening] = useState<Fastening>(initialFasteningData);
  const [fasteningservice, setFasteningservice] = useState<FasteningService>(
    new FasteningService()
  );
  const fasteningFileSelected = (selectedFile: File | null) => {
    setFile(selectedFile);
  };
  const fasteningObjectChange = (updatedData: Fastening) => {
    setFastening(updatedData);
    console.log(fastening);
  };
  const fasteningSave = async () => {
    console.log("Saving data:", fastening, "Uploaded File:", file);

    if (file && fastening) {
      var response;
      if (isCreating) {
        response = await fasteningservice.create(fastening, file);
      } else {
        response = await fasteningservice.update(
          parseInt(id as string, 10),
          fastening,
          file
        );
      }

      alert("Збережено");
    } else if (fastening && !isCreating) {
      console.log("updating...");
      response = await fasteningservice.update(
        parseInt(id as string, 10),
        fastening,
        file
      );
      alert("Збережено");
    } else {
      alert("Оберіть файл та заповніть поля");
    }
  };
  useEffect(() => {
    const fetchFastening = async () => {
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
            const fetchedFastening = await fasteningservice.getById(numericId);
            setFastening(fetchedFastening);
            console.log("1");
            console.log(fetchedFastening.colorCode);
            console.log("1");
            setColor(fetchedFastening.colorCode);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching sheath color:", error);
            alert("Сталася помилка під час отримання даних. Перевірте ID.");
            router.push("/fasteningPage/0");
          }
        }
      }
      console.log(fastening);
    };
    fetchFastening();
  }, [id]);
  const fasteningChange = (newColor: any) => {
    setColor(newColor);
    fastening.colorCode = newColor;
  };
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <Spinner size="lg" color="warning" label="Loading fastening data..." />
      </div>
    );
  } else {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4 text-black">
            Кріплення
          </h1>

          <div className="mb-6">
            <DragNDrop
              onFileSelected={fasteningFileSelected}
              validExtensions={[".glb", ".gltf"]}
            />
          </div>
          <div className="mb-6">
            <h3 className="text-lg mb-2 font-semibold">Оберіть колір</h3>
            <ColorPicker value={color} onChange={fasteningChange} />
          </div>
          <div className="mb-6">
            <Characteristics
              data={fastening}
              isReadOnly1={false}
              currentBladeCoatingColor={color}
              onChange={fasteningObjectChange}
              type="Fastening"
            />
            <Input
              label="Ціна"
              defaultValue={fastening.price.toString()}
              type="number"
              className="mt-2"
              onChange={(e) => {
                fastening.price = parseFloat(e.target.value);
                fasteningObjectChange(fastening);
              }}
            />
          </div>

          <button
            onClick={fasteningSave}
            //onClick={()=>{console.log(fastening)}}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Зберегти
          </button>
        </div>
      </div>
    );
  }
};

export default FasteningPage;
