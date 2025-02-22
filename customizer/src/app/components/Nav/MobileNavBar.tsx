import React, { useState, useRef, useEffect } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { Button } from "@nextui-org/react";

const NavigationMob = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(0);

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      //@ts-ignore
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    "Про нас",
    "Оплата і доставка",
    "Обмін та повернення",
    "Контакти",
    "Відгуки про магазин",
    "Блог",
    "Угода користувача",
    "Вхід",
    "Мова",
  ];

  return (
      // @ts-ignore
    <nav className="w-full shadow-md relative" ref={menuRef}>
      <div className="px-4 py-2 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <div className="z-50">
            <Hamburger toggled={isOpen} toggle={setIsOpen} size={20} />
          </div>
          <span className="ml-2 font-bold">PROSTAstal</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button className="w-full bg-coffe">
            <img src="icons/cart.svg" alt="Cart icon" width={25} height={25} />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full bg-white shadow-lg z-40">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-4 py-2 text-black hover:bg-gray-100"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavigationMob;
