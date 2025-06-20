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
};

const AttachmentPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [attachment, setAttachment] =
    useState<Partial<Attachment>>(initialData);
  const [attachmentTypes, setAttachmentTypes] = useState<AttachmentType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const isCreating = id === "0";
  const attachmentService = useMemo(() => new AttachmentService(), []);
  const attachmentTypeService = useMemo(() => new AttachmentTypeService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    attachmentTypeService
      .getAll()
      .then(setAttachmentTypes)
      .catch((e) => alert("Не вдалося завантажити типи додатків"));

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
