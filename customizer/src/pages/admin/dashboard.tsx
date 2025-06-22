import React, { useState } from "react";
import "../../styles/globals.css";
import {
  ShoppingBag,
  Palette,
  Scissors,
  Truck,
  DollarSign,
  Link2,
  Eye,
  Shield,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const menuItems = [
    {
      title: "Замовлення",
      href: "/orderPage",
      icon: <ShoppingBag className="w-6 h-6" />,
      color: "primary",
      description: "Керування замовленнями",
    },
    {
      title: "Покриття клинка",
      href: "/blade-coating-color",
      icon: <Shield className="w-6 h-6" />,
      color: "secondary",
      description: "Налаштування покриття",
    },
    {
      title: "Форми клинка",
      href: "/blade-shape",
      icon: <Scissors className="w-6 h-6" />,
      color: "accent",
      description: "Управління формами",
    },
    {
      title: "Види доставки",
      href: "/deliveryTypePage",
      icon: <Truck className="w-6 h-6" />,
      color: "primary",
      description: "Налаштування доставки",
    },
    {
      title: "Вартість гравіювання",
      href: "/engravingPricePage/",
      icon: <DollarSign className="w-6 h-6" />,
      color: "accent",
      description: "Управління цінами",
    },
    {
      title: "Кріплення",
      href: "/fasteningPage",
      icon: <Link2 className="w-6 h-6" />,
      color: "secondary",
      description: "Типи кріплення",
    },
    {
      title: "Кольори руків'я",
      href: "/handle",
      icon: <Palette className="w-6 h-6" />,
      color: "primary",
      description: "Палітра руків'я",
    },
    {
      title: "Кольори піхв",
      href: "/sheath-colors",
      icon: <Eye className="w-6 h-6" />,
      color: "accent",
      description: "Палітра піхв",
    },
    {
      title: "Піхви",
      href: "/sheath",
      icon: <Eye className="w-6 h-6" />,
      color: "accent",
      description: "Редагування піхв",
    },
    {
      title: "Текстури",
      href: "/texture",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління текстурами",
    },
    {
      title: "Типи аксесуарів",
      href: "/attachmentType",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління типами аксесуарів",
    },
    {
      title: "Теги продуктів",
      href: "/product-tag",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління тегами продуктів",
    },
    {
      title: "Статуси замовлення",
      href: "/orderStatusesPage",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "secondary",
      description: "Управління статусами",
    },
    {
      title: "Теги гравіювань",
      href: "/engraving-tag",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління тегами гравіювань",
    },
    {
      title: "Типи клинка",
      href: "/blade-shape-type",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління типами клинків",
    },
    {
      title: "Валюти",
      href: "/currencies",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління валютами",
    },
    {
      title: "Ножі",
      href: "/knife",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління ножами",
    },
    {
      title: "Користувачі",
      href: "/user-management",
      icon: <Palette className="w-6 h-6" />,
      color: "secondary",
      description: "Управління користувачами",
    },
  ];

  const getCardStyles = (color: string) => {
    const styles: Record<string, string> = {
      primary:
        "from-[#8b7258] to-[#6d5940] hover:from-[#9a7f64] hover:to-[#7a6349] shadow-[#8b7258]/20",
      secondary:
        "from-[#b8845f] to-[#a0724d] hover:from-[#c69068] hover:to-[#ad7e56] shadow-[#b8845f]/20",
      accent:
        "from-[#8b7258] via-[#b8845f] to-[#8b7258] hover:from-[#9a7f64] hover:via-[#c69068] hover:to-[#9a7f64] shadow-[#b8845f]/25",
    };
    return styles[color] || styles.primary;
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] via-[#f4ede3] to-[#f0e5d6]">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#b8845f]/20 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white hover:shadow-lg transition-all duration-200"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-2xl font-bold text-[#2d3748] tracking-tight">
              Адмін панель
            </h1>
          </div>
          <div className="flex items-center space-x-3"></div>
        </div>
      </header>

      <div className="flex">
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="w-80 h-full bg-white/95 backdrop-blur-sm p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-semibold text-[#2d3748]">Меню</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#f0e5d6]/50 transition-colors"
                >
                  <X className="w-5 h-5 text-[#2d3748]" />
                </button>
              </div>
              <nav className="space-y-3">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleNavigation(item.href);
                      setIsSidebarOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-[#f0e5d6]/50 transition-all duration-200 text-left"
                  >
                    <div className="text-[#8b7258]">{item.icon}</div>
                    <div>
                      <div className="font-medium text-[#2d3748]">
                        {item.title}
                      </div>
                      <div className="text-sm text-[#2d3748]/60">
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Заголовок */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-[#2d3748] mb-2">
                Панель управління
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  className={`group relative p-6 rounded-2xl bg-gradient-to-br ${getCardStyles(
                    item.color
                  )} 
                    text-white transform hover:scale-105 hover:shadow-xl transition-all duration-300 
                    border border-white/20 backdrop-blur-sm overflow-hidden`}
                >
                  <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors duration-200">
                        {item.icon}
                      </div>
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:translate-x-1 transition-transform duration-200">
                      {item.title}
                    </h3>

                    <p className="text-white/80 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center text-white/60 group-hover:text-white/80 transition-colors duration-200">
                      <span className="text-xs font-medium">Перейти</span>
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#b8845f]/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#2d3748]/60 text-sm font-medium">
                      Активні замовлення
                    </p>
                    <p className="text-2xl font-bold text-[#2d3748] mt-1">24</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#8b7258] to-[#b8845f] text-white">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#b8845f]/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#2d3748]/60 text-sm font-medium">
                      Загальна виручка
                    </p>
                    <p className="text-2xl font-bold text-[#2d3748] mt-1">
                      ₴12,450
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#b8845f] to-[#8b7258] text-white">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#b8845f]/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#2d3748]/60 text-sm font-medium">
                      Завершені
                    </p>
                    <p className="text-2xl font-bold text-[#2d3748] mt-1">
                      156
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#8b7258] via-[#b8845f] to-[#8b7258] text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
