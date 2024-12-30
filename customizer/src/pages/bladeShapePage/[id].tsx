import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Spinner, Card } from "@nextui-org/react";
import BladeShape from "@/app/Models/BladeShape";
import BladeShapeService from "@/app/services/BladeShapeService";
import "../../styles/globals.css";
import DragNDrop from "@/app/components/DragNDrop/DragNDrop";

const defaultBladeShape: BladeShape = {
  id: 0,
  name: "",
  price: 0,
  totalLength: 0,
  bladeLength: 0,
  bladeWidth: 0,
  bladeWeight: 0,
  sharpeningAngle: 0,
  rockwellHardnessUnits: 0,
  engravingLocationX: 0,
  engravingLocationY: 0,
  engravingLocationZ: 0,
  engravingRotationX: 0,
  engravingRotationY: 0,
  engravingRotationZ: 0,
  bladeShapeModelUrl: "1",
  sheathModelUrl: "1",
};

const BladeShapeEditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [bladeShape, setBladeShape] = useState<BladeShape | null>(null);
  const [bladeShapeService, setbladeShapeService] = useState<BladeShapeService>(
    new BladeShapeService()
  );
  const [files, setFiles] = useState({
    bladeShapeModel: null,
    sheathModel: null,
  });

  useEffect(() => {
    const fetchBladeShape = async () => {
      if (id) {
        const numericId = parseInt(id as string, 10);

        if (isNaN(numericId)) {
          console.error("Invalid ID");
          return;
        }

        if (numericId === 0) {
          setIsCreating(true);
          setBladeShape({ ...defaultBladeShape });
          setLoading(false);
          return;
        }

        try {
          const data = await bladeShapeService.getById(numericId);
          setBladeShape(data);
        } catch (error) {
          console.error("Error fetching blade shape:", error);
          alert("Error loading blade shape data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBladeShape();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBladeShape((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value === "" ? 0 : Number(value) || value,
      };
    });
  };

  const handleFileSelected = (key: string, file: File | null) => {
    if (file) {
      const validExtensions = [".glb", ".gltf"];
      const fileExtension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        alert("Допустимі формати файлів: .glb, .gltf");
        setFiles((prev) => ({ ...prev, [key]: null })); // Очищення файлу зі стану
        return;
      }
    }

    // Оновлення файлу, якщо все гаразд
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async () => {
    if (!bladeShape) return;

    try {
      const { bladeShapeModel, sheathModel } = files;
      const modelFiles: { [key: string]: File | null } = {
        bladeShapeModel,
        sheathModel,
      };

      if (Object.values(modelFiles).some((file) => !file)) {
        alert("Please upload all required files.");
        return;
      }

      if (isCreating) {
        const createData = bladeShape;

        var response = await bladeShapeService.create(
          bladeShape,
          modelFiles as { [key: string]: File }
        );
        alert("Blade shape created successfully");
      } else {
        await bladeShapeService.update(
          bladeShape.id,
          bladeShape,
          modelFiles as { [key: string]: File }
        );
        alert("Changes saved successfully");
      }

      router.push("/bladeShapePage/");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(`Error ${isCreating ? "creating" : "saving"} blade shape`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner
          size="lg"
          color="primary"
          label="Loading blade shape details..."
        />
      </div>
    );
  }

  if (!bladeShape) {
    return <div>Не знайдено!</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 border border-gray-200 shadow-md">
          {/* Empty div for future use */}
        </div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isCreating ? "Створення форми клинка" : "Оновлення форми клинка"}
          </h1>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Базова інформація</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Назва"
                name="name"
                value={bladeShape.name}
                onChange={handleInputChange}
              />
              <Input
                label="Ціна"
                name="price"
                type="number"
                value={bladeShape.price.toString()}
                onChange={handleInputChange}
              />
              <Input
                label="Довжина ножа"
                name="totalLength"
                type="number"
                value={bladeShape.totalLength.toString()}
                onChange={handleInputChange}
              />
              <Input
                label="Довжина клинка"
                name="bladeLength"
                type="number"
                value={bladeShape.bladeLength.toString()}
                onChange={handleInputChange}
              />
              <Input
                label="Ширина клинка"
                name="bladeWidth"
                type="number"
                value={bladeShape.bladeWidth.toString()}
                onChange={handleInputChange}
              />
              <Input
                label="Вага клинка"
                name="bladeWeight"
                type="number"
                value={bladeShape.bladeWeight.toString()}
                onChange={handleInputChange}
              />
              <Input
                label="Кут заточки"
                name="sharpeningAngle"
                type="number"
                value={bladeShape.sharpeningAngle.toString()}
                onChange={handleInputChange}
              />
              <Input
                label="Твердість в Роквеллах"
                name="rockwellHardnessUnits"
                type="number"
                value={bladeShape.rockwellHardnessUnits.toString()}
                onChange={handleInputChange}
              />
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Моделі: Форма клинка , Піхви
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DragNDrop
                onFileSelected={(file) =>
                  handleFileSelected("bladeShapeModel", file)
                }
                validExtensions={[".glb", ".gltf"]}
                fileUrl={
                  !isCreating ? bladeShape.bladeShapeModelUrl : undefined
                }
              />
              <DragNDrop
                onFileSelected={(file) =>
                  handleFileSelected("sheathModel", file)
                }
                validExtensions={[".glb", ".gltf"]}
                fileUrl={!isCreating ? bladeShape.sheathModelUrl : undefined}
              />
            </div>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button color="danger" variant="flat" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              {isCreating ? "Створити" : "Зберегти"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BladeShapeEditPage;
