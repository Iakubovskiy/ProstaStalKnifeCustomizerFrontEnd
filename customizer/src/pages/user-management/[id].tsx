import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";

import { Spinner, Button, Input } from "@nextui-org/react";
import UserService from "@/app/services/UserService";
import { RegisterDTO } from "@/app/DTOs/RegisterDTO";

const initialData: RegisterDTO = {
    email: "",
    password: "",
    passwordConfirmation: "",
    role: "Admin",
};

const UserCreatePage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [userData, setUserData] = useState<RegisterDTO>(initialData);
    const [isLoading, setLoading] = useState(false);
    const [isSaving, setSaving] = useState(false);

    const isCreating = id === "0";
    const userService = useMemo(() => new UserService(), []);

    useEffect(() => {
        if (id !== "0") {
            router.push("/user-management");
        } else {
            setLoading(false);
        }
    }, [id, router]);

    const handleSave = async () => {
        if (
            !userData.email ||
            !userData.password ||
            !userData.passwordConfirmation
        ) {
            alert("Будь ласка, заповніть усі поля.");
            return;
        }
        if (userData.password !== userData.passwordConfirmation) {
            alert("Паролі не співпадають.");
            return;
        }

        setSaving(true);

        try {
            await userService.registerAdmin(userData);
            alert("Адміністратора успішно створено!");
            router.push("/user-management");
        } catch (error) {
            console.error("Помилка створення адміністратора:", error);
            alert("Сталася помилка під час створення.");
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

    if (!isCreating) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Створення нового адміністратора
                </h1>

                <div className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={userData.email || ""}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        isRequired
                    />
                    <Input
                        label="Пароль"
                        type="password"
                        value={userData.password || ""}
                        onChange={(e) =>
                            setUserData({ ...userData, password: e.target.value })
                        }
                        isRequired
                    />
                    <Input
                        label="Підтвердження пароля"
                        type="password"
                        value={userData.passwordConfirmation || ""}
                        onChange={(e) =>
                            setUserData({ ...userData, passwordConfirmation: e.target.value })
                        }
                        isRequired
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        color="danger"
                        variant="flat"
                        onClick={() => router.push("/user-management")}
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
                        {isSaving ? "Створення..." : "Створити"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserCreatePage;