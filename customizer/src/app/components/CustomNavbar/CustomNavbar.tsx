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
} from "@nextui-org/react";

export default function CustomNavbar() {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Функція для підрахунку товарів в кошику
  const getCartItemCount = (): number => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const cartItems = JSON.parse(cart);
        // Якщо cart - це масив товарів
        if (Array.isArray(cartItems)) {
          return cartItems.length;
        }
        // Якщо cart - це об'єкт з товарами та їх кількістю
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

  // Оновлення кількості товарів при завантаженні компонента
  useEffect(() => {
    setCartItemCount(getCartItemCount());

    // Слухач для оновлення кількості при змінах в localStorage
    const handleStorageChange = (): void => {
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener("storage", handleStorageChange);

    // Додатковий слухач для змін в межах одної вкладки
    const handleCartUpdate = (): void => {
      setCartItemCount(getCartItemCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

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
            Конструктор
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/shop"
            className="text-[#2d3748] hover:text-[#8b7258] font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#8b7258] hover:after:w-full after:transition-all after:duration-300"
          >
            Магазин
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem></NavbarItem>
        <NavbarItem>
          <Button>Вхід</Button>
        </NavbarItem>
        <NavbarItem>
          <Badge
            content={cartItemCount > 0 ? cartItemCount : ""}
            color="danger"
            size="sm"
            isInvisible={cartItemCount === 0}
          >
            <Button isIconOnly>
              <img
                src="icons/cart.svg"
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
            Конструктор
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="text-[#2d3748] hover:text-[#8b7258] font-medium text-lg py-2 block transition-colors duration-200"
            href="/shop"
          >
            Магазин
          </Link>
        </NavbarMenuItem>
        <div className="border-t border-[#b8845f]/20 my-4"></div>
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
