"use client";

import React, { useEffect, useState } from "react";
import BladeShapeService from "@/app/services/BladeShapeService";
import CardComponent from "./CardComponent";
import BladeShape from "@/app/Models/BladeShape";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import { useSnapshot } from "valtio";
import ModalFormButton from "../../ModalButton/ModalButton";


const BladeShapeCustomizationComponent: React.FC = () => {
  const [bladeShapes, setBladeShapes] = useState<BladeShape[]>([]);
  const bladeShapeService = new BladeShapeService();
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchBladeShapes = async () => {
      try {
        const shapes = await bladeShapeService.getAllActive();
        setBladeShapes(shapes);
      } catch (error) {
        console.error("Error fetching blade shapes:", error);
      }
    };

    fetchBladeShapes();
  }, []);

  const bladeShapeSelection = (shape: BladeShape) => {
    state.bladeShape = {
      ...state.bladeShape,
      id: shape.id,
      name: shape.name,
      price: shape.price,
      totalLength: shape.totalLength,
      bladeLength: shape.bladeLength,
      bladeWidth: shape.bladeWidth,
      bladeWeight: shape.bladeWeight,
      sharpeningAngle: shape.sharpeningAngle,
      rockwellHardnessUnits: shape.rockwellHardnessUnits,
      bladeShapeModelUrl: shape.bladeShapeModelUrl,
      sheathModelUrl: shape.sheathModelUrl,
    };
    state.invalidate();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          position: "relative",
        }}
      >
        {bladeShapes.map((shape) => (
          <React.Fragment key={shape.id}>
            <CardComponent
              backgroundPicture={'/icons/blade-shape.svg'}
              tooltipText={shape.name}
              onClick={() => bladeShapeSelection(shape)}
            />
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Characteristics
          data={snap.bladeShape}
          isReadOnly1={true}
          currentBladeCoatingColor={""}
          onChange={() => {}}
          type="BladeShape"
        />
        <div className="p-3">
          <ModalFormButton component="bladeShape"></ModalFormButton>
        </div>
      </div>
    </>
  );
};

export default BladeShapeCustomizationComponent;
