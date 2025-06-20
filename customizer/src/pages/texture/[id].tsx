// /pages/admin/texture/[id].tsx

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Input, Spinner, Button } from "@nextui-org/react";
import TextureService from "@/app/services/TextureService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import { AppFile } from "@/app/Interfaces/File";
import { Texture } from "@/app/Interfaces/Texture";

const emptyFile: AppFile = { id: "", fileUrl: "" };

const initialTextureData: Omit<Texture, "id"> = {
  name: "",
  normalMap: emptyFile,
  roughnessMap: emptyFile,
};

const TexturePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [texture, setTexture] = useState<Partial<Texture>>(initialTextureData);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isCreating = id === "0";
  const textureService = useMemo(() => new TextureService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchTexture = async () => {
      if (isCreating) {
        setTexture(initialTextureData);
        setLoading(false);
        return;
      }

      if (id) {
        try {
          setLoading(true);
          const fetchedTexture = await textureService.getById(id as string);
          setTexture(fetchedTexture);
        } catch (error) {
          console.error("Error fetching texture:", error);
          alert("Помилка завантаження текстури");
          router.push("/texture/0");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTexture();
  }, [id, router.isReady, isCreating, textureService, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTexture((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange =
    (fieldName: "normalMap" | "roughnessMap") => (file: AppFile | null) => {
      setTexture((prev) => ({ ...prev, [fieldName]: file }));
    };

  const handleSave = async () => {
    if (!texture.name || !texture.normalMap || !texture.roughnessMap) {
      alert("Всі поля є обов'язковими.");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        await textureService.create(texture as Omit<Texture, "id">);
        alert("Текстуру успішно створено!");
      } else {
        await textureService.update(id as string, texture as Texture);
        alert("Зміни успішно збережено!");
      }
      router.push("/texture");
    } catch (error) {
      console.error("Помилка збереження текстури:", error);
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
          {isCreating ? "Створення нової текстури" : "Редагування текстури"}
        </h1>

        {/* Основна інформація */}
        <Input
          label="Назва текстури"
          name="name"
          value={texture.name || ""}
          onChange={handleInputChange}
          placeholder="Наприклад, 'Дерево 1'"
          size="lg"
          isRequired
        />

        {/* Файли текстур */}
        <div className="pt-6 border-t space-y-6">
          <FileUpload
            label="Normal Map"
            currentFile={texture.normalMap}
            onFileChange={handleFileChange("normalMap")}
            isRequired
          />

          <FileUpload
            label="Roughness Map"
            currentFile={texture.roughnessMap}
            onFileChange={handleFileChange("roughnessMap")}
            isRequired
          />
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

export default TexturePage;
