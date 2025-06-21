import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Spinner, Button, Input } from "@nextui-org/react";
import BladeShapeTypeService from "@/app/services/BladeShapeTypeService";
import {BladeShapeTypeDTO} from "@/app/DTOs/BladeShapeTypeDTO";

const initialData: Partial<BladeShapeType> = {
    name: "",
};

const BladeShapeTypePage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [bladeShapeType, setBladeShapeType] =
        useState<Partial<BladeShapeType>>(initialData);
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);

    const isCreating = id === "0";
    const bladeShapeTypeService = useMemo(() => new BladeShapeTypeService(), []);

    useEffect(() => {
        if (!router.isReady) return;

        if (isCreating) {
            setBladeShapeType(initialData);
            setLoading(false);
            return;
        }

        if (id) {
            bladeShapeTypeService
                .getById(id as string)
                .then((data) => setBladeShapeType(data))
                .catch((err) => {
                    console.error("Помилка завантаження типу:", err);
                    alert("Помилка завантаження даних");
                    router.push("/blade-shape-type/0");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router.isReady, isCreating, bladeShapeTypeService, router]);

    const handleSave = async () => {
        if (!bladeShapeType.name) {
            alert("Назва є обов'язковою.");
            return;
        }

        setSaving(true);
        const dtoToSend: BladeShapeTypeDTO = {
            name: bladeShapeType.name,
        };

        try {
            if (isCreating) {
                await bladeShapeTypeService.create(dtoToSend);
                alert("Тип успішно створено!");
            } else {
                await bladeShapeTypeService.update(id as string, dtoToSend);
                alert("Зміни успішно збережено!");
            }
            router.push("/blade-shape-type");
        } catch (error) {
            console.error("Помилка збереження типу:", error);
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-4">
            <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    {isCreating ? "Створення типу форми леза" : "Редагування типу"}
                </h1>

                <Input
                    label="Назва типу"
                    value={bladeShapeType.name || ""}
                    onChange={(e) =>
                        setBladeShapeType({ ...bladeShapeType, name: e.target.value })
                    }
                    isRequired
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

export default BladeShapeTypePage;