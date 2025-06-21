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
import SheathService from "@/app/services/SheathService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import BladeShapeTypeService from "@/app/services/BladeShapeTypeService";
import { Sheath } from "@/app/Interfaces/Sheath";
import { SheathDTO } from "@/app/DTOs/SheathDTO";
import { AppFile } from "@/app/Interfaces/File";

const initialData: Partial<Sheath> = {
    names: {},
    price: 0,
    isActive: true,
    type: undefined,
    model: undefined,
};

const SheathPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [sheath, setSheath] = useState<Partial<Sheath>>(initialData);
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);
    const [bladeShapeTypes, setBladeShapeTypes] = useState<BladeShapeType[]>([]);

    const isCreating = id === "0";
    const sheathService = useMemo(() => new SheathService(), []);
    const bladeShapeTypeService = useMemo(() => new BladeShapeTypeService(), []);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchDropdownData = async () => {
            try {
                const typesData = await bladeShapeTypeService.getAll();
                setBladeShapeTypes(typesData);
            } catch (error) {
                console.error("Помилка завантаження типів:", error);
            }
        };

        fetchDropdownData();

        if (isCreating) {
            setSheath(initialData);
            setLoading(false);
            return;
        }

        if (id) {
            sheathService
                .getById(id as string)
                .then((data) => {
                    setSheath(data);
                })
                .catch((err) => {
                    console.error("Помилка завантаження піхов:", err);
                    router.push("/sheath/0");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router.isReady]);

    const handleFieldChange = <K extends keyof Sheath>(
        field: K,
        value: Sheath[K]
    ) => {
        setSheath((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!sheath.type || !sheath.names?.["ua"]) {
            alert("Будь ласка, заповніть Назву (ua) та Тип.");
            return;
        }

        setSaving(true);

        const dto: SheathDTO = {
            isActive: sheath.isActive ?? true,
            names: sheath.names,
            price: sheath.price ?? 0,
            typeId: sheath.type.id,
            sheathModelId: sheath.model?.id || null,
        };

        try {
            if (isCreating) {
                await sheathService.create(dto);
                alert("Піхви успішно створено!");
            } else {
                await sheathService.update(id as string, dto);
                alert("Зміни успішно збережено!");
            }
            router.push("/sheath");
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    {isCreating ? "Створення нових піхов" : "Редагування піхов"}
                </h1>

                <LocalizedContentEditor
                    label="Назви"
                    content={sheath.names}
                    onContentChange={(c) => handleFieldChange("names", c)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <Input
                        label="Ціна"
                        type="number"
                        value={String(sheath.price || 0)}
                        onChange={(e) =>
                            handleFieldChange("price", parseFloat(e.target.value) || 0)
                        }
                        startContent={<span>₴</span>}
                    />
                    <Select
                        label="Тип форми"
                        placeholder="Виберіть тип"
                        selectedKeys={sheath.type ? [sheath.type.id] : []}
                        onSelectionChange={(keys) => {
                            const selectedId = Array.from(keys)[0] as string;
                            const selectedType = bladeShapeTypes.find(
                                (t) => t.id === selectedId
                            );
                            if (selectedType) {
                                handleFieldChange("type", selectedType);
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
                    <div className="flex items-center">
                        <Switch
                            isSelected={!!sheath.isActive}
                            onValueChange={(v) => handleFieldChange("isActive", v)}
                        >
                            Активні
                        </Switch>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <FileUpload
                        label="3D модель піхов"
                        currentFile={sheath.model as AppFile}
                        onFileChange={(f) => handleFieldChange("model", f)}
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

export default SheathPage;