import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import FasteningService from "../../../services/FasteningService"
import Link from "next/link";
import {useRouter} from "next/router";
import Fastening from "@/app/Models/Fastening";

export default function FasteningList() {
    const [fastenings, setFastenings] = useState<Fastening[]>([]);
    const fasteningService = new FasteningService();
    const router = useRouter();
    useEffect(() => {
        const fetchFastenings = async () => {
            try {
                const data = await fasteningService.getAll();
                setFastenings(data);
            } catch (error) {
                console.error("Помилка при отриманні Кріплень:", error);
            }
        };

        fetchFastenings();
    }, []);

    const bladeDelete = async (id: number) => {
        const isDeleted = await fasteningService.delete(id);
        if (isDeleted) {
            setFastenings((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };

    const columns: Column<Fastening>[] = [
        { name: "Колір", uid: "color" },
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
            <CustomTable data={fastenings} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}