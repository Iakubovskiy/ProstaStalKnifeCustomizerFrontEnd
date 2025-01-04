"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Pagination, Spinner, Card } from "@nextui-org/react";
import styles from "./orderDetails.module.css";
import OrderService from "@/app/services/OrderService";
import KnifeService from "@/app/services/KnifeService";
import DeliveryDataDTO from "@/app/DTO/DeliveryDataDTO";
import {useCanvasState} from "../../app/state/canvasState";
import "../../styles/globals.css";
import Order from "../../app/Models/Order";
import CustomCanvas from "@/app/components/CustomCanvas/CustomCanvas";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isCreating, setCreating] = useState<boolean>(false);
  const [orderservice] = useState<OrderService>(new OrderService());
  const knifeService = new KnifeService();
  const state = useCanvasState();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const [order, setOrder] = useState<Order>(exampleOrder);
  const [formData, setFormData] = useState({
    number: exampleOrder.number,
    clientFullName: exampleOrder.clientFullName,
    total: exampleOrder.total,
    comment: exampleOrder.comment,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    const updatedOrder = {
      ...order,
      ...formData,
    };
    setOrder(updatedOrder);
    console.log("Збережено зміни:", updatedOrder);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (id) {
        const numericId = parseInt(id as string, 10);

        if (isNaN(numericId)) {
          console.error("ID is not a valid number");
          return;
        }

        if (numericId === 0) {
          setCreating(true);
          setLoading(false);
        } else {
          try {
            const fetchedOrder = await orderservice.getById(numericId);

            const knives = await Promise.all(
                fetchedOrder.knives.map(async (knife) => {
                  const knifeData = await knifeService.getById(knife.id);
                  return {
                    ...knife,
                    ...knifeData,
                  };
                })
            );
            const normalizedOrder: Order = {
              ...fetchedOrder,
              knives,
            };
            setOrder(normalizedOrder);
            setFormData({
              number: fetchedOrder.number,
              clientFullName: fetchedOrder.clientFullName,
              total: fetchedOrder.total,
              comment: fetchedOrder.comment,
            });
            setLoading(false);
          } catch (error) {
            console.error("Error fetching order details:", error);
            alert("Помилка отримання даних. Перевірте ID.");
            //router.push("/orderDetails/0");
          }
        }
      }
    };
    fetchOrderDetails();
  }, [id]);

  const totalPages = order ? Math.ceil(order.knives.length / itemsPerPage) : 0;
  const paginatedKnifes = order
    ? order.knives.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];
  useEffect(() => {
    if (paginatedKnifes[0]) {
      state.handleColor = paginatedKnifes[0].handleColor;
      state.sheathColor = paginatedKnifes[0].sheathColor;
      state.bladeCoatingColor = paginatedKnifes[0].bladeCoatingColor;
      state.bladeCoating = paginatedKnifes[0].bladeCoating;
      state.bladeShape = paginatedKnifes[0].shape;
      state.engravings = paginatedKnifes[0].engravings || [];
      state.fastening = paginatedKnifes[0].fastening || [];
      console.log(state);
    }
  }, [currentPage, paginatedKnifes]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading order details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="p-6 mb-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Замовлення</h1>
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <Input
              label="Номер замовлення"
              name="number"
              fullWidth
              value={formData.number}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Input
              label="Ім'я клієнта"
              name="clientFullName"
              fullWidth
              value={formData.clientFullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Input
              label="Сума"
              name="total"
              type="number"
              fullWidth
              value={formData.total.toString()}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Input
              label="Коментар"
              name="comment"
              fullWidth
              defaultValue={formData.comment ?? ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <Button
          onClick={handleSaveChanges}
          color="primary"
          className="mt-4 w-full"
        >
          Зберегти
        </Button>
      </Card>

      <Card className="p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Ножі</h2>
        <div className="space-y-6">
          {paginatedKnifes.map((knife) => (
            <Card
              key={knife.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-gray-200 min-h-[200px]">
                  <CustomCanvas/>
                </div>
                <div className="w-full md:w-1/2 p-6">
                  <p>
                    <strong>Форма:</strong> {knife.shape.name}
                  </p>
                  <p>
                    <strong>Довжина клинка:</strong> {knife.shape.bladeLength}{" "}
                    mm
                  </p>
                  <p>
                    <strong>Покриття:</strong> {knife.bladeCoating.name}
                  </p>
                  <p>
                    <strong>Матеріал руків'я:</strong>{" "}
                    {knife.handleColor.material}
                  </p>
                  <p>
                    <strong>Колір піхв:</strong> {knife.sheathColor.color}
                  </p>
                  <p>
                    <strong>Ціна:</strong> ${knife.sheathColor.price}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;

const exampleOrder: Order = {
  id: 1,
  number: "ORD-20231222-001",
  total: 750.0,
  knives: [
    {
      id: 1,
      shape: {
        id: 1,
        name: "Drop Point",
        price: 50.0,
        totalLength: 210,
        bladeLength: 100,
        bladeWidth: 25,
        bladeWeight: 150,
        sharpeningAngle: 20,
        rockwellHardnessUnits: 58,
        engravingLocationX: 10,
        engravingLocationY: 15,
        engravingLocationZ: 5,
        engravingRotationX: 0,
        engravingRotationY: 0,
        engravingRotationZ: 0,
        bladeShapeModelUrl: "https://example.com/models/drop-point.obj",
        sheathModelUrl: "https://example.com/models/sheath.obj",
      },
      bladeCoating: {
        id: 1,
        name: "Cerakote",
        price: 20.0,
        colors: [
          {
            id: 1,
            color: "Black",
            colorCode: "#000000",
            engravingColorCode: "#FFFFFF",
          },
        ],
        materialUrl: "",
      },
      bladeCoatingColor: {
        id: 1,
        color: "Black",
        colorCode: "#000000",
        engravingColorCode: "#FFFFFF",
      },
      handleColor: {
        id: 1,
        colorName: "Wood Brown",
        colorCode: "#8B4513",
        material: "Wood",
        materialUrl: "https://example.com/materials/wood.jpg",
      },
      sheathColor: {
        id: 1,
        color: "Dark Brown",
        colorCode: "#ffffff",
        material: "Leather",
        materialUrl: "https://example.com/materials/leather.jpg",
        price: 15.0,
        engravingColorCode: "",
      },
      fastening: [
        {
          id: 1,
          name: "Belt Clip",
          color: "Silver",
          colorCode: "#C0C0C0",
          price: 10.0,
          material: "Metal",
          modelUrl: "https://example.com/models/belt-clip.obj",
        },
      ],
      engravings: [
        {
          id: 1,
          name: "Custom Text",
          side: 1,
          text: "For John",
          font: "Montserrat",
          pictureUrl: null,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          locationX: 5,
          locationY: 10,
          locationZ: 0,
          scaleX: 1,
          scaleY: 1,
          scaleZ: 1,
        },
      ],
      quantity: 1,
    },
    {
      id: 2,
      shape: {
        id: 2,
        name: "Tanto",
        price: 60.0,
        totalLength: 200,
        bladeLength: 95,
        bladeWidth: 30,
        bladeWeight: 140,
        sharpeningAngle: 25,
        rockwellHardnessUnits: 60,
        engravingLocationX: 12,
        engravingLocationY: 14,
        engravingLocationZ: 6,
        engravingRotationX: 0,
        engravingRotationY: 0,
        engravingRotationZ: 0,
        bladeShapeModelUrl: "https://example.com/models/tanto.obj",
        sheathModelUrl: "https://example.com/models/sheath.obj",
      },
      bladeCoating: {
        id: 2,
        name: "Powder Coating",
        price: 25.0,
        colors: [
          {
            id: 2,
            color: "Grey",
            colorCode: "#808080",
            engravingColorCode: "#000000",
          },
        ],
        materialUrl: "",
      },
      bladeCoatingColor: {
        id: 2,
        color: "Grey",
        colorCode: "#808080",
        engravingColorCode: "#000000",
      },
      handleColor: {
        id: 2,
        colorName: "Black Ebony",
        colorCode: "#000000",
        material: "Wood",
        materialUrl: "https://example.com/materials/ebony.jpg",
      },
      sheathColor: {
        id: 2,
        color: "Black",
        colorCode: "#000000",
        material: "Leather",
        materialUrl: "https://example.com/materials/leather-black.jpg",
        price: 20.0,
        engravingColorCode: "#ffffff",
      },
      fastening: [
        {
          id: 2,
          name: "Snap Button",
          color: "Black",
          colorCode: "#000000",
          price: 12.0,
          material: "Plastic",
          modelUrl: "https://example.com/models/snap-button.obj",
        },
      ],
      engravings: [
        {
          id: 2,
          name: "Logo Engraving",
          side: 2,
          text: null,
          font: "Montserrat",
          pictureUrl: "https://example.com/images/logo.jpg",
          rotationX: 5,
          rotationY: 10,
          rotationZ: 15,
          locationX: 7,
          locationY: 8,
          locationZ: 9,
          scaleX: 2,
          scaleY: 2,
          scaleZ: 2,
        },
      ],
      quantity: 2,
    },
  ],
  delivery: {
    id: 1,
    name: "Standard Shipping",
    price: 20.0,
    comment: "Delivery in 5-7 business days.",
  },
  clientFullName: "John Doe",
  clientPhoneNumber: "+123456789",
  countryForDelivery: "USA",
  city: "New York",
  email: "johndoe@example.com",
  comment: "Please deliver to my office address.",
  status: {
    id: 1,
    status: "Pending",
  },
};
