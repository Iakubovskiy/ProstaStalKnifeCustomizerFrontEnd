"use client";
import React, { useState, useRef, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

const NavigationMob = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { tKey: "navigationMob.about", href: "/about" },
    { tKey: "navigationMob.delivery", href: "/delivery" },
    { tKey: "navigationMob.returns", href: "/returns" },
    { tKey: "navigationMob.contacts", href: "/contacts" },
    { tKey: "navigationMob.reviews", href: "/about-store" },
    { tKey: "navigationMob.blog", href: "/blog" },
    { tKey: "navigationMob.terms", href: "/terms" },
    { tKey: "navigationMob.login", href: "/account" },
    { tKey: "navigationMob.language", href: "/language-settings" },
  ] as const;

  return (
      <nav className="w-full shadow-md relative" ref={menuRef}>
        <div className="px-4 py-2 flex justify-between items-center bg-white">
          <div className="flex items-center">
            <div className="z-50">
              <Hamburger toggled={isOpen} toggle={setIsOpen} size={20} />
            </div>
            <Link href="/" className="ml-2 font-bold">
              PROSTAstal
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button isIconOnly className="w-full bg-coffe">
              <img
                  src="/icons/cart.svg"
                  alt={t("navigationMob.cartIconAlt")}
                  width={25}
                  height={25}
              />
            </Button>
          </div>
        </div>

        {isOpen && (
            <div className="absolute w-full bg-white shadow-lg z-40">
              {menuItems.map((item) => (
                  <Link
                      key={item.tKey}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                  >
                    {t(item.tKey)}
                  </Link>
              ))}
            </div>
        )}
      </nav>
  );
};

export default NavigationMob;