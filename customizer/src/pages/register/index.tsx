import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";
import { useTranslation } from "react-i18next";

import { Input, Button } from "@nextui-org/react";
import { Lock, Mail } from "lucide-react";
import UserService from "@/app/services/UserService";
import { RegisterDTO } from "@/app/DTOs/RegisterDTO";
import { APIError } from "@/app/errors/APIError";
import Link from "next/link";

const initialData: RegisterDTO = {
    email: "",
    password: "",
    passwordConfirmation: "",
    role: "User",
};

const RegisterPage = () => {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<RegisterDTO>(initialData);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const userService = useMemo(() => new UserService(), []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !userData.email ||
            !userData.password ||
            !userData.passwordConfirmation
        ) {
            setError(t("registerPage.errorFillFields"));
            return;
        }
        if (userData.password !== userData.passwordConfirmation) {
            setError(t("registerPage.errorPasswordsDoNotMatch"));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await userService.register(userData);

            const token = await userService.login({
                username: userData.email,
                password: userData.password,
            });

            if (typeof window !== "undefined") {
                localStorage.setItem("token", token);
            }
            router.push("/shop");
        } catch (err) {
            console.error("Помилка реєстрації:", err);
            if (err instanceof APIError) {
                setError(t("registerPage.errorUserExists"));
            } else {
                setError(t("registerPage.errorUnknown"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#b8845f]/20 shadow-lg">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-[#2d3748]">
                            {t("registerPage.title")}
                        </h1>
                        <p className="text-[#2d3748]/60 mt-2">
                            {t("registerPage.subtitle")}
                        </p>
                    </div>
                    <Input
                        label={t("registerPage.emailLabel")}
                        type="email"
                        value={userData.email || ""}
                        onValueChange={(value) => setUserData({ ...userData, email: value })}
                        startContent={
                            <Mail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        variant="bordered"
                        isRequired
                    />
                    <Input
                        label={t("registerPage.passwordLabel")}
                        type="password"
                        value={userData.password || ""}
                        onValueChange={(value) =>
                            setUserData({ ...userData, password: value })
                        }
                        startContent={
                            <Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        variant="bordered"
                        isRequired
                    />
                    <Input
                        label={t("registerPage.passwordConfirmationLabel")}
                        type="password"
                        value={userData.passwordConfirmation || ""}
                        onValueChange={(value) =>
                            setUserData({ ...userData, passwordConfirmation: value })
                        }
                        startContent={
                            <Lock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        variant="bordered"
                        isRequired
                    />

                    {error && (
                        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        color="primary"
                        fullWidth
                        isLoading={isLoading}
                        className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white font-semibold mt-4"
                    >
                        {isLoading
                            ? t("registerPage.submitButtonLoading")
                            : t("registerPage.submitButton")}
                    </Button>

                    <div className="text-center text-sm text-gray-600">
                        <span>{t("registerPage.alreadyHaveAccount")}</span>
                        <Link
                            href="/login"
                            className="font-medium text-[#8b7258] hover:underline"
                        >
                            {t("registerPage.loginLink")}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;