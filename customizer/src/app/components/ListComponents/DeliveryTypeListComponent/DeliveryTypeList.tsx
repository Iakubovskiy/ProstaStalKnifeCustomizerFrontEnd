import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import DeliveryTypeService from "../../../services/DeliveryTypeService"
import Link from "next/link";
import {useRouter} from "next/router";
import DeliveryType from "@/app/Models/DeliveryType";

export default function DeliveryTypeList() {
    const [deliveryTypes, setDeliveryTypes] = useState<DeliveryType[]>([]);
    const deliveryService = new DeliveryTypeService();
    const router = useRouter();
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

    const deliveryActivate = async (id: string, isActive?:boolean) => {
        const updated = isActive
            ? await deliveryService.deactivate(id)
            : await deliveryService.activate(id);
        if (updated) {
            setDeliveryTypes((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, isActive: !isActive } : item
                )
            );
        } else {
            alert(`Failed to ${isActive ? "deactivate" : "activate"} the record.`);
        }
    };

    const columns: Column<DeliveryType>[] = [
        { name: "Назва", uid: "name" },
        { name: "Ціна", uid: "price" },
        { name: "Коментар", uid: "comment" },
        { name: "Активний", uid: "isActive" },
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
            <CustomTable data={deliveryTypes} columns={columns} onDelete={deliveryActivate}/>
        </div>
    );
}