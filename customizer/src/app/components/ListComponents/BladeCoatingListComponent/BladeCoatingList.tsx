import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import BladeCoatingService from "../../../services/BladeCoatingService";
import BladeCoating from "../../../Models/BladeCoating";

import Link from "next/link";
import {useRouter} from "next/router";

export default function BladeCoatingList() {
    const [bladeCoatings, setBladeCoatings] = useState<BladeCoating[]>([]);
    const bladeCoatingService = new BladeCoatingService();
    const router = useRouter();

    useEffect(() => {
        const fetchBladeCoatings = async () => {
            try {
                const data = await bladeCoatingService.getAll();
                setBladeCoatings(data);
            } catch (error) {
                console.error("Помилка при отриманні Покриття клинків:", error);
            }
        };

        fetchBladeCoatings();
    }, []);

    const bladeDelete = async (id: number) => {
        const isDeleted = await bladeCoatingService.delete(id);
        if (isDeleted) {
            setBladeCoatings((prevData) => prevData.filter((item) => item.id !== id));
        } else {
            alert("Failed to delete the record.");
        }
    };
    const preparedCoatings = bladeCoatings.map((bladeCoating) => ({
        ...bladeCoating,
        colorsString: bladeCoating.colors.map((color)=> color.color).join(','),
    }));
    const columns: Column<typeof preparedCoatings[number]>[] = [
        { name: "Назва", uid: "name" },
        { name: "Ціна", uid: "price" },
        { name: "Кольори", uid: "colorsString" },

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
            <CustomTable data={preparedCoatings} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}