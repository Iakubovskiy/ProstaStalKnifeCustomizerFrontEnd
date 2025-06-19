import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css"; // Перевірте шлях

import { Input, Select, SelectItem, Spinner, Button } from "@nextui-org/react";

import DeliveryTypeService from "@/app/services/DeliveryTypeService";
import { getLocaleFromCookies } from "@/app/config";

const initialDeliveryTypeData: Omit<DeliveryType, "id"> = {
  name: "",
  names: {},
  price: 0,
  comment: "",
  comments: {},
  isActive: true,
};

const DeliveryTypePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const locale = getLocaleFromCookies();
  const [deliveryType, setDeliveryType] = useState<Partial<DeliveryType>>(
    initialDeliveryTypeData
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isCreating = id === "0";

  const deliveryTypeService = useMemo(() => new DeliveryTypeService(), []);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const fetchDeliveryType = async () => {
      if (isCreating) {
        setDeliveryType(initialDeliveryTypeData);
        setLoading(false);
        return;
      }
      if (id) {
        try {
          setLoading(true);
          // Сервіс сам перетворює отриманий DTO на зручну для нас модель DeliveryType
          const fetchedDeliveryType = await deliveryTypeService.getById(
            id as string
          );
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryType((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleActiveChange = (keys: any) => {
    const value = Array.from(keys).join("");
    setDeliveryType((prev) => ({
      ...prev,
      isActive: value === "true",
    }));
  };

  const handleSave = async () => {
    if (!deliveryType.name) {
      alert("Назва є обов'язковим полем.");
      return;
    }

    setSaving(true);
    try {
      // КЛЮЧОВИЙ МОМЕНТ:
      // Ми передаємо в сервіс наш простий об'єкт стану `deliveryType`.
      // А вже сам сервіс (методи .create та .update) перетворить його
      // на DeliveryTypeDTO перед відправкою на сервер.
      if (isCreating) {
        await deliveryTypeService.create(
          deliveryType as Omit<DeliveryType, "id">
        );
        alert("Тип доставки успішно створено!");
      } else {
        await deliveryTypeService.update(
          id as string,
          deliveryType as DeliveryType
        );
        alert("Зміни успішно збережено!");
      }
      router.push("/admin/deliveryTypePage");
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
        <Spinner size="lg" color="warning" label="Завантаження даних..." />
      </div>
    );
  }

  // Решта коду без змін, він коректно працює з моделлю deliveryType
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isCreating
            ? "Створення нового типу доставки"
            : "Редагування типу доставки"}
        </h1>

        <Input
          isRequired
          label="Назва"
          name="name"
          value={deliveryType.name || ""}
          onChange={handleInputChange}
          placeholder="Наприклад, 'Кур'єром по місту'"
          size="lg"
        />

        <Input
          label="Ціна"
          name="price"
          type="number"
          value={deliveryType.price?.toString() ?? "0"}
          onChange={handleInputChange}
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

        <Input
          label="Коментар"
          name="comment"
          value={deliveryType.comment ?? ""}
          onChange={handleInputChange}
          placeholder="Додаткова інформація для клієнта"
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
