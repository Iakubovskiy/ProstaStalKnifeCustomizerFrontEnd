import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import OrderStatusesService from "../../../services/OrderStatusesService"
import Link from "next/link";
import {useRouter} from "next/router";
import OrderStatuses from "@/app/Models/OrderStatuses";

export default function OrderStatusesList() {
    const [orderStatuses, setOrderStatuses] = useState<OrderStatuses[]>([]);
    const statusService = new OrderStatusesService();
    const router = useRouter();
    useEffect(() => {
        const fetchOrderStatuses = async () => {
            try {
                const data = await statusService.getAll();
                setOrderStatuses(data);
            } catch (error) {
                console.error("Помилка при отриманні OrderStatuses:", error);
            }
        };

        fetchOrderStatuses();
    }, []);

    const handleDelete = async (id: number) => {
        const isDeleted = await statusService.delete(id);
        if (isDeleted) {
            setOrderStatuses((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };

    const columns: Column<OrderStatuses>[] = [
        { name: "Статус", uid: "status" },
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
            <CustomTable data={orderStatuses} columns={columns} onDelete={handleDelete}/>
        </div>
    );
}