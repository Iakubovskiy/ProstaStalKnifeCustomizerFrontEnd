import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";

import {
    Spinner,
    Button,
    Switch,
    Autocomplete,
    AutocompleteItem,
    Chip
} from "@nextui-org/react";
import EngravingService from "@/app/services/EngravingService";
import FileUpload from "@/app/components/FileUpload/FileUpload";
import LocalizedContentEditor from "@/app/components/LocalizedContentEditor/LocalizedContentEditor";
import { Engraving } from "@/app/Interfaces/Engraving";
import { EngravingTag } from "@/app/Interfaces/EngravingTag";
import { EngravingDTO } from "@/app/DTOs/EngravingDTO";
import { AppFile } from "@/app/Interfaces/File";
import EngravingTagService from "@/app/services/EngravingTagService";

const initialEngravingData: Partial<Engraving> = {
    names: {},
    descriptions: {},
    isActive: true,
    tags: [],
    picture: undefined,
    position: { locationX: 0, locationY: 0, locationZ: 0 },
    rotation: { rotationX: 0, rotationY: 0, rotationZ: 0 },
    scale: { scaleX: 10, scaleY: 10, scaleZ: 10 },
};

const EngravingPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [engraving, setEngraving] =
        useState<Partial<Engraving>>(initialEngravingData);
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);
    const [allTags, setAllTags] = useState<EngravingTag[]>([]);
    const [tagSearch, setTagSearch] = useState("");

    const isCreating = id === "0";
    const engravingService = useMemo(() => new EngravingService(), []);
    const tagService = useMemo(() => new EngravingTagService(), []);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchDropdownData = async () => {
            try {
                const tagsData = await tagService.getAll();
                setAllTags(tagsData);
            } catch (error) {
                console.error("Помилка завантаження тегів:", error);
            }
        };
        fetchDropdownData();

        if (isCreating) {
            setEngraving(initialEngravingData);
            setLoading(false);
            return;
        }

        if (id) {
            engravingService
                .getById(id as string)
                .then((data) => {
                    setEngraving(data);
                })
                .catch((err) => {
                    console.error("Помилка завантаження гравіювання:", err);
                    router.push("/engraving-library/0");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router.isReady]);

    const handleFieldChange = <K extends keyof Engraving>(
        field: K,
        value: Engraving[K]
    ) => {
        setEngraving((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (tagId: string | number) => {
        const tagToAdd = allTags.find(t => t.id === tagId);
        if (tagToAdd && !engraving.tags?.some(t => t.id === tagId)) {
            handleFieldChange("tags", [...(engraving.tags || []), tagToAdd]);
        }
    };

    const handleRemoveTag = (tagId: string) => {
        const updatedTags = (engraving.tags || []).filter(t => t.id !== tagId);
        handleFieldChange("tags", updatedTags);
    };

    const availableTags = useMemo(() => {
        const selectedTagIds = new Set(engraving.tags?.map(t => t.id));
        return allTags.filter(t => !selectedTagIds.has(t.id));
    }, [allTags, engraving.tags]);

    const handleSave = async () => {
        if (!engraving.names?.["ua"] || !engraving.picture || !engraving.pictureForLaser) {
            alert("Будь ласка, заповніть Назву (ua) та завантажте зображення.");
            return;
        }
        setSaving(true);
        const dto: EngravingDTO = {
            isActive: engraving.isActive ?? true,
            names: engraving.names,
            descriptions: engraving.descriptions,
            pictureId: engraving.picture.id,
            pictureForLaserId: engraving.pictureForLaser.id,
            tagsIds: engraving.tags?.map((tag) => tag.id) || [],
            locationX: engraving.position?.locationX ?? 0,
            locationY: engraving.position?.locationY ?? 0,
            locationZ: engraving.position?.locationX ?? 0,
            rotationX: engraving.rotation?.rotationX ?? 0,
            rotationY: engraving.rotation?.rotationY ?? 0,
            rotationZ: engraving.rotation?.rotationZ ?? 0,
            scaleX: engraving.scale?.scaleX ?? 10,
            scaleY: engraving.scale?.scaleY ?? 10,
            scaleZ: engraving.scale?.scaleZ ?? 10,
            side: 1,
        };
        try {
            if (isCreating) {
                await engravingService.create(dto);
                alert("Гравіювання успішно створено!");
            } else {
                await engravingService.update(id as string, dto);
                alert("Зміни успішно збережено!");
            }
            router.push("/engraving-library");
        } catch (error) {
            console.error("Помилка збереження гравіювання:", error);
            alert(`Сталася помилка: ${error instanceof Error ? error.message : String(error)}`);
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
                    {isCreating ? "Створення гравіювання" : "Редагування гравіювання"}
                </h1>

                <LocalizedContentEditor label="Назви" content={engraving.names} onContentChange={(c) => handleFieldChange("names", c)} />
                <LocalizedContentEditor label="Описи (необов'язково)" content={engraving.descriptions} onContentChange={(c) => handleFieldChange("descriptions", c)} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                        <Autocomplete
                            label="Додати тег"
                            placeholder="Почніть вводити для пошуку..."

                            inputValue={tagSearch}
                            onInputChange={setTagSearch}

                            items={availableTags.filter(tag =>
                                tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                            )}

                            onSelectionChange={(key) => {
                                if (key) {
                                    handleAddTag(key);
                                    setTagSearch("");
                                }
                            }}
                        >
                            {(tag) => (
                                <AutocompleteItem key={tag.id} textValue={tag.name}>
                                    {tag.name}
                                </AutocompleteItem>
                            )}
                        </Autocomplete>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Вибрані теги:</label>
                            {engraving.tags && engraving.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-100 rounded-lg">
                                    {engraving.tags.map(tag => (
                                        <Chip
                                            key={tag.id}
                                            onClose={() => handleRemoveTag(tag.id)}
                                            variant="flat"
                                            color="primary"
                                        >
                                            {tag.name}
                                        </Chip>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 mt-2 p-3 bg-gray-100 rounded-lg">
                                    Теги не вибрано
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <Switch isSelected={!!engraving.isActive} onValueChange={(v) => handleFieldChange("isActive", v)}>
                            Активне
                        </Switch>
                    </div>
                </div>

                <div className="grid grid-cols-1 pt-4 border-t">
                    <FileUpload label="Зображення гравіювання" currentFile={engraving.picture as AppFile} onFileChange={(f) => handleFieldChange("picture", f!)} isRequired />
                </div>
                <div className="grid grid-cols-1 pt-4 border-t">
                    <FileUpload label="Файл гравіювання для лазера" currentFile={engraving.pictureForLaser as AppFile} onFileChange={(f) => handleFieldChange("pictureForLaser", f!)} isRequired />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button color="danger" variant="flat" onClick={() => router.back()} fullWidth>Скасувати</Button>
                    <Button color="primary" onClick={handleSave} isLoading={isSaving} fullWidth>Зберегти</Button>
                </div>
            </div>
        </div>
    );
};

export default EngravingPage;