"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  // Ініціалізуємо мову при завантаженні компонента
  useEffect(() => {
    const initializeLanguage = () => {
      const savedLanguage = localStorage.getItem("i18nextLng");
      const savedCurrency = localStorage.getItem("currency");

      if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
      }

      // Якщо немає збереженої валюти, встановлюємо відповідно до мови
      if (!savedCurrency) {
        const currency =
          (savedLanguage || i18n.language) === "en" ? "usd" : "uah";
        localStorage.setItem("currency", currency);
      }

      setIsInitialized(true);
    };

    // Чекаємо, поки i18n ініціалізується
    if (i18n.isInitialized) {
      initializeLanguage();
    } else {
      i18n.on("initialized", initializeLanguage);
      return () => i18n.off("initialized", initializeLanguage);
    }
  }, [i18n]);

  const handleLocaleChange = (newLocaleKey: React.Key) => {
    const newLocale = newLocaleKey as string;

    i18n.changeLanguage(newLocale);

    localStorage.setItem("i18nextLng", newLocale);

    const currency = newLocale === "en" ? "usd" : "uah";
    localStorage.setItem("currency", currency);
  };

  // Не рендеримо, поки не ініціалізувалися
  if (!isInitialized) {
    return (
      <Button isIconOnly variant="light" isLoading>
        <Globe size={20} />
      </Button>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <Globe size={20} />
          <span className="font-semibold ml-1">
            {(i18n.language || "ua").toUpperCase()}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Вибір мови"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={new Set([i18n.language || "ua"])}
        onAction={handleLocaleChange}
      >
        <DropdownItem key="ua">Українська (UA)</DropdownItem>
        <DropdownItem key="en">English (EN)</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
