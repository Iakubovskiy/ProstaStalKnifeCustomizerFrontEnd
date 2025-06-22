"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

// --- UI Компоненти ---
import {
  Input,
  Spinner,
  Button,
  Switch,
  Accordion,
  AccordionItem,
  Textarea, // Використовуємо Textarea для описів
} from "@nextui-org/react";

// --- Сервіси та Інтерфейси ---
import KnifeService from "@/app/services/KnifeService";
import { Knife } from "@/app/Interfaces/Knife/Knife";
import { KnifeDTO } from "@/app/DTOs/KnifeDTO";

// --- Наші кастомні компоненти ---
import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel";
import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";

// --- Стан для 3D ---
import { useCanvasState } from "@/app/state/canvasState";
import { useSnapshot } from "valtio";
import { EngravingDTO } from "@/app/DTOs/EngravingDTO";
import { AppFile } from "@/app/Interfaces/File";
import FileService from "./../../app/services/FileService";

const initialData: Partial<Knife> = {
  isActive: true,
  name: "",
  names: {},
  description: "",
  descriptions: {},
  title: "",
  titles: {},
  metaTitle: "",
  metaTitles: {},
  metaDescription: "",
  metaDescriptions: {},
  price: 0,
  totalLength: 0,
  bladeLength: 0,
  bladeWidth: 0,
  bladeWeight: 0,
  sharpeningAngle: 0,
  rockwellHardnessUnits: 0,
};

const KnifeEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [knifeData, setKnifeData] = useState<Partial<Knife>>(initialData);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const fileService = new FileService();
  // Отримуємо доступ до стану 3D-сцени для збереження
  const canvasState = useCanvasState();
  const snap = useSnapshot(canvasState);

  const isCreating = id === "0";
  const knifeService = useMemo(() => new KnifeService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    if (isCreating) {
      setKnifeData(initialData);
      setLoading(false);
      return;
    }

    if (id) {
      setLoading(true);
      knifeService
        .getById(id as string)
        .then((data) => {
          setKnifeData(data);
          console.log("data: ", data);
        })
        .catch((err) => {
          console.error("Failed to fetch knife, redirecting...", err);
          router.push("/knife/0");
        })
        .finally(() => setLoading(false));
    }
  }, [id, router.isReady]);

  const handleFieldChange = <K extends keyof Knife>(
    field: K,
    value: Knife[K]
  ) => {
    setKnifeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newEngravingsDto: EngravingDTO[] = [];
      const existingEngravingIds: string[] = snap.engravings
        .filter((eng) => "id" in eng && eng.id)
        .map((eng) => eng.id!);

      const engravingsToCreate = snap.engravings.filter(
        (eng) => !("id" in eng) || !eng.id
      ); // Беремо тільки нові

      for (const engraving of engravingsToCreate) {
        let pictureId: string | null = null;

        // Якщо у гравіювання вже є завантажене зображення, використовуємо його ID
        if (engraving.picture) {
          pictureId = engraving.picture.id;
        }

        // Якщо є новий файл для завантаження (fileObject), завантажуємо його
        const uploadable = engraving.fileObject;
        if (uploadable) {
          try {
            console.log("Engraving file to upload:", uploadable);
            const uploadedFile: AppFile = await fileService.upload(uploadable);
            console.log("Uploaded engraving file:", uploadedFile);
            pictureId = uploadedFile.id; // Перезаписуємо pictureId новим ID
          } catch (error) {
            console.error("Failed to upload engraving file:", error);
            alert("Не вдалося завантажити файл гравіювання. Спробуйте ще раз.");
            throw error;
          }
        }

        newEngravingsDto.push({
          pictureId: pictureId,
          side: engraving.side,
          text: engraving.text,
          font: engraving.font,
          locationX: engraving.locationX,
          locationY: engraving.locationY,
          locationZ: engraving.locationZ,
          rotationX: engraving.rotationX,
          rotationY: engraving.rotationY,
          rotationZ: engraving.rotationZ,
          scaleX: engraving.scaleX,
          scaleY: engraving.scaleY,
          scaleZ: engraving.scaleZ,
          // Додайте names, descriptions, tagsIds, якщо вони є у вашому EngravingDTO
          names: {
            ua: engraving.text || "Гравіювання",
            en: engraving.text || "Engraving",
          },
          descriptions: { ua: "-", en: "-" },
          tagsIds: [],
        });
      }
      const canvasData = {
        shapeId: snap.bladeShape.id,
        bladeCoatingColorId: snap.bladeCoatingColor.id,
        handleId: snap.handleColor?.id ?? null,
        sheathId: snap.bladeShape.sheathModel?.id ?? null,
        sheathColorId: snap.sheathColor?.id ?? null,
        newEngravings: snap.engravings.map((eng) => ({
          pictureId: eng.picture.id,
          side: eng.side,
          text: eng.text,
          font: eng.font,
          locationX: eng.locationX,
          locationY: eng.locationY,
          locationZ: eng.locationZ,
          rotationX: eng.rotationX,
          rotationY: eng.rotationY,
          rotationZ: eng.rotationZ,
          scaleX: eng.scaleX,
          scaleY: eng.scaleY,
          scaleZ: eng.scaleZ,
        })),

        existingEngravingIds: [], // Логіка для існуючих гравіювань
        existingAttachmentIds: [], // Логіка для існуючих додатків
      };
      console.log("image: ", knifeData.imageUrl);
      const formData = {
        isActive: knifeData.isActive ?? false,
        imageFileId: knifeData.imageUrl?.id || "",
        names: Object.fromEntries(
          Object.entries(
            knifeData.names || { ua: knifeData.name, en: knifeData.name }
          ).map(([k, v]) => [k, v ?? ""])
        ),
        titles: Object.fromEntries(
          Object.entries(
            knifeData.titles || { ua: knifeData.title, en: knifeData.title }
          ).map(([k, v]) => [k, v ?? ""])
        ),
        descriptions: Object.fromEntries(
          Object.entries(
            knifeData.descriptions || {
              ua: knifeData.description,
              en: knifeData.description,
            }
          ).map(([k, v]) => [k, v ?? ""])
        ),
        metaTitles: Object.fromEntries(
          Object.entries(
            knifeData.metaTitles || {
              ua: knifeData.metaTitle,
              en: knifeData.metaTitle,
            }
          ).map(([k, v]) => [k, v ?? ""])
        ),
        metaDescriptions: Object.fromEntries(
          Object.entries(
            knifeData.metaDescriptions || {
              ua: knifeData.metaDescription,
              en: knifeData.metaDescription,
            }
          ).map(([k, v]) => [k, v ?? ""])
        ),
        tagsIds: [],
      };

      // 3. Комбінуємо все в один DTO
      const finalDto: KnifeDTO = {
        ...formData,
        ...canvasData,
      };

      if (isCreating) {
        await knifeService.create(finalDto);
        alert("Ніж успішно створено!");
      } else {
        await knifeService.update(id as string, finalDto);
        alert("Зміни успішно збережено!");
      }
      router.push("/knife");
    } catch (error) {
      alert(
        `Помилка збереження: ${
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
        <Spinner size="lg" label="Завантаження даних ножа..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isCreating ? "Створення нового ножа" : "Редагування ножа"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Ліва колонка: 3D Візуалізація --- */}
          <div className="flex flex-col gap-4 h-[80vh] lg:h-auto">
            <div className="flex-grow aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <KnifeConfigurator
                productId={isCreating ? null : (id as string)}
              />
            </div>
            <div className="hidden lg:block">
              <CustomizationPanel />
            </div>
          </div>

          {/* --- Права колонка: Поля для вводу даних --- */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Основна інформація
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Назва (для адмінки)"
                  value={knifeData.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  isRequired
                />
                <Input
                  label="Ціна"
                  type="number"
                  value={String(knifeData.price || 0)}
                  onChange={(e) =>
                    handleFieldChange("price", parseFloat(e.target.value) || 0)
                  }
                  startContent={<span>₴</span>}
                />
                <div className="flex items-center pt-2">
                  <Switch
                    isSelected={!!knifeData.isActive}
                    onValueChange={(v) => handleFieldChange("isActive", v)}
                  >
                    Активний
                  </Switch>
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Короткий опис (для адмінки)"
                    value={knifeData.description || ""}
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <FileUpload
                    label="Головне зображення (для каталогу)"
                    currentFile={knifeData.imageUrl}
                    onFileChange={(f) => {
                      if (f) handleFieldChange("imageUrl", f);
                    }}
                  />
                </div>
              </div>
            </div>

            <Accordion selectionMode="multiple" defaultExpandedKeys={[]}>
              <AccordionItem
                key="tech"
                aria-label="Технічні характеристики"
                title="Технічні характеристики"
              >
                <div className="grid grid-cols-2 gap-4 p-2">
                  <Input
                    label="Загальна довжина (мм)"
                    type="number"
                    value={String(knifeData.totalLength || 0)}
                    onChange={(e) =>
                      handleFieldChange(
                        "totalLength",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Довжина леза (мм)"
                    type="number"
                    value={String(knifeData.bladeLength || 0)}
                    onChange={(e) =>
                      handleFieldChange(
                        "bladeLength",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Ширина леза (мм)"
                    type="number"
                    value={String(knifeData.bladeWidth || 0)}
                    onChange={(e) =>
                      handleFieldChange(
                        "bladeWidth",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Вага леза (г)"
                    type="number"
                    value={String(knifeData.bladeWeight || 0)}
                    onChange={(e) =>
                      handleFieldChange(
                        "bladeWeight",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Кут заточки (°)"
                    type="number"
                    value={String(knifeData.sharpeningAngle || 0)}
                    onChange={(e) =>
                      handleFieldChange(
                        "sharpeningAngle",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                  <Input
                    label="Твердість (HRC)"
                    type="number"
                    value={String(knifeData.rockwellHardnessUnits || 0)}
                    onChange={(e) =>
                      handleFieldChange(
                        "rockwellHardnessUnits",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
              </AccordionItem>
              <AccordionItem
                key="content"
                aria-label="Контент для клієнтів"
                title="Контент для клієнтів"
              >
                <div className="space-y-4 p-2">
                  <LocalizedContentEditor
                    label="Публічні назви"
                    content={knifeData.names}
                    onContentChange={(c) => handleFieldChange("names", c)}
                  />
                  <LocalizedContentEditor
                    label="Публічні описи"
                    content={knifeData.descriptions}
                    onContentChange={(c) =>
                      handleFieldChange("descriptions", c)
                    }
                  />
                </div>
              </AccordionItem>
              <AccordionItem key="seo" aria-label="SEO" title="SEO Мета-дані">
                <div className="space-y-4 p-2">
                  <LocalizedContentEditor
                    label="Meta Titles"
                    content={knifeData.metaTitles}
                    onContentChange={(c) => handleFieldChange("metaTitles", c)}
                  />
                  <LocalizedContentEditor
                    label="Meta Descriptions"
                    content={knifeData.metaDescriptions}
                    onContentChange={(c) =>
                      handleFieldChange("metaDescriptions", c)
                    }
                  />
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Панель кастомізації для мобільних пристроїв */}
        <div className="lg:hidden mt-8">
          <CustomizationPanel />
        </div>

        <div className="flex gap-4 pt-8 mt-8 border-t">
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
            {isCreating ? "Створити ніж" : "Зберегти зміни"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KnifeEditPage;
