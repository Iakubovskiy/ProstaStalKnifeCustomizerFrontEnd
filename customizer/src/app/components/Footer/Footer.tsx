import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FBF8F4] py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <h2 className="text-xl font-bold">PROSTA STAL</h2>
          </Link>
          <p className="text-sm text-gray-600">© 2023 - {currentYear}</p>
          <p className="text-sm text-gray-600">
            ProstaSTAL - магазин ножівочної роботи
          </p>
        </div>

        {/* Catalog */}
        <div>
          <h3 className="font-semibold mb-4">Каталог</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/catalog/knives"
                className="text-gray-600 hover:text-gray-900"
              >
                Ножі
              </Link>
            </li>
            <li>
              <Link
                href="/catalog/handles"
                className="text-gray-600 hover:text-gray-900"
              >
                Ріжки (чохли)
              </Link>
            </li>
            <li>
              <Link
                href="/catalog/accessories"
                className="text-gray-600 hover:text-gray-900"
              >
                Кріплення та аксесуари
              </Link>
            </li>
            <li>
              <Link
                href="/catalog/hunting"
                className="text-gray-600 hover:text-gray-900"
              >
                Мисливта
              </Link>
            </li>
          </ul>
        </div>

        {/* Clients */}
        <div>
          <h3 className="font-semibold mb-4">Клієнтам</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/account"
                className="text-gray-600 hover:text-gray-900"
              >
                Вхід до кабінету
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                Про нас
              </Link>
            </li>
            <li>
              <Link
                href="/delivery"
                className="text-gray-600 hover:text-gray-900"
              >
                Оплата і доставка
              </Link>
            </li>
            <li>
              <Link
                href="/returns"
                className="text-gray-600 hover:text-gray-900"
              >
                Обмін та повернення
              </Link>
            </li>
            <li>
              <Link
                href="/contacts"
                className="text-gray-600 hover:text-gray-900"
              >
                Контакти
              </Link>
            </li>
            <li>
              <Link
                href="/about-store"
                className="text-gray-600 hover:text-gray-900"
              >
                Відгуки про магазин
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Блог
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                Угода користувача
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-4">Контактна інформація</h3>
          <div className="space-y-2">
            <p className="text-gray-600">(073) 101 00 20</p>
            <p className="text-gray-600">Україна, 29023, м. Хмельницький,</p>
            <p className="text-gray-600">вул. Шевченка, 16</p>
            <p className="text-gray-600">Мапи продаж</p>
            <div className="space-y-1">
              <p className="text-gray-600">WhatsApp</p>
              <p className="text-gray-600">Telegram</p>
              <p className="text-gray-600">simplesteel2022@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
