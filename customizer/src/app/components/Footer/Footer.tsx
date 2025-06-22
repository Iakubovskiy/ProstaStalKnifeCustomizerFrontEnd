"use client";
import React from "react";
import Link from "next/link";
import {useTranslation} from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
      <footer className="bg-[#FBF8F4] py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold">PROSTASTAL</h2>
            </Link>
            <p className="text-sm text-gray-600">© 2023 - {currentYear}</p>
            <p className="text-sm text-gray-600">{t("footer.description")}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.catalogTitle")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog/knives" className="text-gray-600 hover:text-gray-900">
                  {t("footer.catalog.knives")}
                </Link>
              </li>
              <li>
                <Link href="/catalog/handles" className="text-gray-600 hover:text-gray-900">
                  {t("footer.catalog.sheaths")}
                </Link>
              </li>
              <li>
                <Link href="/catalog/accessories" className="text-gray-600 hover:text-gray-900">
                  {t("footer.catalog.accessories")}
                </Link>
              </li>
              <li>
                <Link href="/catalog/hunting" className="text-gray-600 hover:text-gray-900">
                  {t("footer.catalog.hunting")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.clientsTitle")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.account")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.about")}
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.delivery")}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.returns")}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.contacts")}
                </Link>
              </li>
              <li>
                <Link href="/about-store" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.reviews")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.blog")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  {t("footer.clients.terms")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("footer.contactTitle")}</h3>
            <div className="space-y-2">
              <p className="text-gray-600">(073) 101 00 20</p>
              <p className="text-gray-600">{t("footer.address.countryCity")}</p>
              <p className="text-gray-600">{t("footer.address.street")}</p>
              <p className="text-gray-600">{t("footer.salesMap")}</p>
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