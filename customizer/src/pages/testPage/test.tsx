"use client";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/globals.css";
import AdaptiveGrid from "@/app/components/Shop/Grid/AdaptiveGrid";
import FilterSelect from "@/app/components/Shop/Filter/FilterSelect";

// Приклад даних продуктів
const sampleProducts = [
  {
    id: 1,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Професійний ніж шеф-кухаря",
    price: 1299,
    specs: {
      "Товщина обуха, мм": 2.5,
      "Довжина леза, мм": 210,
      "Ширина леза, мм": 45,
      "Загальна довжина, мм": 350,
      "Вага леза, гр.": 180,
      "Кут заточки": "15°",
      "Твердість за Роквеллом, од.": 58,
    },
  },
  {
    id: 2,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Набір ножів для стейка",
    price: 899,
    specs: {
      "Товщина обуха, мм": 1.8,
      "Довжина леза, мм": 120,
      "Ширина леза, мм": 25,
      "Загальна довжина, мм": 230,
      "Вага леза, гр.": 80,
      "Кут заточки": "18°",
      "Твердість за Роквеллом, од.": 56,
    },
  },
  {
    id: 3,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Японський сантоку",
    price: 1599,
    specs: {
      "Товщина обуха, мм": 2.0,
      "Довжина леза, мм": 180,
      "Ширина леза, мм": 50,
      "Загальна довжина, мм": 300,
      "Вага леза, гр.": 170,
      "Кут заточки": "12°",
      "Твердість за Роквеллом, од.": 60,
    },
  },
  {
    id: 4,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Філейний ніж",
    price: 799,
    specs: {
      "Товщина обуха, мм": 1.5,
      "Довжина леза, мм": 150,
      "Ширина леза, мм": 20,
      "Загальна довжина, мм": 280,
      "Вага леза, гр.": 95,
      "Кут заточки": "17°",
      "Твердість за Роквеллом, од.": 57,
    },
  },
  {
    id: 5,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Універсальний кухонний ніж",
    price: 699,
    specs: {
      "Товщина обуха, мм": 1.9,
      "Довжина леза, мм": 160,
      "Ширина леза, мм": 35,
      "Загальна довжина, мм": 290,
      "Вага леза, гр.": 130,
      "Кут заточки": "16°",
      "Твердість за Роквеллом, од.": 56,
    },
  },
  {
    id: 6,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Хлібний ніж",
    price: 899,
    specs: {
      "Товщина обуха, мм": 2.2,
      "Довжина леза, мм": 225,
      "Ширина леза, мм": 30,
      "Загальна довжина, мм": 365,
      "Вага леза, гр.": 165,
      "Кут заточки": "20°",
      "Твердість за Роквеллом, од.": 55,
    },
  },
  {
    id: 7,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Ніж для овочів",
    price: 599,
    specs: {
      "Товщина обуха, мм": 1.6,
      "Довжина леза, мм": 100,
      "Ширина леза, мм": 25,
      "Загальна довжина, мм": 220,
      "Вага леза, гр.": 75,
      "Кут заточки": "16°",
      "Твердість за Роквеллом, од.": 56,
    },
  },
  {
    id: 8,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Обвалювальний ніж",
    price: 999,
    specs: {
      "Товщина обуха, мм": 2.0,
      "Довжина леза, мм": 160,
      "Ширина леза, мм": 30,
      "Загальна довжина, мм": 290,
      "Вага леза, гр.": 140,
      "Кут заточки": "18°",
      "Твердість за Роквеллом, од.": 57,
    },
  },
  {
    id: 9,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Сікач для м'яса",
    price: 1199,
    specs: {
      "Товщина обуха, мм": 3.5,
      "Довжина леза, мм": 180,
      "Ширина леза, мм": 80,
      "Загальна довжина, мм": 320,
      "Вага леза, гр.": 350,
      "Кут заточки": "25°",
      "Твердість за Роквеллом, од.": 56,
    },
  },
  {
    id: 10,
    image_url:
      "https://prostastal.com/content/images/43/320x400l85nn0/67191051913483.webp",
    name: "Ножиці кухонні",
    price: 499,
    specs: {
      "Загальна довжина, мм": 210,
      "Вага, гр.": 150,
      Матеріал: "нержавіюча сталь",
      "Твердість за Роквеллом, од.": 54,
    },
  },
];

// Інтерфейс для фільтрів
interface Filters {
  [key: string]: string;
}

export default function TestPage() {
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (name: string, value: string) => {
    if (value === "") {
      const updatedFilters = { ...filters };
      delete updatedFilters[name];
      setFilters(updatedFilters);
      console.log("Фільтр видалено. Поточні фільтри:", updatedFilters);
    } else {
      const updatedFilters = {
        ...filters,
        [name]: value,
      };
      setFilters(updatedFilters);
      console.log("Поточні фільтри:", updatedFilters);
    }
  };
  // Приклад даних для фільтрів
  const colorOptions = ["червоний", "блакитний", "зелений", "жовтий"];
  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Фільтри товарів</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Фільтр кольорів */}
        <FilterSelect
          title="Колір"
          name="color"
          data={colorOptions}
          onFilterChange={handleFilterChange}
        />

        <FilterSelect
          title="Розмір"
          name="size"
          data={sizeOptions}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Активні фільтри:</h2>
        <div className="p-4 bg-gray-100 rounded">
          {Object.entries(filters).length > 0 ? (
            <ul>
              {Object.entries(filters).map(
                ([key, value]) =>
                  value && (
                    <li key={key} className="mb-1">
                      <span className="font-medium">{key}: </span>
                      <span>{value || "Не вибрано"}</span>
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p>Фільтри не вибрані</p>
          )}
        </div>
      </div>
    </div>
  );
}
