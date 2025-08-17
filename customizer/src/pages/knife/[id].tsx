"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import {
  Input,
  Spinner,
  Button,
  Switch,
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
} from "@nextui-org/react";

import KnifeService from "@/app/services/KnifeService";
import ProductTagService from "@/app/services/ProductTagService";
import FileService from "@/app/services/FileService";
import EngravingService from "@/app/services/EngravingService";
import { Knife } from "@/app/Interfaces/Knife/Knife";
import { KnifeDTO } from "@/app/DTOs/KnifeDTO";
import { EngravingDTO } from "@/app/DTOs/EngravingDTO";

import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel";
import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";

import { useCanvasState } from "@/app/state/canvasState";
import { useSnapshot } from "valtio";

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
  productTags: [],
};

const KnifeEditPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [knifeData, setKnifeData] = useState<Partial<Knife>>(initialData);
  const [allTags, setAllTags] = useState<ProductTag[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const fileService = useMemo(() => new FileService(), []);
  const knifeService = useMemo(() => new KnifeService(), []);
  const tagService = useMemo(() => new ProductTagService(), []);
  const engravingService = useMemo(() => new EngravingService(), []);
  const canvasState = useCanvasState();
  const snap = useSnapshot(canvasState);
  const isCreating = id === "0";

  useEffect(() => {
    if (!router.isReady) return;

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const tags = await tagService.getAll();
        setAllTags(tags);

        if (!isCreating && id) {
          const data = await knifeService.getById(id as string);
          setKnifeData(data);
        } else {
          setKnifeData(initialData);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        alert("Помилка завантаження даних.");
        router.push("/knife");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [id, router.isReady, knifeService, tagService, router]);

  const handleFieldChange = <K extends keyof Knife>(
    field: K,
    value: Knife[K]
  ) => {
    setKnifeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (keys: any) => {
    const selectedIds = new Set(Array.from(keys));
    const selectedTags = allTags.filter((tag) => selectedIds.has(tag.id));
    handleFieldChange("productTags", selectedTags);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const newEngravingsDto: EngravingDTO[] = [];
      const engravingsToUpdate = snap.engravings.filter(
        (eng) => eng.id && eng.id != ""
      );

      const existingEngravingIds: string[] = snap.engravings
        .filter((eng) => "id" in eng && eng.id && eng.id != "")
        .map((eng) => eng.id!);
      const engravingsToCreate = snap.engravings.filter(
        (eng) => !("id" in eng) || !eng.id
      );

      await Promise.all(
        engravingsToUpdate.map(async (engraving) => {
          let pictureId: string | null = engraving.picture?.id || null;
          if (engraving.fileObject) {
            const uploadedFile = await fileService.upload(engraving.fileObject);
            pictureId = uploadedFile.id;
          }

          const engravingDto: EngravingDTO = {
            pictureId,
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
            names: {
              ua: engraving.text || "Гравіювання",
              en: engraving.text || "Engraving",
            },
            descriptions: { ua: "-", en: "-" },
            tagsIds: [],
            isActive: false,
          };
          await engravingService.update(engraving.id!, engravingDto);
        })
      );

      for (const engraving of engravingsToCreate) {
        let pictureId: string | null = engraving.picture?.id || null;
        if (engraving.fileObject) {
          const uploadedFile = await fileService.upload(engraving.fileObject);
          pictureId = uploadedFile.id;
        }
        newEngravingsDto.push({
          pictureId,
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
          names: {
            ua: engraving.text || "Гравіювання",
            en: engraving.text || "Engraving",
          },
          descriptions: { ua: "-", en: "-" },
          tagsIds: [],
          isActive: false,
        });
      }

      const canvasData = {
        shapeId: snap.bladeShape.id,
        bladeCoatingColorId: snap.bladeCoatingColor.id,
        handleId: snap.handleColor?.id ?? null,
        sheathId: snap.bladeShape.sheathId ?? null,
        sheathColorId: snap.sheathColor?.id ?? null,
        newEngravings: newEngravingsDto,
        existingEngravingIds: existingEngravingIds,
        existingAttachmentIds:
          snap.attachment && "id" in snap.attachment
            ? [snap.attachment.id!]
            : [],
      };
      const formData = {
        isActive: knifeData.isActive ?? false,
        imageFileId:
          knifeData.imageUrl?.id || "06331a76-e8ea-4a0d-8eb3-ede166d1d0d2",
        names: {
          ua: (knifeData.names?.ua ?? knifeData.name ?? "") as string,
          en: (knifeData.names?.en ?? knifeData.name ?? "") as string,
        },
        titles: {
          ua: (knifeData.titles?.ua ?? knifeData.title ?? "") as string,
          en: (knifeData.titles?.en ?? knifeData.title ?? "") as string,
        },
        descriptions: {
          ua: (knifeData.descriptions?.ua ??
            knifeData.description ??
            "") as string,
          en: (knifeData.descriptions?.en ??
            knifeData.description ??
            "") as string,
        },
        metaTitles: {
          ua: (knifeData.metaTitles?.ua ?? knifeData.metaTitle ?? "") as string,
          en: (knifeData.metaTitles?.en ?? knifeData.metaTitle ?? "") as string,
        },
        metaDescriptions: {
          ua: (knifeData.metaDescriptions?.ua ??
            knifeData.metaDescription ??
            "") as string,
          en: (knifeData.metaDescriptions?.en ??
            knifeData.metaDescription ??
            "") as string,
        },
        tagsIds: knifeData.productTags?.map((tag) => tag.id) || [],
        price: knifeData.price,
      };

      const finalDto: KnifeDTO = { ...formData, ...canvasData };
      console.log("FinalDTO: ", finalDto);
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
        <Spinner size="lg" label="Завантаження..." />
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
          <div className="flex flex-col gap-4 h-[80vh] lg:h-auto sticky top-8">
            <div className="flex-grow aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <KnifeConfigurator
                productId={isCreating ? undefined : (id as string)}
              />
            </div>
            <div className="hidden lg:block">
              <CustomizationPanel />
            </div>
          </div>

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

                <div className="md:col-span-2">
                  <Select
                    label="Теги продукту"
                    placeholder="Виберіть теги"
                    selectionMode="multiple"
                    selectedKeys={
                      new Set(knifeData.productTags?.map((tag) => tag.id) || [])
                    }
                    onSelectionChange={handleTagsChange}
                  >
                    {allTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.names?.["ua"] || tag.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center pt-2">
                  <Switch
                    isSelected={!!knifeData.isActive}
                    onValueChange={(v) => handleFieldChange("isActive", v)}
                  >
                    Активний
                  </Switch>
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

            <Accordion selectionMode="multiple">
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
                    label="Публічні описи (для сторінки товару)"
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
