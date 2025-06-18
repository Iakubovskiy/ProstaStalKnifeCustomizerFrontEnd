"use client";
import React, { useState } from "react";
import "../../styles/globals.css";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Settings,
  LogOut,
  RotateCcw,
  Save,
} from "lucide-react";

export default function ProfileManagement() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "user@example.com",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Тут буде логіка збереження
    console.log("Збереження даних:", formData);
    setIsEditing(false);
  };

  const handleResetPassword = () => {
    // Тут буде логіка скидання пароля
    console.log("Скидання пароля");
  };

  const handleLogout = () => {
    // Тут буде логіка виходу
    console.log("Вихід з користувача");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f0e5d6] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#8b7258] to-[#b8845f] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2d3748] mb-2">
            Управління профілем
          </h1>
          <p className="text-[#2d3748] opacity-70">Налаштуйте свої дані</p>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-b from-[#f8f4f0] to-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#b8845f]">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#8b7258] to-[#b8845f] p-6 text-[#f8f4f0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6" />
                <span className="text-lg font-semibold">Налаштування</span>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-[#f8f4f0]/20 hover:bg-[#f8f4f0]/30 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium border border-[#f8f4f0]/30"
              >
                {isEditing ? "Скасувати" : "Редагувати"}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6 bg-gradient-to-b from-[#f8f4f0] to-[#f0e5d6]">
            {/* Login Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2d3748]">
                Логін
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 pl-11 bg-[#f8f4f0] border-2 border-[#b8845f] rounded-lg focus:ring-2 focus:ring-[#8b7258] focus:border-[#8b7258] focus:bg-white transition-all disabled:bg-[#f0e5d6] disabled:cursor-not-allowed disabled:border-[#b8845f]/50 text-[#2d3748]"
                  placeholder="Введіть логін"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b7258]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#2d3748]">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 pl-11 pr-11 bg-[#f8f4f0] border-2 border-[#b8845f] rounded-lg focus:ring-2 focus:ring-[#8b7258] focus:border-[#8b7258] focus:bg-white transition-all disabled:bg-[#f0e5d6] disabled:cursor-not-allowed disabled:border-[#b8845f]/50 text-[#2d3748]"
                  placeholder="Введіть пароль"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b7258]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b7258] hover:text-[#b8845f] transition-colors disabled:opacity-50"
                  disabled={!isEditing}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white py-3 px-4 rounded-lg hover:from-[#7a6249] hover:to-[#a6784f] transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Зберегти зміни
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Reset Password */}
          <button
            onClick={handleResetPassword}
            className="w-full bg-gradient-to-r from-[#f8f4f0] to-[#f0e5d6] text-[#8b7258] py-3 px-4 rounded-lg border-2 border-[#b8845f] hover:bg-gradient-to-r hover:from-[#b8845f] hover:to-[#8b7258] hover:text-[#f8f4f0] transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Скинути пароль
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-[#8b7258] to-[#b8845f] hover:from-[#7a6249] hover:to-[#a6784f] text-[#f8f4f0] py-3 px-4 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg border-2 border-[#8b7258]"
          >
            <LogOut className="w-5 h-5" />
            Вийти з профілю
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-[#2d3748] opacity-60 text-sm">
          <p>© 2025 Управління профілем. Всі права захищені.</p>
        </div>
      </div>
    </div>
  );
}
