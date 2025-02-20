import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import BladeShapeService from "../../../services/BladeShapeService"
import Link from "next/link";
import {useRouter} from "next/router";
import BladeShape from "../../../Models/BladeShape";

export default function BladeShapeList() {
    const [bladeShapes, setBladeShapes] = useState<BladeShape[]>([]);
    const bladeShapeService = new BladeShapeService();
    const router = useRouter();
    useEffect(() => {
        const fetchBladeShapes = async () => {
            try {
                const data = await bladeShapeService.getAll();
                setBladeShapes(data);
            } catch (error) {
                console.error("Помилка при отриманні форм клинків:", error);
            }
        };

        fetchBladeShapes();
    }, []);

    const bladeActivate = async (id: string, isActive?:boolean) => {
        const updated = isActive
            ? await bladeShapeService.deactivate(id)
            : await bladeShapeService.activate(id);
        if (updated) {
            setBladeShapes((prevData) =>
                prevData.map((item) =>
                    item.id === id ? { ...item, isActive: !isActive } : item
                )
            );
        } else {
            alert(`Failed to ${isActive ? "deactivate" : "activate"} the record.`);
        }
    };

    const columns: Column<BladeShape>[] = [
        { name: "Назва", uid: "name" },
        { name: "Ціна", uid: "price" },
        { name: "Загальна довжина", uid: "totalLength" },
        { name: "Довжина Клинка", uid: "bladeLength" },
        { name: "Ширина клинка", uid: "bladeWidth" },
        { name: "Вага", uid: "bladeWeight" },
        { name: "Кут заточки", uid: "sharpeningAngle" },
        { name: "Твердість по Роквеллу", uid: "rockwellHardnessUnits" },
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
            <CustomTable data={bladeShapes} columns={columns} onDelete={bladeActivate}/>
        </div>
    );
}