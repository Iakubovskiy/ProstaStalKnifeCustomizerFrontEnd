import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Spinner, Button } from "@nextui-org/react";
import EngravingTagService from "@/app/services/EngravingTagService";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import type { EngravingTag } from "@/app/Interfaces/EngravingTag";
import type { EngravingTagDTO } from "@/app/DTOs/EngravingTagDTO";

const initialData: Omit<EngravingTag, "id" | "name"> = {
    names: {},
};

const EngravingTagPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [engravingTag, setEngravingTag] =
        useState<Partial<EngravingTag>>(initialData);
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);

    const isCreating = id === "0";
    const engravingTagService = useMemo(() => new EngravingTagService(), []);

    useEffect(() => {
        if (!router.isReady) return;

        if (isCreating) {
            setEngravingTag(initialData);
            setLoading(false);
            return;
        }

        if (id) {
            engravingTagService
                .getById(id as string)
                .then((data) => setEngravingTag(data))
                .catch((err) => {
                    console.error("Помилка завантаження тегу гравіювання:", err);
                    alert("Помилка завантаження даних");
                    router.push("/engraving-tag/0");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router.isReady, isCreating, engravingTagService, router]);

    const handleNamesChange = (newNames: LocalizedContent) => {
        setEngravingTag((prev) => ({ ...prev, names: newNames }));
    };

    const handleSave = async () => {
        if (
            !engravingTag.names ||
            Object.keys(engravingTag.names).length === 0 ||
            !engravingTag.names["ua"]
        ) {
            alert("Назва для української локалі ('ua') є обов'язковою.");
            return;
        }

        setSaving(true);

        const dtoToSend: EngravingTagDTO = {
            names: engravingTag.names,
        };

        try {
            if (isCreating) {
                await engravingTagService.create(dtoToSend);
                alert("Тег гравіювання успішно створено!");
            } else {
                await engravingTagService.update(id as string, dtoToSend);
                alert("Зміни успішно збережено!");
            }
            router.push("/engraving-tag");
        } catch (error) {
            console.error("Помилка збереження тегу гравіювання:", error);
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
                    {isCreating
                        ? "Створення тегу гравіювання"
                        : "Редагування тегу гравіювання"}
                </h1>

                <LocalizedContentEditor
                    label="Назви тегу"
                    content={engravingTag.names}
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

export default EngravingTagPage;