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

    // Додатковий слухач для змін в межах однієї вкладки
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
    <Navbar isBordered height="3rem" maxWidth="full" className="">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarContent justify="start">
        <NavbarBrand>
          <p className="font-bold">PROSTAstal</p>
        </NavbarBrand>
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
          <Link className="text-black" size="lg" href="#">
            Про нас
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-black" size="lg" href="#">
            Оплата і доставка
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-black" size="lg" href="#">
            Обмін та повернення
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-black" size="lg" href="#">
            Контакти
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-black" size="lg" href="#">
            Відгуки про магазин
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-black" size="lg" href="#">
            Блог
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className="text-black" size="lg" href="#">
            Угода користувача
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
