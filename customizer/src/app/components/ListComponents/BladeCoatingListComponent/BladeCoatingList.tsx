import React, { useEffect, useState } from "react";
import CustomTable from "../CustomTableComponent/CustomTable";
import {Column} from "../CustomTableComponent/CustomTable";
import { Button } from "@nextui-org/react";
import BladeCoatingService from "../../../services/BladeCoatingService"
import {color} from "framer-motion";

export default function BladeCoatingList() {
    const [bladeCoatings, setBladeCoatings] = useState<BladeCoating[]>([]);
    const bladeCoatingService = new BladeCoatingService();

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
        { name: "Назва", uid: "type" },
        { name: "Ціна", uid: "price" },
        { name: "Кольори", uid: "colorsString" },

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
            <CustomTable data={preparedCoatings} columns={columns} onDelete={bladeDelete}/>
        </div>
    );
}