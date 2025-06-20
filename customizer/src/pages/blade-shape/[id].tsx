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
import BladeShapeService from "@/app/services/BladeShapeService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import BladeShapeTypeService from "@/app/services/BladeShapeTypeService";
import SheathService from "@/app/services/SheathService";
import { BladeShape } from "@/app/Interfaces/BladeShape";
import { BladeShapeDTO } from "@/app/DTOs/BladeShapeDTO";
import { Sheath } from "@/app/Interfaces/Sheath";
import { AppFile } from "@/app/Interfaces/File";

const initialBladeShapeData: Partial<BladeShape> = {
  names: {},
  price: 0,
  isActive: true,
  shapeType: undefined,
  sheath: undefined,
  bladeShapeImage: undefined,
  bladeShapeModel: undefined,
  bladeCharacteristicsModel: {
    totalLength: 0,
    bladeLength: 0,
    bladeWidth: 0,
    bladeWeight: 0,
    sharpeningAngle: 0,
    rockwellHardnessUnits: 0,
  },
};

const BladeShapePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [bladeShape, setBladeShape] = useState<Partial<BladeShape>>(
      initialBladeShapeData
  );
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [bladeShapeTypes, setBladeShapeTypes] = useState<BladeShapeType[]>([]);
  const [sheaths, setSheaths] = useState<Sheath[]>([]);

  const isCreating = id === "0";
  const bladeShapeService = useMemo(() => new BladeShapeService(), []);
  const bladeShapeTypeService = useMemo(
      () => new BladeShapeTypeService(),
      []
  );
  const sheathService = useMemo(() => new SheathService(), []);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchDropdownData = async () => {
      try {
        const [typesData, sheathsData] = await Promise.all([
          bladeShapeTypeService.getAll(),
          sheathService.getAll(),
        ]);
        setBladeShapeTypes(typesData);
        setSheaths(sheathsData);
      } catch (error) {
        console.error("Помилка завантаження даних для форми:", error);
      }
    };

    fetchDropdownData();

    if (isCreating) {
      setBladeShape(initialBladeShapeData);
      setLoading(false);
      return;
    }

    if (id) {
      bladeShapeService
          .getById(id as string)
          .then((data) => {
            setBladeShape(data);
          })
          .catch((err) => {
            console.error("Помилка завантаження форми леза:", err);
            router.push("/blade-shape/0");
          })
          .finally(() => setLoading(false));
    }
  }, [id, router.isReady]);

  const handleFieldChange = <K extends keyof BladeShape>(
      field: K,
      value: BladeShape[K]
  ) => {
    setBladeShape((prev) => ({ ...prev, [field]: value }));
  };

  const handleCharacteristicsChange = (
      field: keyof BladeShape["bladeCharacteristicsModel"],
      value: number
  ) => {
    setBladeShape((prev) => ({
      ...prev,
      bladeCharacteristicsModel: {
        ...prev.bladeCharacteristicsModel!,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (
        !bladeShape.shapeType ||
        !bladeShape.names?.["ua"] ||
        !bladeShape.bladeShapeImage ||
        !bladeShape.bladeShapeModel
    ) {
      alert(
          "Будь ласка, заповніть усі обов'язкові поля: Назва (ua), Тип, Фото та Модель."
      );
      return;
    }

    setSaving(true);

    const dto: BladeShapeDTO = {
      isActive: bladeShape.isActive ?? true,
      names: bladeShape.names,
      price: bladeShape.price ?? 0,
      typeId: bladeShape.shapeType.id,
      sheathId: bladeShape.sheath?.id || null,
      bladeShapePhotoId: bladeShape.bladeShapeImage.id,
      bladeShapeModelId: bladeShape.bladeShapeModel.id,
      totalLength: bladeShape.bladeCharacteristicsModel?.totalLength ?? 0,
      bladeLength: bladeShape.bladeCharacteristicsModel?.bladeLength ?? 0,
      bladeWidth: bladeShape.bladeCharacteristicsModel?.bladeWidth ?? 0,
      bladeWeight: bladeShape.bladeCharacteristicsModel?.bladeWeight ?? 0,
      sharpeningAngle: bladeShape.bladeCharacteristicsModel?.sharpeningAngle ?? 0,
      rockwellHardnessUnits:
          bladeShape.bladeCharacteristicsModel?.rockwellHardnessUnits ?? 0,
    };

    try {
      if (isCreating) {
        await bladeShapeService.create(dto);
        alert("Форму леза успішно створено!");
      } else {
        await bladeShapeService.update(id as string, dto);
        alert("Зміни успішно збережено!");
      }
      router.push("/blade-shape");
    } catch (error) {
      console.error("Помилка збереження:", error);
      alert(
          `Сталася помилка: ${
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
          <Spinner size="lg" />
        </div>
    );
  }

  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            {isCreating ? "Створення форми леза" : "Редагування форми леза"}
          </h1>

          <LocalizedContentEditor
              label="Назви"
              content={bladeShape.names}
              onContentChange={(c) => handleFieldChange("names", c)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <Input
                label="Ціна"
                type="number"
                value={String(bladeShape.price || 0)}
                onChange={(e) =>
                    handleFieldChange("price", parseFloat(e.target.value) || 0)
                }
                startContent={<span>₴</span>}
            />
            <Select
                label="Тип форми"
                placeholder="Виберіть тип"
                selectedKeys={bladeShape.shapeType ? [bladeShape.shapeType.id] : []}
                onSelectionChange={(keys) => {
                  const selectedId = Array.from(keys)[0];
                  const selectedType = bladeShapeTypes.find(
                      (t) => t.id === selectedId
                  );
                  if (selectedType) {
                    handleFieldChange("shapeType", selectedType);
                  }
                }}
                isRequired
            >
              {bladeShapeTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
              ))}
            </Select>
            <Select
                label="Піхви (необов'язково)"
                placeholder="Виберіть піхви"
                selectedKeys={bladeShape.sheath ? [bladeShape.sheath.id] : []}
                onSelectionChange={(keys) => {
                  const selectedId = Array.from(keys)[0];
                  const selectedSheath =
                      sheaths.find((s) => s.id === selectedId) || null;
                  handleFieldChange("sheath", selectedSheath);
                }}
            >
              {sheaths.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
              ))}
            </Select>
            <div className="flex items-center">
              <Switch
                  isSelected={!!bladeShape.isActive}
                  onValueChange={(v) => handleFieldChange("isActive", v)}
              >
                Активна
              </Switch>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-4">Характеристики</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                  label="Загальна довжина (мм)"
                  type="number"
                  value={String(bladeShape.bladeCharacteristicsModel?.totalLength || 0)}
                  onChange={(e) =>
                      handleCharacteristicsChange(
                          "totalLength",
                          parseFloat(e.target.value) || 0
                      )
                  }
              />
              <Input
                  label="Довжина леза (мм)"
                  type="number"
                  value={String(bladeShape.bladeCharacteristicsModel?.bladeLength || 0)}
                  onChange={(e) =>
                      handleCharacteristicsChange(
                          "bladeLength",
                          parseFloat(e.target.value) || 0
                      )
                  }
              />
              <Input
                  label="Ширина леза (мм)"
                  type="number"
                  value={String(bladeShape.bladeCharacteristicsModel?.bladeWidth || 0)}
                  onChange={(e) =>
                      handleCharacteristicsChange(
                          "bladeWidth",
                          parseFloat(e.target.value) || 0
                      )
                  }
              />
              <Input
                  label="Вага леза (г)"
                  type="number"
                  value={String(bladeShape.bladeCharacteristicsModel?.bladeWeight || 0)}
                  onChange={(e) =>
                      handleCharacteristicsChange(
                          "bladeWeight",
                          parseFloat(e.target.value) || 0
                      )
                  }
              />
              <Input
                  label="Кут заточки (°)"
                  type="number"
                  value={String(bladeShape.bladeCharacteristicsModel?.sharpeningAngle || 0)}
                  onChange={(e) =>
                      handleCharacteristicsChange(
                          "sharpeningAngle",
                          parseFloat(e.target.value) || 0
                      )
                  }
              />
              <Input
                  label="Твердість (HRC)"
                  type="number"
                  value={String(
                      bladeShape.bladeCharacteristicsModel?.rockwellHardnessUnits || 0
                  )}
                  onChange={(e) =>
                      handleCharacteristicsChange(
                          "rockwellHardnessUnits",
                          parseFloat(e.target.value) || 0
                      )
                  }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <FileUpload
                label="Фото форми леза"
                currentFile={bladeShape.bladeShapeImage as AppFile}
                onFileChange={(f) => handleFieldChange("bladeShapeImage", f!)}
                isRequired
            />
            <FileUpload
                label="3D модель форми леза"
                currentFile={bladeShape.bladeShapeModel as AppFile}
                onFileChange={(f) => handleFieldChange("bladeShapeModel", f!)}
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
              Зберегти
            </Button>
          </div>
        </div>
      </div>
  );
};

export default BladeShapePage;