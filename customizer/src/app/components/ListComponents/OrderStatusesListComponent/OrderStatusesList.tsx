import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import OrderStatusesService from "../../../services/OrderStatusesService"

export default function OrderStatusesList() {
    const [orderStatuses, setOrderStatuses] = useState<OrderStatuses[]>([]);
    const statusService = new OrderStatusesService();

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
                <Button color="primary">
                    Back
                </Button>
                <Button color="success">
                    Create
                </Button>
            </div>
            <CustomTable data={orderStatuses} columns={columns} onDelete={handleDelete}/>
        </div>
    );
}