import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import "../../styles/globals.css";
import { useTranslation } from "react-i18next";
import { Input, Button, Spinner } from "@nextui-org/react";
import UserService from "@/app/services/UserService";
import { UpdateUserDTO } from "@/app/DTOs/UpdateUserDTO";
import { User } from "@/app/Interfaces/User";
import { ClientData } from "@/app/DTOs/ClientData";
import { ArrowLeft } from "lucide-react";

const initialData: Partial<User> = {
  email: "",
  userData: {},
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<Partial<User>>(initialData);
  const [passwordData, setPasswordData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = useMemo(() => new UserService(), []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        setUser(currentUser);
        setUser((prev) => ({
          ...prev,
          userData: {
            ...prev.userData,
            email: currentUser.email,
          },
        }));
      } catch (err) {
        console.error("Помилка завантаження профілю:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router, userService]);

  const handleEmailChange = (value: string) => {
    setUser((prev) => ({
      ...prev,
      email: value,
      userData: {
        ...prev.userData,
        email: value,
      },
    }));
  };

  const handleClientDataChange = (field: keyof ClientData, value: string) => {
    setUser((prev) => ({
      ...prev,
      userData: { ...prev.userData, [field]: value },
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (passwordData.password !== passwordData.passwordConfirmation) {
      setError(t("profilePage.errorPasswordsDoNotMatch"));
      return;
    }

    setSaving(true);
    setError(null);

    const dto: UpdateUserDTO = {
      clientData: user.userData as ClientData,
      email: user.email,
    };

    if (passwordData.password) {
      dto.password = passwordData.password;
      dto.passwordConfirmation = passwordData.passwordConfirmation;
    }

    try {
      await userService.updateCurrentUserData(dto);
      alert(t("profilePage.successUpdate"));
      setPasswordData({ password: "", passwordConfirmation: "" });
    } catch (err) {
      console.error("Помилка збереження профілю:", err);
      setError(
        err instanceof Error ? err.message : t("profilePage.errorUnknown")
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
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center">
            {t("profilePage.title")}
          </h1>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {t("profilePage.contactDetailsTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t("profilePage.emailLabel")}
                value={user.email || ""}
                onValueChange={handleEmailChange}
              />
              <Input
                label={t("profilePage.fullNameLabel")}
                value={user.userData?.clientFullName || ""}
                onValueChange={(v) =>
                  handleClientDataChange("clientFullName", v)
                }
              />
              <Input
                label={t("profilePage.phoneLabel")}
                value={user.userData?.clientPhoneNumber || ""}
                onValueChange={(v) =>
                  handleClientDataChange("clientPhoneNumber", v)
                }
              />
              <Input
                label={t("profilePage.countryLabel")}
                value={user.userData?.countryForDelivery || ""}
                onValueChange={(v) =>
                  handleClientDataChange("countryForDelivery", v)
                }
              />
              <Input
                label={t("profilePage.cityLabel")}
                value={user.userData?.city || ""}
                onValueChange={(v) => handleClientDataChange("city", v)}
              />
              <Input
                className="md:col-span-2"
                label={t("profilePage.addressLabel")}
                value={user.userData?.address || ""}
                onValueChange={(v) => handleClientDataChange("address", v)}
              />
              <Input
                label={t("profilePage.zipCodeLabel")}
                value={user.userData?.zipCode || ""}
                onValueChange={(v) => handleClientDataChange("zipCode", v)}
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">
              {t("profilePage.passwordChangeTitle")}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {t("profilePage.passwordChangeSubtitle")}
            </p>
            <div className="space-y-4">
              <Input
                label={t("profilePage.newPasswordLabel")}
                type="password"
                value={passwordData.password}
                onValueChange={(v) => handlePasswordChange("password", v)}
              />
              <Input
                label={t("profilePage.confirmNewPasswordLabel")}
                type="password"
                value={passwordData.passwordConfirmation}
                onValueChange={(v) =>
                  handlePasswordChange("passwordConfirmation", v)
                }
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">
              {t("profilePage.myOrdersTitle")}
            </h2>
            <div className="space-y-3">
              {user.orders && user.orders.length > 0 ? (
                user.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {t("profilePage.orderNumberPrefix")}
                        {order.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t("profilePage.statusPrefix")} {order.status}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onClick={() => router.push(`/order/${order.id}`)}
                    >
                      {t("profilePage.detailsButton")}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  {t("profilePage.noOrdersText")}
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-4 gap-4">
          <div className="w-full sm:w-auto">
            <Button
              color="default"
              variant="flat"
              onClick={() => router.back()}
              startContent={<ArrowLeft size={16} />}
              fullWidth
            >
              {t("profilePage.backButton")}
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <Button
              color="primary"
              onClick={handleSave}
              isLoading={isSaving}
              className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white font-semibold"
              fullWidth
            >
              {isSaving
                ? t("profilePage.saveButtonLoading")
                : t("profilePage.saveButton")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
