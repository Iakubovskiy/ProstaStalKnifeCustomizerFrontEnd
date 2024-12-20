import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import HandleColorService from "../../services/HandleColorService"

export default function HandleColorList() {
    const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
    const handleColorService = new HandleColorService();

    useEffect(() => {
        const fetchDeliveryTypes = async () => {
            try {
                const data = await handleColorService.getAll();
                setHandleColors(data);
            } catch (error) {
                console.error("Помилка при отриманні Кольорів:", error);
            }
        };

        fetchDeliveryTypes();
    }, []);

    const handleDelete = async (id: number) => {
        const isDeleted = await handleColorService.delete(id);
        if (isDeleted) {
            setHandleColors((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };

    const columns: Column<HandleColor>[] = [
        { name: "Колір", uid: "color" },
        { name: "Матеріал", uid: "material" },
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
            <CustomTable data={handleColors} columns={columns} onDelete={handleDelete}/>
        </div>
    );
}