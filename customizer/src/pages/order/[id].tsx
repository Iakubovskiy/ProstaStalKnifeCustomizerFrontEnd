"use client";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import "../../styles/globals.css";

// --- UI & Іконки ---
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Edit2,
  Info,
  Minus,
  Package,
  Plus,
  Save,
  Trash2,
  Truck,
  User,
  X,
} from "lucide-react";

// --- Сервіси, Інтерфейси, Компоненти ---
import OrderService from "@/app/services/OrderService";
import OrderStatusesService from "@/app/services/OrderStatusesService";
import {Order, OrderItemProduct} from "@/app/Interfaces/Order";
import {ClientData} from "@/app/DTOs/ClientData";
import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";
import {OrderItem} from "@/app/Interfaces/OrderItem";
import KnifeService from "@/app/services/KnifeService";

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // --- Стани ---
  const [order, setOrder] = useState<Order | null>(null);
  const [editableClientData, setEditableClientData] =
    useState<ClientData | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // --- Сервіси ---
  const orderService = useMemo(() => new OrderService(), []);
  const orderStatusesService = useMemo(() => new OrderStatusesService(), []);
  const knifeService = new KnifeService();

  // --- Завантаження даних ---
  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const orderData = await orderService.getById(id as string);

      // Перевіряємо чи отримали валідні дані
      if (!orderData || !orderData.id) {
        throw new Error("Отримано некоректні дані замовлення");
      }

      for (const item of orderData.orderItems) {
        const knife = await knifeService.getById(item.productId);
        item.product = {
          ...knife,
          productType: "Knife"
        };
      }

      setOrder(orderData);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError(
        `Помилка завантаження замовлення: ${
          err instanceof Error ? err.message : "Невідома помилка"
        }`
      );
      setOrder(null);
    }
  }, [id, orderService]);

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    Promise.all([fetchOrder(), orderStatusesService.getAll()])
      .then(([, statusesData]) => {
        setStatuses(statusesData || []);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
        alert("Помилка завантаження допоміжних даних.");
      })
      .finally(() => setLoading(false));
  }, [id, router.isReady, fetchOrder, orderStatusesService]);

  // --- Обробники ---
  const handleEditClick = () => {
    if (!order) return;
    setEditableClientData({
      clientFullName: order.clientFullName,
      clientPhoneNumber: order.clientPhoneNumber,
      email: order.email,
      countryForDelivery: order.countryForDelivery,
      city: order.city,
      address: order.address,
      zipCode: order.zipCode,
    });
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditableClientData(null);
    setEditing(false);
  };

  const handleClientDataChange = (field: keyof ClientData, value: string) => {
    setEditableClientData((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleStatusChange = async (newStatusKey: React.Key) => {
    const newStatus = newStatusKey as string;

    if (!order || order.status === newStatus) return;
    const originalOrder = { ...order };

    setOrder({
      ...order,
      status: newStatus,
    });

    try {
      const updatedOrderFromServer = await orderService.updateStatus(
        order.id,
        newStatus
      );
    } catch (e) {
      console.error("Status update error:", e);
      alert("Помилка оновлення статусу. Відновлюємо попередній статус.");

      setOrder(originalOrder);
    }
  };

  const handleSaveClientData = async () => {
    if (!order || !editableClientData) return;

    const originalOrder = { ...order };

    setOrder({
      ...order,
      clientFullName: editableClientData.clientFullName || order.clientFullName,
      clientPhoneNumber:
        editableClientData.clientPhoneNumber || order.clientPhoneNumber,
      email: editableClientData.email || order.email,
      countryForDelivery:
        editableClientData.countryForDelivery || order.countryForDelivery,
      city: editableClientData.city || order.city,
      address: editableClientData.address || order.address,
      zipCode: editableClientData.zipCode || order.zipCode,
    });

    handleCancelEdit();
    setSaving(true);

    try {
      const updatedOrderFromServer = await orderService.updateDeliveryData(
        order.id,
        editableClientData
      );
    } catch (e) {
      console.error("Client data update error:", e);
      alert("Помилка збереження даних клієнта. Відновлюємо попередні дані.");

      // 6. У разі помилки "відкочуємо" зміни
      setOrder(originalOrder);
    } finally {
      setSaving(false);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    // 1. Базова перевірка
    if (!order || newQuantity < 1) return;

    // 2. Зберігаємо поточний стан для можливого "відкоту"
    const originalOrder = { ...order };

    // 3. Знаходимо товар, що оновлюється, та його ціну
    const itemToUpdate = order.orderItems.find(
      (item) => item.productId === productId
    );

    if (!itemToUpdate) {
      console.error("Товар для оновлення не знайдено в замовленні.");
      return;
    }

    const itemPrice = (itemToUpdate.product as OrderItemProduct)?.price || 0;
    const quantityDifference = newQuantity - itemToUpdate.quantity;
    const priceDifference = quantityDifference * itemPrice;

    const updatedOrderItems = order.orderItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    setOrder({
      ...order,
      orderItems: updatedOrderItems,
      total: order.total + priceDifference,
    });

    try {
      const updatedOrderFromServer = await orderService.updateItemQuantity(
        order.id,
        productId,
        newQuantity
      );
    } catch (e) {
      console.error("Quantity update error:", e);
      alert("Помилка зміни кількості товару. Відновлюємо дані.");

      setOrder(originalOrder);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!order || !window.confirm("Видалити товар із замовлення?")) return;
    if (!order || !window.confirm("Видалити товар із замовлення?")) return;

    const originalOrder = { ...order };

    const updatedOrderItems = order.orderItems.filter(
      (item) => item.productId !== productId
    );
    // Оновлюємо стан з новим масивом товарів
    setOrder({
      ...order,
      orderItems: updatedOrderItems,
    });

    // Коригуємо індекс поточного товару
    const newIndex = updatedOrderItems.findIndex(
      (item) => item.productId === currentOrderItem?.productId
    );
    if (newIndex === -1) {
      // Якщо поточний елемент був видалений
      setCurrentItemIndex(0);
    } else {
      setCurrentItemIndex(newIndex);
    }
    try {
      const updatedOrder = await orderService.deleteItem(order.id, productId);
    } catch (e) {
      console.error("Item removal error:", e);
      setError(
        `Помилка видалення товару: ${
          e instanceof Error ? e.message : "Невідома помилка"
        }`
      );
      alert("Помилка видалення товару.");
      // Перезавантажуємо замовлення при помилці
      await fetchOrder();
    }
  };

  // --- Пагінація 3D-моделей ---
  const goToNextItem = () => {
    if (order && currentItemIndex < order.orderItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };
  const goToPrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const currentOrderItem = order?.orderItems?.[currentItemIndex];
  const currentProduct = currentOrderItem?.product as
    | OrderItemProduct
    | undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label="Завантаження замовлення..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div className="max-w-md">
          <p className="text-red-500 mb-4">
            {error || "Не вдалося завантажити дані замовлення."}
          </p>
          <div className="space-y-2">
            <Button
              color="primary"
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchOrder().finally(() => setLoading(false));
              }}
            >
              Спробувати знову
            </Button>
            <Button variant="flat" onClick={() => router.push("/order")}>
              Повернутися до списку замовлень
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusChipColor = (
    status: string
  ):
    | "primary"
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined => {
    switch (status?.toLowerCase()) {
      case "new":
        return "primary";
      case "processing":
        return "warning";
      case "completed":
        return "success";
      case "shipped":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            isIconOnly
            variant="flat"
            onClick={() => router.push("/order")}
            className="mr-4"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Замовлення #{order.number}
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* --- Центральна колонка: Товари та 3D-перегляд --- */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Товари в замовленні
            </h2>

            <Card className="shadow-md mb-8">
              <Table removeWrapper aria-label="Список товарів у замовленні">
                <TableHeader>
                  <TableColumn>ТОВАР</TableColumn>
                  <TableColumn>ЦІНА</TableColumn>
                  <TableColumn>КІЛЬКІСТЬ</TableColumn>
                  <TableColumn>СУМА</TableColumn>
                  <TableColumn>ДІЇ</TableColumn>
                </TableHeader>
                <TableBody
                  items={order.orderItems || []}
                  emptyContent={"У замовленні немає товарів."}
                >
                  {(item: OrderItem) => (
                    <TableRow
                      key={item.productId}
                      className={
                        item.productId === currentOrderItem?.productId
                          ? "bg-primary-50"
                          : ""
                      }
                    >
                      <TableCell
                        className="cursor-pointer"
                        onClick={() =>
                          setCurrentItemIndex(
                            order.orderItems.findIndex(
                              (oi) => oi.productId === item.productId
                            )
                          )
                        }
                      >
                        {(item.product as OrderItemProduct)?.name ||
                          "Невідомий товар"}
                      </TableCell>
                      <TableCell>
                        ₴
                        {(item.product as OrderItemProduct)?.price?.toFixed(
                          2
                        ) || "0.00"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus size={14} />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        ₴
                        {(
                          ((item.product as OrderItemProduct)?.price || 0) *
                          item.quantity
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <p className="font-bold">
                    {currentProduct?.name || "Виберіть товар для перегляду"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Кількість: {currentOrderItem?.quantity || 0}
                  </p>
                </div>
                <p className="font-semibold">
                  ₴{(currentProduct?.price || 0).toFixed(2)}
                </p>
              </CardHeader>
              <Divider />
              <CardBody className="p-0">
                <div className="h-[60vh] bg-gray-200">
                  {currentProduct && currentOrderItem ? (
                    <KnifeConfigurator productId={currentOrderItem.productId} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-500">
                      <Package size={48} className="mb-4" />
                      {currentProduct
                        ? `3D-перегляд для товару не доступний`
                        : "Товар не знайдено"}
                    </div>
                  )}
                </div>
              </CardBody>
              {(order.orderItems?.length || 0) > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <Button
                    isIconOnly
                    onClick={goToPrevItem}
                    disabled={currentItemIndex === 0}
                  >
                    <ChevronLeft />
                  </Button>
                  <p className="text-sm text-gray-600">
                    Товар {currentItemIndex + 1} з{" "}
                    {order.orderItems?.length || 0}
                  </p>
                  <Button
                    isIconOnly
                    onClick={goToNextItem}
                    disabled={
                      currentItemIndex >= (order.orderItems?.length || 0) - 1
                    }
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* --- Права колонка: Інформація про замовлення та клієнта --- */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info />
                  Загальна інформація
                </h3>
              </CardHeader>
              <Divider />
              <CardBody className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Статус</p>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        color={getStatusChipColor(order.status)}
                        className="cursor-pointer mt-1 h-8 px-3 text-sm rounded-full"
                        size="sm"
                      >
                        {order.status}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Зміна статусу"
                      onAction={(key) => handleStatusChange(key)}
                    >
                      {statuses.map((s) => (
                        <DropdownItem key={s}>{s}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Загальна сума</p>
                  <p className="font-bold text-lg mt-1">
                    ₴{(order.total || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Доставка</p>
                  <p className="mt-1 flex items-center gap-1">
                    <Truck size={16} />{" "}
                    {order.deliveryType?.name || "Не вказано"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Оплата</p>
                  <p className="mt-1 flex items-center gap-1">
                    <CreditCard size={16} />{" "}
                    {order.paymentMethod?.name || "Не вказано"}
                  </p>
                </div>
                {order.comment && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Коментар клієнта</p>
                    <p className="mt-1 p-2 bg-gray-100 rounded">
                      {order.comment}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User />
                  Дані клієнта
                </h3>
                {!isEditing ? (
                  <Button
                    size="sm"
                    variant="flat"
                    onClick={handleEditClick}
                    startContent={<Edit2 size={14} />}
                  >
                    Редагувати
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      onClick={handleCancelEdit}
                      startContent={<X size={14} />}
                    >
                      Скасувати
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={handleSaveClientData}
                      isLoading={isSaving}
                      startContent={<Save size={14} />}
                    >
                      Зберегти
                    </Button>
                  </div>
                )}
              </CardHeader>
              <Divider />
              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Повне ім'я"
                  value={
                    isEditing
                      ? editableClientData?.clientFullName ?? ""
                      : order.clientFullName || ""
                  }
                  onChange={(e) =>
                    handleClientDataChange("clientFullName", e.target.value)
                  }
                  isReadOnly={!isEditing}
                />
                <Input
                  label="Номер телефону"
                  value={
                    isEditing
                      ? editableClientData?.clientPhoneNumber ?? ""
                      : order.clientPhoneNumber || ""
                  }
                  onChange={(e) =>
                    handleClientDataChange("clientPhoneNumber", e.target.value)
                  }
                  isReadOnly={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  value={
                    isEditing
                      ? editableClientData?.email ?? ""
                      : order.email || ""
                  }
                  onChange={(e) =>
                    handleClientDataChange("email", e.target.value)
                  }
                  isReadOnly={!isEditing}
                />
                <Input
                  label="Країна"
                  value={
                    isEditing
                      ? editableClientData?.countryForDelivery ?? ""
                      : order.countryForDelivery || ""
                  }
                  onChange={(e) =>
                    handleClientDataChange("countryForDelivery", e.target.value)
                  }
                  isReadOnly={!isEditing}
                />
                <Input
                  label="Місто"
                  value={
                    isEditing
                      ? editableClientData?.city ?? ""
                      : order.city || ""
                  }
                  onChange={(e) =>
                    handleClientDataChange("city", e.target.value)
                  }
                  isReadOnly={!isEditing}
                />
                <Input
                  label="Поштовий індекс"
                  value={
                    isEditing
                      ? editableClientData?.zipCode ?? ""
                      : order.zipCode || ""
                  }
                  onChange={(e) =>
                    handleClientDataChange("zipCode", e.target.value)
                  }
                  isReadOnly={!isEditing}
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Адреса"
                    value={
                      isEditing
                        ? editableClientData?.address ?? ""
                        : order.address || ""
                    }
                    onChange={(e) =>
                      handleClientDataChange("address", e.target.value)
                    }
                    isReadOnly={!isEditing}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
