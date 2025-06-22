'use client';

import React from "react";
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

    const handleLocaleChange = (newLocaleKey: React.Key) => {
        const newLocale = newLocaleKey as string;
        
        // Змінюємо мову
        i18n.changeLanguage(newLocale);
        
        localStorage.setItem('i18nextLng', newLocale);
        
        const currency = newLocale === "en" ? "usd" : "uah";
        localStorage.setItem('currency', currency);
    };

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