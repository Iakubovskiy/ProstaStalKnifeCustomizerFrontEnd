import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import BladeShapeService from "../../../services/BladeShapeService"

export default function BladeShapeList() {
    const [bladeShapes, setBladeShapes] = useState<BladeShape[]>([]);
    const bladeShapeService = new BladeShapeService();

    useEffect(() => {
        const fetchBladeShapes = async () => {
            try {
                const data = await bladeShapeService.getAll();
                setBladeShapes(data);
            } catch (error) {
                console.error("Помилка при отриманні Кольорів:", error);
            }
        };

        fetchBladeShapes();
    }, []);

    const bladeDelete = async (id: number) => {
        const isDeleted = await bladeShapeService.delete(id);
        if (isDeleted) {
            setBladeShapes((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
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
            <CustomTable data={bladeShapes} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}