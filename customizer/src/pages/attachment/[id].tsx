// /pages/attachment/[id].tsx

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
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import AttachmentService from "@/app/services/AttachmentService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import AttachmentTypeService from "@/app/services/AttachmentTypeService";
import ProductTagService from "@/app/services/ProductTagService"; // <-- 1. Імпортуємо сервіс тегів
import { Attachment } from "@/app/Interfaces/Attachment";

const initialData: Partial<Attachment> = {
  isActive: true,
  names: {},
  titles: {},
  descriptions: {},
  metaTitles: {},
  metaDescriptions: {},
  colors: {},
  materials: {},
  price: 0,
  image: undefined,
  model: undefined,
  type: undefined,
  tags: [],
};

const AttachmentPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [attachment, setAttachment] =
    useState<Partial<Attachment>>(initialData);
  const [attachmentTypes, setAttachmentTypes] = useState<AttachmentType[]>([]);
  const [productTags, setProductTags] = useState<ProductTag[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const isCreating = id === "0";
  const attachmentService = useMemo(() => new AttachmentService(), []);
  const attachmentTypeService = useMemo(() => new AttachmentTypeService(), []);
  const productTagService = useMemo(() => new ProductTagService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    // --- 3. Завантажуємо всі дані для форми одночасно ---
    const fetchFormData = async () => {
      try {
        const [types, tags] = await Promise.all([
          attachmentTypeService.getAll(),
          productTagService.getAll(),
        ]);
        setAttachmentTypes(types);
        setProductTags(tags);
      } catch (e) {
        alert("Не вдалося завантажити допоміжні дані (типи, теги).");
      }
    };

    fetchFormData();

    if (isCreating) {
      setAttachment(initialData);
      setLoading(false);
      return;
    }

    if (id) {
      attachmentService
        .getById(id as string)
        .then(setAttachment)
        .catch((err) => router.push("/attachment/0"))
        .finally(() => setLoading(false));
    }
  }, [id, router.isReady]);

  const handleFieldChange = <K extends keyof Attachment>(
    field: K,
    value: Attachment[K]
  ) => {
    setAttachment((prev) => ({ ...prev, [field]: value }));
  };

  // --- 4. Обробник для мульти-селекту тегів ---
  const handleTagsChange = (keys: any) => {
    const selectedIds = new Set(Array.from(keys));
    const selectedTags = productTags.filter((tag) => selectedIds.has(tag.id));
    handleFieldChange("tags", selectedTags);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isCreating) {
        await attachmentService.create(attachment as Omit<Attachment, "id">);
        alert("Додаток створено!");
      } else {
        await attachmentService.update(id as string, attachment as Attachment);
        alert("Зміни збережено!");
      }
      router.push("/attachment");
    } catch (error) {
      alert(
        `Помилка: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isCreating ? "Створення додатку" : "Редагування додатку"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUpload
            label="Зображення"
            currentFile={attachment.image}
            onFileChange={(f) => handleFieldChange("image", f)}
            isRequired
          />
          <FileUpload
            label="3D Модель"
            currentFile={attachment.model}
            onFileChange={(f) => handleFieldChange("model", f)}
            isRequired
          />

          <Select
            label="Тип додатку"
            placeholder="Виберіть тип"
            selectedKeys={attachment.type ? [attachment.type.id] : []}
            onSelectionChange={(keys) => {
              const selectedType = attachmentTypes.find(
                (t) => t.id === Array.from(keys)[0]
              );
              if (selectedType) {
                handleFieldChange("type", selectedType);
              }
            }}
            isRequired
          >
            {attachmentTypes.map((type) => (
              <SelectItem key={type.id}>
                {type.names?.["ua"] || type.name}
              </SelectItem>
            ))}
          </Select>

          {/* --- 5. Додаємо поле для вибору тегів --- */}
          <Select
            label="Теги"
            placeholder="Виберіть теги"
            selectionMode="multiple"
            selectedKeys={attachment.tags?.map((tag) => tag.id) || []}
            onSelectionChange={handleTagsChange}
          >
            {productTags.map((tag) => (
              <SelectItem key={tag.id}>
                {tag.names?.["ua"] || tag.name}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Ціна"
            type="number"
            value={String(attachment.price || 0)}
            onChange={(e) =>
              handleFieldChange("price", parseFloat(e.target.value) || 0)
            }
            startContent={<span>₴</span>}
          />
          <div className="flex items-center">
            <Switch
              isSelected={!!attachment.isActive}
              onValueChange={(v) => handleFieldChange("isActive", v)}
            >
              Активний
            </Switch>
          </div>
        </div>

        <Accordion selectionMode="multiple" defaultExpandedKeys={["names"]}>
          {/* ... Решта полів в акордеоні без змін ... */}
          <AccordionItem key="names" aria-label="Назви" title="Назви">
            <LocalizedContentEditor
              label=""
              content={attachment.names}
              onContentChange={(c) => handleFieldChange("names", c)}
            />
          </AccordionItem>
          <AccordionItem
            key="titles"
            aria-label="Заголовки"
            title="Заголовки (Titles)"
          >
            <LocalizedContentEditor
              label=""
              content={attachment.titles}
              onContentChange={(c) => handleFieldChange("titles", c)}
            />
          </AccordionItem>
          <AccordionItem key="descriptions" aria-label="Описи" title="Описи">
            <LocalizedContentEditor
              label=""
              content={attachment.descriptions}
              onContentChange={(c) => handleFieldChange("descriptions", c)}
            />
          </AccordionItem>
          <AccordionItem key="colors" aria-label="Кольори" title="Кольори">
            <LocalizedContentEditor
              label=""
              content={attachment.colors}
              onContentChange={(c) => handleFieldChange("colors", c)}
            />
          </AccordionItem>
          <AccordionItem
            key="materials"
            aria-label="Матеріали"
            title="Матеріали"
          >
            <LocalizedContentEditor
              label=""
              content={attachment.materials}
              onContentChange={(c) => handleFieldChange("materials", c)}
            />
          </AccordionItem>
          <AccordionItem key="meta" aria-label="SEO" title="SEO Мета-дані">
            <div className="space-y-4">
              <LocalizedContentEditor
                label="Meta Titles"
                content={attachment.metaTitles}
                onContentChange={(c) => handleFieldChange("metaTitles", c)}
              />
              <LocalizedContentEditor
                label="Meta Descriptions"
                content={attachment.metaDescriptions}
                onContentChange={(c) =>
                  handleFieldChange("metaDescriptions", c)
                }
              />
            </div>
          </AccordionItem>
        </Accordion>

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

export default AttachmentPage;
