import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import SheathColorService from "../../../services/SheathColorService"
import Link from "next/link";
import {useRouter} from "next/router";

export default function SheathColorList() {
    const [sheathColors, setSheathColors] = useState<SheathColor[]>([]);
    const sheathColorService = new SheathColorService();
    const router = useRouter();
    useEffect(() => {
        const fetchSheathColors = async () => {
            try {
                const data = await sheathColorService.getAll();
                const sanitizedData = data.map((item) => ({
                    ...item,
                    materialUrl: item.materialUrl || "",
                }));
                setSheathColors(sanitizedData);
            } catch (error) {
                console.error("Помилка при отриманні Кольорів:", error);
            }
        };

        fetchSheathColors();
    }, []);

    const bladeDelete = async (id: number) => {
        const isDeleted = await sheathColorService.delete(id);
        if (isDeleted) {
            setSheathColors((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };

    const columns: Column<SheathColor>[] = [
        { name: "Колір", uid: "colorName" },
        { name: "Ціна", uid: "price" },
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
                <Link href="/admin/dashboard" passHref>
                    <Button color="primary">
                        Back
                    </Button>
                </Link>
            </div>
            <CustomTable data={sheathColors} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}