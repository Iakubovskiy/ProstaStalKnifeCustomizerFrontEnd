import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import DeliveryTypeService from "../../services/DeliveryTypeService"

export default function DeliveryTypeList() {
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
    const deliveryService = new DeliveryTypeService();

    useEffect(() => {
        const fetchDeliveryTypes = async () => {
            try {
                const data = await deliveryService.getAll();
                setDeliveryTypes(data);
            } catch (error) {
                console.error("Помилка при отриманні DeliveryTypes:", error);
            }
        };

        fetchDeliveryTypes();
    }, []);

    const handleDelete = async (id: number) => {
        const isDeleted = await deliveryService.delete(id);
        if (isDeleted) {
            setDeliveryTypes((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };

    const columns: Column<DeliveryType>[] = [
        { name: "Назва", uid: "name" },
        { name: "Ціна", uid: "price" },
        { name: "Коментар", uid: "comment" },
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
            <CustomTable data={deliveryTypes} columns={columns} onDelete={handleDelete}/>
        </div>
    );
}