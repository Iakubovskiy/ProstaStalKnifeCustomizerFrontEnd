import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import OrderService from "../../../services/OrderService";
import Order from "../../../Models/Order";
import Link from "next/link";
import {useRouter} from "next/router";

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const orderService = new OrderService();
    const  router = useRouter();
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAll();
                const sanitizedData = data.map((item) => ({
                    ...item,
                    knifes: item.knifes.map((knife) => ({
                        ...knife,
                        sheathColor: {
                            ...knife.sheathColor,
                            materialUrl: knife.sheathColor.materialUrl || "",
                            color: knife.sheathColor.colorName || "",
                        },
                        bladeCoating: {
                            ...knife.bladeCoating,
                            type: knife.bladeCoating?.name || "default", // Вкажи значення за замовчуванням
                            materialUrl: knife.bladeCoating?.materialUrl || "",
                        },
                    })),
                    comment: item.comment || "",
                }));
                setOrders(sanitizedData);
            } catch (error) {
                console.error("Помилка при отриманні Замовлень:", error);
            }
        };

        fetchOrders();
    }, []);

    const bladeDelete = async (id: number) => {
        const isDeleted = await orderService.delete(id);
        if (isDeleted) {
            setOrders((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };
    const preparedOrders = orders.map((order) => ({
        ...order,
        statusText: order.status.status,
        deliveryName: order.delivery.name,
    }));
    const columns: Column<typeof preparedOrders[number]>[] = [
        { name: "Номер", uid: "number" },
        { name: "Ціна", uid: "total" },
        { name: "Статус", uid: "statusText" },
        { name: "ПІБ клієнта", uid: "clientFullName" },
        { name: "Номер телефону", uid: "clientPhoneNumber" },
        { name: "Email", uid: "email" },
        { name: "Місто", uid: "city" },
        { name: "Країна", uid: "countryForDelivery" },
        { name: "Вид доставки", uid: "deliveryName" },

    ];

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <Link href={`${router.pathname}/0`}>
                    <Button color="success">
                        Create
                    </Button>
                </Link>
                <Link href="/admin/dashboard" passHref>
                    <Button color="primary">
                        Back
                    </Button>
                </Link>
            </div>
            <CustomTable data={preparedOrders} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}