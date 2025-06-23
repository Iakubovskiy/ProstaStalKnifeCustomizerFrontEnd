"use client";
import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
  Link,
  Button,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import LanguageSwitcher from "@/app/components/CustomNavbar/LanguageSwitcher";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import UserService from "@/app/services/UserService";
import type { User } from "@/app/Interfaces/User";

export default function CustomNavbar() {
  const router = useRouter();
  const { t } = useTranslation();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userService = new UserService();

  const getCartItemCount = (): number => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const cartItems = JSON.parse(cart);
        if (Array.isArray(cartItems)) {
          return cartItems.length;
        }
        if (typeof cartItems === "object" && cartItems !== null) {
          return Object.values(cartItems).reduce(
            (total: number, quantity: unknown) => {
              const qty = typeof quantity === "number" ? quantity : 0;
              return total + qty;
            },
            0
          );
        }
      }
      return 0;
    } catch (error) {
      console.error("Помилка при читанні localStorage:", error);
      return 0;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Помилка при перевірці статусу авторизації:", error);
      setIsLoggedIn(false);
      setCurrentUser(null);
      // Видаляємо невалідний токен
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentUser(null);
    router.push("/customizer");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  useEffect(() => {
    setCartItemCount(getCartItemCount());
    checkAuthStatus();

    const handleStorageChange = (): void => {
      setCartItemCount(getCartItemCount());
    };
    window.addEventListener("storage", handleStorageChange);

    const handleCartUpdate = (): void => {
      setCartItemCount(getCartItemCount());
    };
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Слухач для оновлення статусу авторизації
    const handleAuthUpdate = (): void => {
      checkAuthStatus();
    };
    window.addEventListener("authUpdated", handleAuthUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("authUpdated", handleAuthUpdate);
    };
  }, []);

  const renderAuthSection = () => {
    if (isLoading) {
      return (
        <NavbarItem>
          <Button isLoading size="sm">
            Завантаження
          </Button>
        </NavbarItem>
      );
    }

    if (isLoggedIn && currentUser) {
      return (
        <>
          <NavbarItem className="hidden sm:flex">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={currentUser.email || ""}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Вхід як</p>
                  <p className="font-semibold">{currentUser.email}</p>
                </DropdownItem>
                <DropdownItem key="profile_page" onClick={handleProfileClick}>
                  Профіль
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={handleLogout}
                >
                  Вийти
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          {/* Мобільна версія - кнопки в меню */}
          <NavbarItem className="sm:hidden">
            <Button size="sm" onClick={handleProfileClick}>
              Профіль
            </Button>
          </NavbarItem>
        </>
      );
    }

    return (
      <NavbarItem>
        <Button onClick={() => router.push("/login")}>
          {t("loginButton")}
        </Button>
      </NavbarItem>
    );
  };

  return (
    <Navbar
      isBordered
      height="4rem"
      maxWidth="full"
      className="bg-gradient-to-r from-[#f8f4f0] to-[#f0e5d6] border-b border-[#b8845f]/20"
      classNames={{
        wrapper: "px-6",
        brand: "text-[#2d3748]",
        content: "text-[#2d3748]",
        item: "text-[#2d3748] data-[active=true]:text-[#8b7258]",
        toggle: "text-[#8b7258]",
        menu: "bg-gradient-to-b from-[#f8f4f0] to-[#f0e5d6] border-r border-[#b8845f]/20",
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarContent justify="start">
        <NavbarBrand>
          <p className="font-bold text-2xl text-[#8b7258] tracking-wide">
            PROSTAstal
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        <NavbarItem>
          <Link
            href="/customizer"
            className="text-[#2d3748] hover:text-[#8b7258] font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#8b7258] hover:after:w-full after:transition-all after:duration-300"
          >
            {t("customizerLink")}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/shop"
            className="text-[#2d3748] hover:text-[#8b7258] font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#8b7258] hover:after:w-full after:transition-all after:duration-300"
          >
            {t("shopLink")}
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
        {renderAuthSection()}
        <NavbarItem>
          <Badge
            content={cartItemCount > 0 ? cartItemCount : ""}
            color="danger"
            size="sm"
            isInvisible={cartItemCount === 0}
          >
            <Button isIconOnly onClick={() => router.push("/cart")}>
              <img
                src="/icons/cart.svg"
                alt="Cart icon"
                width={25}
                height={25}
              />
            </Button>
          </Badge>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] font-medium text-lg py-2 block transition-colors duration-200"
            href="/customizer"
          >
            {t("customizerLink")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] font-medium text-lg py-2 block transition-colors duration-200"
            href="/shop"
          >
            {t("shopLink")}
          </Link>
        </NavbarMenuItem>

        {/* Розділювач */}
        <div className="border-t border-[#b8845f]/20 my-4"></div>

        {/* Секція авторизації для мобільного меню */}
        {isLoggedIn && currentUser && (
          <>
            <NavbarMenuItem>
              <div className="text-[#2d3748] text-sm py-2">
                Вхід як:{" "}
                <span className="font-semibold">{currentUser.email}</span>
              </div>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
                href="/profile"
              >
                Профіль
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
                href="/orders"
              >
                Мої замовлення
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                className="text-red-600 hover:text-red-800 text-lg py-2 justify-start px-0 bg-transparent"
                onClick={handleLogout}
                variant="light"
              >
                Вийти
              </Button>
            </NavbarMenuItem>
            <div className="border-t border-[#b8845f]/20 my-4"></div>
          </>
        )}

        {!isLoggedIn && (
          <>
            <NavbarMenuItem>
              <Link
                className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
                href="/login"
              >
                {t("loginButton")}
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Link
                className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
                href="/register"
              >
                Реєстрація
              </Link>
            </NavbarMenuItem>
            <div className="border-t border-[#b8845f]/20 my-4"></div>
          </>
        )}

        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Про нас
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Оплата і доставка
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Обмін та повернення
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Контакти
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Відгуки про магазин
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Блог
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] text-lg py-2 block transition-colors duration-200"
            href="#"
          >
            Угода користувача
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
