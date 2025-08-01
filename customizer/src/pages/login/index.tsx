import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import "../../styles/globals.css";
import { useTranslation } from "react-i18next";

import { Input, Button } from "@nextui-org/react";
import { User, Lock } from "lucide-react";
import UserService from "@/app/services/UserService";
import { LoginDTO } from "@/app/DTOs/LoginDTO";
import { APIError } from "@/app/errors/APIError";
import Link from "next/link";

const LoginPage = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const userService = useMemo(() => new UserService(), []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError(t("loginPage.errorFillFields"));
            return;
        }

        setLoading(true);
        setError(null);

        const dto: LoginDTO = { username, password };

        try {
            const token = await userService.login(dto);
            if (typeof window !== "undefined") {
                localStorage.setItem("token", token);
            }
            const parseJwt = (token: string): any => {
                try {
                    const base64 = token
                        .split(".")[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");
                    const json = decodeURIComponent(
                        atob(base64)
                            .split("")
                            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                            .join("")
                    );
                    return JSON.parse(json);
                } catch {
                    return null;
                }
            };
            const role =
                parseJwt(token)?.[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ];

            if (role === "Admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/shop");
            }
        } catch (err) {
            console.error("Помилка входу:", err);
            if (err instanceof Error && (err as APIError).status === 401) {
                setError(t("loginPage.errorInvalidCredentials"));
            } else {
                setError(t("loginPage.errorUnknown"));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#b8845f]/20 shadow-lg">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-[#2d3748]">
                            {t("loginPage.title")}
                        </h1>
                        <p className="text-[#2d3748]/60 mt-2">
                            {t("loginPage.subtitle")}
                        </p>
                    </div>

                    <Input
                        label={t("loginPage.usernameLabel")}
                        value={username}
                        onValueChange={setUsername}
                        startContent={
                            <User className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        variant="bordered"
                        isRequired
                    />
                    <Input
                        label={t("loginPage.passwordLabel")}
                        value={password}
                        onValueChange={setPassword}
                        type="password"
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
                        className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white font-semibold"
                    >
                        {isLoading
                            ? t("loginPage.submitButtonLoading")
                            : t("loginPage.submitButton")}
                    </Button>
                    <div className="text-center text-sm text-gray-600">
                        <span>{t("loginPage.noAccount")}</span>
                        <Link
                            href="/register"
                            className="font-medium text-[#8b7258] hover:underline"
                        >
                            {t("loginPage.registerLink")}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;