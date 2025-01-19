"use client"
import React from "react";
import "../../styles/globals.css";
import {Link, Button} from "@nextui-org/react";

const DashboardPage = () => {
    return (
        <div className={"main-div container w-screen h-screen flex flex-col justify-center items-center space-y-8"}>
            <Button
                as={Link}
                color="warning"
                href="/orderPage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Замовлення
            </Button>
            <Button
                as={Link}
                color="primary"
                href="/bladeShapePage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Форми клинка
            </Button>
            <Button
                as={Link}
                color="secondary"
                href="/deliveryTypePage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Види доставки
            </Button>
            <Button
                as={Link}
                color="danger"
                href="/engravingPricePage/1"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Вартість гравіювання
            </Button>
            <Button
                as={Link}
                color="success"
                href="/fasteningPage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Кріплення
            </Button>
            <Button
                as={Link}
                color="warning"
                href="/handleColorPage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Кольори руків'я
            </Button>
            <Button
                as={Link}
                color="primary"
                href="/sheathColorPage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Кольори піхв
            </Button>
            <Button
                as={Link}
                color="secondary"
                href="/orderStatusesPage"
                variant="solid"
                className="w-80 text-2xl font-semibold"
            >
                Статуси замовлення
            </Button>
        </div>
    );
};

export default DashboardPage;