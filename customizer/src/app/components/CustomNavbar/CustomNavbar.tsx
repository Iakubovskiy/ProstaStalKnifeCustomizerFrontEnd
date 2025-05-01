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
} from "@nextui-org/react";

export default function CustomNavbar() {
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
      {/* <NavbarContent className="hidden md:flex" justify="center">
        <NavbarItem>
          <Link className="text-black" href="https://prostastal.com/pro-nas/">
            Про нас
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="text-black"
            href="https://prostastal.com/oplata-i-dostavka/"
          >
            Оплата і доставка
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="text-black"
            href="https://prostastal.com/obmin-ta-povernennya/"
          >
            Обмін та повернення
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-black" href="https://prostastal.com/kontakty/">
            Контакти
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="text-black"
            href="https://prostastal.com/vidhuky-pro-mahazyn/"
          >
            Відгуки про магазин
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-black" href="https://prostastal.com/blog/">
            Блог
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="text-black"
            href="https://prostastal.com/privacypolicy/"
          >
            Угода користувача
          </Link>
        </NavbarItem>
      </NavbarContent> */}
      <NavbarContent justify="end">
        <NavbarItem>
          {/* <Link className="text-black" href="#">
            Укр
          </Link>{" "}
          |{" "}
          <Link className="text-black" href="#">
            Eng
          </Link> */}
        </NavbarItem>
        <NavbarItem>
          <Button>Вхід</Button>
        </NavbarItem>
        <NavbarItem>
          <Button>
            {" "}
            <img src="icons/cart.svg" alt="Cart icon" width={25} height={25} />
          </Button>
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
