import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Spinner, Button, Input } from "@nextui-org/react";
import CurrencyService from "@/app/services/CurrencyService";
import { Currency } from "@/app/Interfaces/Currency";

const initialData: Omit<Currency, "id"> = {
    name: "",
    exchangeRate: 0,
};

const CurrencyPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [currency, setCurrency] = useState<Omit<Currency, "id">>(initialData);
    const [isLoading, setLoading] = useState(true);
    const [isSaving, setSaving] = useState(false);

    const isCreating = id === "0";
    const currencyService = useMemo(() => new CurrencyService(), []);

    useEffect(() => {
        if (!router.isReady) return;

        if (isCreating) {
            setCurrency(initialData);
            setLoading(false);
            return;
        }

        if (id) {
            currencyService
                .getById(id as string)
                .then((data) => setCurrency(data))
                .catch((err) => {
                    console.error("Помилка завантаження валюти:", err);
                    alert("Помилка завантаження даних");
                    router.push("/currencies/0");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router.isReady, isCreating, currencyService, router]);

    const handleSave = async () => {
        if (!currency.name || currency.exchangeRate <= 0) {
            alert("Будь ласка, заповніть усі поля коректно.");
            return;
        }

        setSaving(true);

        try {
            if (isCreating) {
                await currencyService.create(currency);
                alert("Валюту успішно створено!");
            } else {
                await currencyService.update(id as string, currency);
                alert("Зміни успішно збережено!");
            }
            router.push("/currencies");
        } catch (error) {
            console.error("Помилка збереження валюти:", error);
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
            <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    {isCreating ? "Створення валюти" : "Редагування валюти"}
                </h1>

                <div className="space-y-4">
                    <Input
                        label="Назва валюти"
                        value={currency.name || ""}
                        onChange={(e) => setCurrency({ ...currency, name: e.target.value })}
                        isRequired
                    />
                    <Input
                        label="Обмінний курс"
                        type="number"
                        value={String(currency.exchangeRate || 0)}
                        onChange={(e) =>
                            setCurrency({
                                ...currency,
                                exchangeRate: parseFloat(e.target.value) || 0,
                            })
                        }
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

export default CurrencyPage;