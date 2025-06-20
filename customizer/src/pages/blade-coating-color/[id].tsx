import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import {
    Input,
    Spinner,
    Button,
    Select,
    SelectItem,
    Switch,
} from "@nextui-org/react";
import BladeCoatingColorService from "@/app/services/BladeCoatingColorService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
import TextureService from "@/app/services/TextureService";
import { Texture } from "@/app/Interfaces/Texture";
import { BladeCoatingColor } from "@/app/Interfaces/BladeCoatingColor";
import { BladeCoatingDTO } from "@/app/DTOs/BladeCoatingDTO";
import { AppFile } from "@/app/Interfaces/File";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";

const initialData: Partial<BladeCoatingColor> = {
    price: 0,
    color: "",
    colorCode: "#FFFFFF",
    engravingColorCode: "#000000",
    isActive: true,
    texture: undefined,
    colorMap: undefined,
};

const BladeCoatingColorPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [coatingColor, setCoatingColor] = useState<Partial<BladeCoatingColor>>(
        initialData
    );
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);
    const [textures, setTextures] = useState<Texture[]>([]);

    const isCreating = id === "0";
    const coatingColorService = useMemo(
        () => new BladeCoatingColorService(),
        []
    );
    const textureService = useMemo(() => new TextureService(), []);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchDropdownData = async () => {
            try {
                const texturesData = await textureService.getAll();
                setTextures(texturesData);
            } catch (error) {
                console.error("Помилка завантаження текстур:", error);
            }
        };

        fetchDropdownData();

        if (isCreating) {
            setCoatingColor(initialData);
            setLoading(false);
            return;
        }

        if (id) {
            coatingColorService
                .getById(id as string)
                .then((data) => {
                    setCoatingColor(data);
                })
                .catch((err) => {
                    console.error("Помилка завантаження кольору покриття:", err);
                    router.push("/blade-coating-color/0");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router.isReady, coatingColorService, textureService]);

    const handleFieldChange = <K extends keyof BladeCoatingColor>(
        field: K,
        value: BladeCoatingColor[K]
    ) => {
        setCoatingColor((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);

        const dto: BladeCoatingDTO = {
            price: coatingColor.price ?? 0,
            colors: coatingColor.colors,
            colorCode: coatingColor.colorCode,
            engravingColorCode: coatingColor.engravingColorCode,
            isActive: coatingColor.isActive ?? true,
            textureId: coatingColor.texture?.id || null,
            colorMapId: coatingColor.colorMap?.id || null,
            types: coatingColor.types || null,
        };

        try {
            if (isCreating) {
                await coatingColorService.create(dto);
                alert("Колір покриття успішно створено!");
            } else {
                await coatingColorService.update(id as string, dto);
                alert("Зміни успішно збережено!");
            }
            router.push("/blade-coating-color");
        } catch (error) {
            console.error("Помилка збереження:", error);
            alert(
                `Сталася помилка: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-4">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    {isCreating
                        ? "Створення кольору покриття"
                        : "Редагування кольору покриття"}
                </h1>

                <LocalizedContentEditor
                    label="Назви кольору"
                    content={coatingColor.colors}
                    onContentChange={(c) => handleFieldChange("colors", c)}
                />

                <LocalizedContentEditor
                    label="Назви типу покриття"
                    content={coatingColor.types}
                    onContentChange={(c) => handleFieldChange("types", c)}
                />

                <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Код кольору
                        </label>
                        <ColorPicker
                            color={coatingColor.colorCode || "#FFFFFF"}
                            onChange={(color) => handleFieldChange("colorCode", color)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Код кольору для гравіювання
                        </label>
                        <ColorPicker
                            color={coatingColor.engravingColorCode || "#000000"}
                            onChange={(color) => handleFieldChange("engravingColorCode", color)}
                        />
                    </div>
                    <Input
                        label="Ціна"
                        type="number"
                        value={String(coatingColor.price || 0)}
                        onChange={(e) =>
                            handleFieldChange("price", parseFloat(e.target.value) || 0)
                        }
                        startContent={<span>₴</span>}
                    />
                    <Select
                        label="Текстура (необов'язково)"
                        placeholder="Виберіть текстуру"
                        selectedKeys={coatingColor.texture ? [coatingColor.texture.id] : []}
                        onSelectionChange={(keys) => {
                            const selectedId = Array.from(keys)[0];
                            const selectedTexture =
                                textures.find((t) => t.id === selectedId) || null;
                            handleFieldChange("texture", selectedTexture);
                        }}
                    >
                        {textures.map((tex) => (
                            <SelectItem key={tex.id} value={tex.id}>
                                {tex.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <div className="md:col-span-2">
                        <FileUpload
                            label="Color Map (необов'язково)"
                            currentFile={coatingColor.colorMap as AppFile}
                            onFileChange={(f) => handleFieldChange("colorMap", f)}
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-start">
                        <Switch
                            isSelected={!!coatingColor.isActive}
                            onValueChange={(v) => handleFieldChange("isActive", v)}
                        >
                            Активний
                        </Switch>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        color="danger"
                        variant="flat"
                        onClick={() => router.back()}
                        fullWidth
                    >
                        Скасувати
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleSave}
                        isLoading={isSaving}
                        fullWidth
                    >
                        Зберегти
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BladeCoatingColorPage;