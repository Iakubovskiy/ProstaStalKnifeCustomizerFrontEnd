"use client";

import React, { useEffect, useState } from "react";
import BladeShapeService from "@/app/services/BladeShapeService";
import CardComponent from "./CardComponent";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import { useSnapshot } from "valtio";
import ModalFormButton from "../../ModalButton/ModalButton";
import styles from "./BladeShapeCustomization.module.css";
import { BladeShapeForCanvas } from "@/app/Interfaces/Knife/BladeShapeForCanvas";
import SheathService from "@/app/services/SheathService";
import { AppFile } from "@/app/Interfaces/File";

const BladeShapeCustomizationComponent: React.FC = () => {
  const [bladeShapes, setBladeShapes] = useState<BladeShapeForCanvas[]>([]);
  const bladeShapeService = new BladeShapeService();
  const sheathService = new SheathService();
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchBladeShapes = async () => {
      try {
        const shapes = await bladeShapeService.getAllActiveForCanvas();
        setBladeShapes(shapes);
      } catch (error) {
        console.error("Error fetching blade shapes:", error);
      }
    };

    fetchBladeShapes();
  }, []);

  const bladeShapeSelection = async (shape: BladeShapeForCanvas) => {
    console.log(shape);
    let sheathModel: AppFile | undefined = undefined;
    if (shape.sheathId && shape.sheathId !== "") {
      const sheath = await sheathService.getById(shape.sheathId);
      if (sheath && sheath.model) {
        sheathModel = sheath.model;
      }
    }
    state.bladeShape = {
      ...state.bladeShape,
      id: shape.id,
      name: shape.name,
      bladeShapeModel: shape.bladeShapeModel,
      sheathModel: sheathModel,
      sheathId: shape.sheathId,
    };
    state.invalidate();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Форма клинка</h2>
        <ModalFormButton component="bladeShape" />
      </div>

      <div className={styles.selectionGrid}>
        {bladeShapes.map((shape) => (
          <CardComponent
            key={shape.id}
            backgroundPicture="/icons/blade-shape.svg"
            tooltipText={shape.name}
            onClick={() => bladeShapeSelection(shape)}
          />
        ))}
      </div>
    </div>
  );
};

export default BladeShapeCustomizationComponent;
