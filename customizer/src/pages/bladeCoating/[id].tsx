"use client";
import React, { useEffect, useState } from "react";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import { useRouter } from "next/router";
import BladeCoatingColorService from "@/app/services/BladeCoatingColorService";
import "../../styles/globals.css";
import { Spinner } from "@nextui-org/react";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
const initialBladeCoatingColorData: BladeCoatingColor = {
    id: "",
    color: "",
    type: "",
    colorCode: "",
    colorMapUrl: "",
    normalMapUrl: "",
    roughnessMapUrl: "",
    price: 0,
    engravingColorCode: "",
    isActive: true,
};

const BladeCoatingColorPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [color, setColor] = useState<string>(initialBladeCoatingColorData.colorCode);
    const [engravingColor, setEngravingColor] = useState<string>(initialBladeCoatingColorData.engravingColorCode);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isCreating, setCreating] = useState<boolean>(false);

    const [colorMapFile, setColorMapFile] = useState<File | null>(null);
    const [normalMapFile, setNormalMapFile] = useState<File | null>(null);
    const [roughnessrMapFile, setRoughnessMapFile] = useState<File | null>(null);
    const [bladeCoatingColor, setBladeCoatingColor] = useState<BladeCoatingColor>(
        initialBladeCoatingColorData
    );
    const bladeCoatingservice = new BladeCoatingColorService();
    const colorMapFileSelected = (selectedFile: File | null) => {
        console.log(0);
        setColorMapFile(selectedFile);
    };
    const normalMapFileSelected = (selectedFile: File | null) => {
        console.log(1);
        setNormalMapFile(selectedFile);
    };
    const roughnessrMapFileSelected = (selectedFile: File | null) => {
        console.log(2);
        setRoughnessMapFile(selectedFile);
    };
    const bladeCoatingObjectChange = (updatedData: BladeCoatingColor) => {
        setBladeCoatingColor(updatedData);
        console.log(bladeCoatingColor);
    };
    const bladeCoatingSave = async () => {
        if (bladeCoatingColor) {
            if (isCreating) {
                await bladeCoatingservice.create(bladeCoatingColor, colorMapFile, normalMapFile, roughnessrMapFile);
            } else {
                await bladeCoatingservice.update(
                    id as string,
                    bladeCoatingColor,
                    colorMapFile,
                    normalMapFile,
                    roughnessrMapFile
                );
            }

            alert("Збережено");
        } else {
            alert("Оберіть файл та заповніть поля");
        }
    };
    useEffect(() => {
        const fetchBladeCoatingColor = async () => {
            if (id) {
                if (id === "0") {
                    setCreating(true);
                    setLoading(false);
                } else {
                    try {
                        const fetchedBladeCoatingColor = await bladeCoatingservice.getById(id as string);
                        setBladeCoatingColor(fetchedBladeCoatingColor);
                        setColor(fetchedBladeCoatingColor.colorCode);
                        setEngravingColor(fetchedBladeCoatingColor.engravingColorCode);
                        setLoading(false);
                    } catch (error) {
                        console.error("Error fetching sheath color:", error);
                        alert("Сталася помилка під час отримання даних. Перевірте ID.");
                        router.push("/bladeCoatingColorPage/0");
                    }
                }
            }
            console.log(bladeCoatingColor);
        };
        fetchBladeCoatingColor();
    }, [id]);
    const bladeCoatingColorChange = (newColor: string) => {
        setColor(newColor);
        bladeCoatingColor.colorCode = newColor;
    };
    const bladeCoatingEngravingColorChange = (newColor: string) => {
        setEngravingColor(newColor);
        bladeCoatingColor.engravingColorCode = newColor;
    };
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center ">
                <Spinner
                    size="lg"
                    color="warning"
                    label="Loading bladeCoating color data..."
                />
            </div>
        );
    } else {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl text-black font-bold text-center mb-4">
                        Кольори руків&#39;я
                    </h1>

                    <h3 className="text-xl text-black font-bold text-center mb-4">colorMap</h3>
                    <div className="mb-6">
                        <DragNDrop
                            onFileSelected={colorMapFileSelected}
                            validExtensions={[".jpg", "jpeg", ".png"]}
                            id='0'
                        />
                    </div>
                    <h3 className="text-xl text-black font-bold text-center mb-4">normalMap</h3>
                    <div className="mb-6">
                        <DragNDrop
                            onFileSelected={normalMapFileSelected}
                            validExtensions={[".jpg", "jpeg", ".png"]}
                            id='1'
                        />
                    </div>
                    <h3 className="text-xl text-black font-bold text-center mb-4">roughnessMap</h3>
                    <div className="mb-6">
                        <DragNDrop
                            onFileSelected={roughnessrMapFileSelected}
                            validExtensions={[".jpg", "jpeg", ".png"]}
                            id='2'
                        />
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg mb-4 font-semibold">Оберіть колір</h3>
                        <ColorPicker value={color} onChange={bladeCoatingColorChange}/>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg mb-4 font-semibold">Оберіть колір гравіювання</h3>
                        <ColorPicker value={engravingColor} onChange={bladeCoatingEngravingColorChange}/>
                    </div>
                    <div className="mb-6">
                        <Characteristics
                            data={bladeCoatingColor}
                            isReadOnly1={false}
                            currentBladeCoatingColor={color}
                            onChange={bladeCoatingObjectChange}
                            type="BladeCoatingColor"
                        />
                    </div>

                    <button
                        onClick={bladeCoatingSave}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Зберегти
                    </button>
                </div>
            </div>
        );
    }
};

export default BladeCoatingColorPage;
