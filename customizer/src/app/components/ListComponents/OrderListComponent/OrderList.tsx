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
                    comment: item.comment || "",
                }));
                setOrders(sanitizedData);
            } catch (error) {
                console.error("Помилка при отриманні Замовлень:", error);
            }
        };

        fetchOrders();
    }, []);

    const bladeDelete = async (id: string) => {
        const isDeleted = await orderService.delete(id);
        if (isDeleted) {
            setOrders((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };
    const columns: Column<typeof orders[number]>[] = [
        { name: "Номер", uid: "number" },
        { name: "Ціна", uid: "total" },
        { name: "ПІБ клієнта", uid: "clientFullName" },
        { name: "Номер телефону", uid: "clientPhoneNumber" },
        { name: "Email", uid: "email" },
        { name: "Місто", uid: "city" },
        { name: "Країна", uid: "countryForDelivery" },

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
            <CustomTable data={orders} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}