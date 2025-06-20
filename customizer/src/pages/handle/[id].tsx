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
import HandleService from "@/app/services/HandleService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import ColorPicker from "@/app/components/ColorPicker/ColorPicker";

import TextureService from "@/app/services/TextureService";
import BladeShapeTypeService from "@/app/services/BladeShapeTypeService";
import { Texture } from "@/app/Interfaces/Texture";
import { Handle } from "@/app/Interfaces/Handle";

const initialHandleData: Partial<Handle> = {
  colors: {},
  colorCode: "#FFFFFF",
  isActive: true,
  materials: {},
  texture: null,
  colorMap: null,
  price: 0,
};

const HandlePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [handle, setHandle] = useState<Partial<Handle>>(initialHandleData);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [textures, setTextures] = useState<Texture[]>([]);
  const [bladeShapeTypes, setBladeShapeTypes] = useState<BladeShapeType[]>([]);
  const [selectedBladeShapeTypeId, setSelectedBladeShapeTypeId] = useState<string | null>(null);

  const isCreating = id === "0";
  const handleService = useMemo(() => new HandleService(), []);
  const textureService = useMemo(() => new TextureService(), []);
  const bladeShapeTypeService = useMemo(() => new BladeShapeTypeService(), []);

  useEffect(() => {
    // ... (код завантаження даних залишається без змін) ...
    if (!router.isReady) return;

    const fetchDropdownData = async () => {
      try {
        const [texturesData, bladeShapeTypesData] = await Promise.all([
          textureService.getAll(),
          bladeShapeTypeService.getAll(),
        ]);
        setTextures(texturesData);
        setBladeShapeTypes(bladeShapeTypesData);
      } catch (error) {
        console.error("Помилка завантаження даних для форми:", error);
      }
    };
    
    fetchDropdownData();

    if (isCreating) {
      setHandle(initialHandleData);
      setLoading(false);
      return;
    }

    if (id) {
      handleService
        .getById(id as string)
        .then((data) => {
          setHandle(data);
          setSelectedBladeShapeTypeId(data.bladeShapeTypeId); 
        })
        .catch((err) => {
          console.error("Помилка завантаження руків'я:", err);
          router.push("/handle/0");
        })
        .finally(() => setLoading(false));
    }
  }, [id, router.isReady]);

  const handleFieldChange = <K extends keyof Handle>(field: K, value: Handle[K]) => {
    setHandle((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // ... (код збереження залишається без змін) ...
    if (!selectedBladeShapeTypeId) {
      alert("Будь ласка, виберіть тип форми леза.");
      return;
    }

    setSaving(true);
    try {
      if (isCreating) {
        await handleService.create(handle as Omit<Handle, "id">, selectedBladeShapeTypeId);
        alert("Руків'я успішно створено!");
      } else {
        await handleService.update(id as string, handle as Handle, selectedBladeShapeTypeId);
        alert("Зміни успішно збережено!");
      }
      router.push("/handle");
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert(`Сталася помилка: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return <div className="flex min-h-screen items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          {isCreating ? "Створення нового руків'я" : "Редагування руків'я"}
        </h1>

        <LocalizedContentEditor
          label="Кольори"
          content={handle.colors}
          onContentChange={(c) => handleFieldChange("colors", c)}
        />
        <LocalizedContentEditor
          label="Матеріали"
          content={handle.materials}
          onContentChange={(m) => handleFieldChange("materials", m)}
        />

        <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --- 2. Замінюємо Input на ColorPicker --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Код кольору</label>
            <ColorPicker
              color={handle.colorCode || '#FFFFFF'}
              onChange={(color) => handleFieldChange('colorCode', color)}
            />
          </div>

          <Input
            label="Ціна"
            name="price"
            type="number"
            value={String(handle.price || 0)}
            onChange={(e) =>
              handleFieldChange("price", parseFloat(e.target.value) || 0)
            }
            startContent={<span>₴</span>}
          />

          <Select
            label="Тип форми леза"
            placeholder="Виберіть тип"
            selectedKeys={
              selectedBladeShapeTypeId ? [selectedBladeShapeTypeId] : []
            }
            onSelectionChange={(keys) =>
              setSelectedBladeShapeTypeId(Array.from(keys)[0] as string)
            }
            isRequired
          >
            {bladeShapeTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Текстура"
            placeholder="Виберіть текстуру"
            selectedKeys={handle.texture ? [handle.texture.id] : []}
            onSelectionChange={(keys) => {
              const selectedId = Array.from(keys)[0];
              const selectedTexture =
                textures.find((t) => t.id === selectedId) || null;
              handleFieldChange("texture", selectedTexture);
            }}
          >
            {textures.map((tex) => (
              <SelectItem key={tex.id} value={tex.id}>
                {tex.name}
              </SelectItem>
            ))}
          </Select>

          <div className="md:col-span-2">
            <FileUpload
              label="Color Map"
              currentFile={handle.colorMap}
              onFileChange={(f) => handleFieldChange("colorMap", f)}
            />
          </div>

          <div className="md:col-span-2 flex justify-start">
            <Switch
              isSelected={!!handle.isActive}
              onValueChange={(v) => handleFieldChange("isActive", v)}
            >
              Активний
            </Switch>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button color="danger" variant="flat" onClick={() => router.back()} fullWidth>Скасувати</Button>
          <Button color="primary" onClick={handleSave} isLoading={isSaving} fullWidth>Зберегти</Button>
        </div>
      </div>
    </div>
  );
};

export default HandlePage;