import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Input, Select, SelectItem, Spinner, Button } from "@nextui-org/react";

import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import { DeliveryType } from "@/app/Interfaces/DeliveryType";

const initialDeliveryTypeData: Omit<DeliveryType, "id" | "name" | "comment"> = {
  names: {},
  comments: {},
  price: 0,
  isActive: true,
};

const DeliveryTypePage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Стан тепер відповідає структурі для API
  const [deliveryType, setDeliveryType] = useState<Partial<DeliveryType>>(
    initialDeliveryTypeData
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isCreating = id === "0";
  const deliveryTypeService = useMemo(() => new DeliveryTypeService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchDeliveryType = async () => {
      if (isCreating) {
        setDeliveryType(initialDeliveryTypeData);
        setLoading(false);
        return;
      }
      if (id) {
        try {
          setLoading(true);
          const fetchedDeliveryType = await deliveryTypeService.getById(
            id as string
          );
          // Заповнюємо стан отриманими даними
          setDeliveryType(fetchedDeliveryType);
        } catch (error) {
          console.error("Error fetching delivery type:", error);
          alert("Сталася помилка під час отримання даних.");
          router.push("/admin/deliveryTypePage/0");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDeliveryType();
  }, [id, router.isReady, isCreating, deliveryTypeService, router]);

  // Обробник для простих полів (ціна)
  const handleSimpleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryType((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // Функції-обробники для оновлення локалізованих полів
  const handleNamesChange = (newNames: LocalizedContent) => {
    setDeliveryType((prev) => ({ ...prev, names: newNames }));
  };

  const handleCommentsChange = (newComments: LocalizedContent) => {
    setDeliveryType((prev) => ({ ...prev, comments: newComments }));
  };

  const handleActiveChange = (keys: any) => {
    const value = Array.from(keys).join("") === "true";
    setDeliveryType((prev) => ({ ...prev, isActive: value }));
  };

  const handleSave = async () => {
    // Перевіряємо, чи є хоча б одне ім'я
    if (!deliveryType.names || Object.keys(deliveryType.names).length === 0) {
      alert("Додайте хоча б одну назву.");
      return;
    }

    setSaving(true);
    // Видаляємо застарілі поля 'name' та 'comment' перед відправкою
    const { name, comment, ...dataToSend } = deliveryType;

    try {
      if (isCreating) {
        await deliveryTypeService.create(
          dataToSend as Omit<DeliveryType, "id">
        );
        alert("Тип доставки успішно створено!");
      } else {
        await deliveryTypeService.update(
          id as string,
          dataToSend as DeliveryType
        );
        alert("Зміни успішно збережено!");
      }
      router.push("/deliveryTypePage");
    } catch (error) {
      console.error("Error saving delivery type:", error);
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
          {isCreating ? "Створення типу доставки" : "Редагування типу доставки"}
        </h1>

        {/* Використовуємо наш новий компонент для назв */}
        <LocalizedContentEditor
          label="Назви"
          content={deliveryType.names}
          onContentChange={handleNamesChange}
        />

        {/* Використовуємо наш новий компонент для коментарів */}
        <LocalizedContentEditor
          label="Коментарі"
          content={deliveryType.comments}
          onContentChange={handleCommentsChange}
        />

        {/* Решта полів */}
        <div className="pt-6 border-t space-y-6">
          <Input
            label="Ціна"
            name="price"
            type="number"
            value={deliveryType.price?.toString() ?? "0"}
            onChange={handleSimpleInputChange}
            placeholder="Введіть ціну"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">₴</span>
              </div>
            }
            min={0}
            step={0.01}
            size="lg"
          />

          <Select
            label="Статус"
            selectedKeys={new Set([deliveryType.isActive ? "true" : "false"])}
            onSelectionChange={handleActiveChange}
            size="lg"
          >
            <SelectItem key="true">Активний</SelectItem>
            <SelectItem key="false">Неактивний</SelectItem>
          </Select>
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
            {isSaving ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTypePage;
