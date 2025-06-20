import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Spinner, Button } from "@nextui-org/react";
import ProductTagService from "@/app/services/ProductTagService";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";

const initialData: Omit<ProductTag, "id" | "name"> = {
  names: {},
};

const ProductTagPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [productTag, setProductTag] =
    useState<Partial<ProductTag>>(initialData);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);

  const isCreating = id === "0";
  const productTagService = useMemo(() => new ProductTagService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    if (isCreating) {
      setProductTag(initialData);
      setLoading(false);
      return;
    }

    if (id) {
      productTagService
        .getById(id as string)
        .then((data) => setProductTag(data))
        .catch((err) => {
          console.error("Помилка завантаження тегу:", err);
          alert("Помилка завантаження даних");
          router.push("/product-tag/0");
        })
        .finally(() => setLoading(false));
    }
  }, [id, router.isReady, isCreating, productTagService, router]);

  const handleNamesChange = (newNames: LocalizedContent) => {
    setProductTag((prev) => ({ ...prev, names: newNames }));
  };

  const handleSave = async () => {
    if (
      !productTag.names ||
      Object.keys(productTag.names).length === 0 ||
      !productTag.names["ua"]
    ) {
      alert("Назва для української локалі ('ua') є обов'язковою.");
      return;
    }

    setSaving(true);
    const { name, ...dataToSend } = productTag;

    try {
      if (isCreating) {
        await productTagService.create(dataToSend as Omit<ProductTag, "id">);
        alert("Тег успішно створено!");
      } else {
        await productTagService.update(id as string, dataToSend as ProductTag);
        alert("Зміни успішно збережено!");
      }
      router.push("/product-tag");
    } catch (error) {
      console.error("Помилка збереження тегу:", error);
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
          {isCreating ? "Створення тегу продукту" : "Редагування тегу продукту"}
        </h1>

        <LocalizedContentEditor
          label="Назви тегу"
          content={productTag.names}
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
          >
            {isSaving ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductTagPage;
