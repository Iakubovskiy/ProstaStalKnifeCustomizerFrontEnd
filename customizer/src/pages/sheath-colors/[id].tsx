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
import { Plus, Trash2 } from "lucide-react";
import SheathColorService from "@/app/services/SheathColorService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";
import TextureService from "@/app/services/TextureService";
import BladeShapeTypeService from "@/app/services/BladeShapeTypeService";
import { Texture } from "@/app/Interfaces/Texture";
import { SheathColor } from "@/app/Interfaces/SheathColor";
import { SheathColorDTO } from "@/app/DTOs/SheathColorDTO";
import { SheathColorPriceByType } from "@/app/Interfaces/SheathColorPriceByType";
import { AppFile } from "@/app/Interfaces/File";

const initialData: Partial<SheathColor> = {
  colors: {},
  materials: {},
  colorCode: "#FFFFFF",
  engravingColorCode: "#000000",
  isActive: true,
  texture: undefined,
  colorMap: undefined,
  prices: [],
};

const SheathColorPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [sheathColor, setSheathColor] =
      useState<Partial<SheathColor>>(initialData);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [textures, setTextures] = useState<Texture[]>([]);
  const [bladeShapeTypes, setBladeShapeTypes] = useState<BladeShapeType[]>([]);

  const isCreating = id === "0";
  const sheathColorService = useMemo(() => new SheathColorService(), []);
  const textureService = useMemo(() => new TextureService(), []);
  const bladeShapeTypeService = useMemo(() => new BladeShapeTypeService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchDropdownData = async () => {
      try {
        const [texturesData, typesData] = await Promise.all([
          textureService.getAll(),
          bladeShapeTypeService.getAll(),
        ]);
        setTextures(texturesData);
        setBladeShapeTypes(typesData);
      } catch (error) {
        console.error("Помилка завантаження даних для форми:", error);
      }
    };

    fetchDropdownData();

    if (isCreating) {
      setSheathColor(initialData);
      setLoading(false);
      return;
    }

    if (id) {
      sheathColorService
          .getById(id as string)
          .then((data) => setSheathColor(data))
          .catch((err) => {
            console.error("Помилка завантаження кольору піхов:", err);
            router.push("/sheath-colors/0");
          })
          .finally(() => setLoading(false));
    }
  }, [id, router.isReady]);

  const handleFieldChange = <K extends keyof SheathColor>(
      field: K,
      value: SheathColor[K]
  ) => {
    setSheathColor((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (
      index: number,
      field: keyof SheathColorPriceByType,
      value: BladeShapeType | number | null
  ) => {
    const updatedPrices = [...(sheathColor.prices || [])];
    if (updatedPrices[index]) {
      (updatedPrices[index] as any)[field] = value;
      handleFieldChange("prices", updatedPrices);
    }
  };

  const addPriceRow = () => {
    const newPrice: SheathColorPriceByType = { bladeShapeType: null, price: 0 };
    handleFieldChange("prices", [...(sheathColor.prices || []), newPrice]);
  };

  const removePriceRow = (index: number) => {
    const updatedPrices = [...(sheathColor.prices || [])];
    updatedPrices.splice(index, 1);
    handleFieldChange("prices", updatedPrices);
  };

  const handleSave = async () => {
    if (!sheathColor.colors?.["ua"] || !sheathColor.materials?.["ua"]) {
      alert("Будь ласка, заповніть Назву кольору та Матеріал для 'ua' локалі.");
      return;
    }

    setSaving(true);

    const dto: SheathColorDTO = {
      colors: sheathColor.colors,
      materials: sheathColor.materials,
      colorCode: sheathColor.colorCode,
      engravingColorCode: sheathColor.engravingColorCode,
      isActive: sheathColor.isActive ?? true,
      textureId: sheathColor.texture?.id || null,
      colorMapId: sheathColor.colorMap?.id || null,
      prices: (sheathColor.prices || [])
          .filter((p) => p.bladeShapeType)
          .map((p) => ({
            typeId: p.bladeShapeType!.id,
            price: Number(p.price) || 0,
          })),
    };

    try {
      if (isCreating) {
        await sheathColorService.create(dto);
        alert("Колір піхов успішно створено!");
      } else {
        await sheathColorService.update(id as string, dto);
        alert("Зміни успішно збережено!");
      }
      router.push("/sheath-colors");
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            {isCreating ? "Створення кольору піхов" : "Редагування кольору піхов"}
          </h1>

          <LocalizedContentEditor
              label="Кольори"
              content={sheathColor.colors}
              onContentChange={(c) => handleFieldChange("colors", c)}
          />
          <LocalizedContentEditor
              label="Матеріали"
              content={sheathColor.materials}
              onContentChange={(m) => handleFieldChange("materials", m)}
          />

          <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Код кольору
              </label>
              <ColorPicker
                  color={sheathColor.colorCode || "#FFFFFF"}
                  onChange={(c) => handleFieldChange("colorCode", c)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Код кольору для гравіювання
              </label>
              <ColorPicker
                  color={sheathColor.engravingColorCode || "#000000"}
                  onChange={(c) => handleFieldChange("engravingColorCode", c)}
              />
            </div>
            <Select
                label="Текстура"
                placeholder="Виберіть текстуру"
                selectedKeys={sheathColor.texture ? [sheathColor.texture.id] : []}
                onSelectionChange={(keys) => {
                  const id = Array.from(keys)[0] as string;
                  handleFieldChange(
                      "texture",
                      textures.find((t) => t.id === id) || null
                  );
                }}
            >
              {textures.map((tex) => (
                  <SelectItem key={tex.id} value={tex.id}>
                    {tex.name}
                  </SelectItem>
              ))}
            </Select>
            <div className="flex items-center">
              <Switch
                  isSelected={!!sheathColor.isActive}
                  onValueChange={(v) => handleFieldChange("isActive", v)}
              >
                Активний
              </Switch>
            </div>
            <div className="md:col-span-2">
              <FileUpload
                  label="Color Map"
                  currentFile={sheathColor.colorMap as AppFile}
                  onFileChange={(f) => handleFieldChange("colorMap", f)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Ціни за типом форми леза</h2>
              <Button size="sm" isIconOnly color="primary" onClick={addPriceRow}>
                <Plus size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              {(sheathColor.prices || []).map((priceItem, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Select
                        label="Тип форми леза"
                        placeholder="Виберіть тип"
                        selectedKeys={
                          priceItem.bladeShapeType
                              ? [priceItem.bladeShapeType.id]
                              : []
                        }
                        onSelectionChange={(keys) => {
                          const selectedId = Array.from(keys)[0] as string;
                          const selectedType =
                              bladeShapeTypes.find((t) => t.id === selectedId) || null;
                          handlePriceChange(index, "bladeShapeType", selectedType);
                        }}
                        className="flex-grow"
                    >
                      {bladeShapeTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                      ))}
                    </Select>
                    <Input
                        label="Ціна"
                        type="number"
                        value={String(priceItem.price || 0)}
                        onChange={(e) =>
                            handlePriceChange(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                            )
                        }
                        startContent={<span>₴</span>}
                    />
                    <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        onClick={() => removePriceRow(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
              ))}
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

export default SheathColorPage;