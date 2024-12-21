import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import HandleColorService from "../../../services/HandleColorService"
import Link from "next/link";
import { useRouter } from "next/router";

export default function HandleColorList() {
    const [handleColors, setHandleColors] = useState<HandleColor[]>([]);
    const handleColorService = new HandleColorService();
    const router = useRouter();
    useEffect(() => {
        const fetchHandleColors = async () => {
            try {
                const data = await handleColorService.getAll();
                setHandleColors(data);
            } catch (error) {
                console.error("Помилка при отриманні Кольорів:", error);
            }
        };

        fetchHandleColors();
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
        { name: "Колір", uid: "colorName" },
        { name: "Матеріал", uid: "material" },
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <Link href={`${router.pathname}/0`}>
                    <Button color="success">
                        Create
                    </Button>
                </Link>
                <Link href="/dashboard" passHref>
                    <Button color="primary">
                        Back
                    </Button>
                </Link>

            </div>
            <CustomTable data={handleColors} columns={columns} onDelete={handleDelete}/>
        </div>
    );
}