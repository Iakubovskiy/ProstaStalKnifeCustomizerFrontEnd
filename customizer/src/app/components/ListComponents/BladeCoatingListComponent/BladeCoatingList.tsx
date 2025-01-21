import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import BladeCoatingColorService from "../../../services/BladeCoatingColorService"
import Link from "next/link";
import {useRouter} from "next/router";
import BladeCoatingColor from "../../../Models/BladeCoatingColor";

export default function BladeCoatingColorList() {
    const [bladeCoatingColors, setBladeCoatingColors] = useState<BladeCoatingColor[]>([]);
    const bladeCoatingColorService = new BladeCoatingColorService();
    const router = useRouter();
    useEffect(() => {
        const fetchBladeCoatingColors = async () => {
            try {
                const data = await bladeCoatingColorService.getAll();
                setBladeCoatingColors(data);
            } catch (error) {
                console.error("Помилка при отриманні форм клинків:", error);
            }
        };

        fetchBladeCoatingColors();
    }, []);

    const bladeActivate = async (id: string, isActive?:boolean) => {
        const updated = isActive
            ? await bladeCoatingColorService.deactivate(id)
            : await bladeCoatingColorService.activate(id);
        if (updated) {
            setBladeCoatingColors((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, isActive: !isActive } : item
                )
            );
        } else {
            alert(`Failed to ${isActive ? "deactivate" : "activate"} the record.`);
        }
    };

    const columns: Column<BladeCoatingColor>[] = [
        { name: "Назва", uid: "type" },
        { name: "Колір", uid: "color" },
        { name: "Ціна", uid: "price" },
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
            <CustomTable data={bladeCoatingColors} columns={columns} onDelete={bladeActivate}/>
        </div>
    );
}