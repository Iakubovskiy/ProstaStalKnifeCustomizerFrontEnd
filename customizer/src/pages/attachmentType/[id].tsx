// /pages/admin/attachment-type/[id].tsx

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Spinner, Button } from "@nextui-org/react";

import AttachmentTypeService from "@/app/services/AttachmentTypeService";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";

// Початкові дані
const initialData: Omit<AttachmentType, "id" | "name"> = {
  names: {},
};

const AttachmentTypePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [attachmentType, setAttachmentType] =
    useState<Partial<AttachmentType>>(initialData);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const isCreating = id === "0";
  const attachmentTypeService = useMemo(() => new AttachmentTypeService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    if (isCreating) {
      setAttachmentType(initialData);
      setLoading(false);
      return;
    }

    if (id) {
      attachmentTypeService
        .getById(id as string)
        .then((data) => setAttachmentType(data))
        .catch((err) => {
          console.error("Помилка завантаження типу додатку:", err);
          alert("Помилка завантаження даних");
          router.push("/attachmentType/0");
        })
        .finally(() => setLoading(false));
    }
  }, [id, router.isReady, isCreating, attachmentTypeService, router]);

  const handleNamesChange = (newNames: LocalizedContent) => {
    setAttachmentType((prev) => ({ ...prev, names: newNames }));
  };

  const handleSave = async () => {
    if (
      !attachmentType.names ||
      Object.keys(attachmentType.names).length === 0 ||
      !attachmentType.names["uk"]
    ) {
      alert("Назва для української локалі ('uk') є обов'язковою.");
      return;
    }

    setSaving(true);
    // Видаляємо застаріле поле 'name' перед відправкою, якщо воно є
    const { name, ...dataToSend } = attachmentType;

    try {
      if (isCreating) {
        await attachmentTypeService.create(
          dataToSend as Omit<AttachmentType, "id">
        );
        alert("Тип додатку успішно створено!");
      } else {
        // Згідно вашого сервісу, метод update відсутній.
        // Якщо він з'явиться, його треба буде викликати тут.
        // Наразі, для існуючих записів збереження неможливе.
        // Якщо ви додали PUT, розкоментуйте:
        // await attachmentTypeService.update(id as string, dataToSend as AttachmentType);
        alert("Оновлення для цього об'єкту не реалізовано в API.");
        // Поки що не будемо нічого зберігати для існуючих.
        // Це можна змінити, якщо ви додасте PUT endpoint в API.
      }
      if (isCreating) {
        router.push("/attachmentType");
      }
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Сталася помилка під час збереження.");
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
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isCreating ? "Створення типу додатку" : "Редагування типу додатку"}
        </h1>

        <LocalizedContentEditor
          label="Назви"
          content={attachmentType.names}
          onContentChange={handleNamesChange}
        />

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
            // Блокуємо кнопку, якщо це не створення, бо немає методу update
            isDisabled={!isCreating}
          >
            {isCreating
              ? isSaving
                ? "Створення..."
                : "Створити"
              : "Зберегти (недоступно)"}
          </Button>
        </div>
        {!isCreating && (
          <p className="text-center text-sm text-gray-500">
            Редагування для цього об'єкту не підтримується API.
          </p>
        )}
      </div>
    </div>
  );
};

export default AttachmentTypePage;
