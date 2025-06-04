import React, { useEffect, useState } from "react";
import BladeCoatingColorService from "../../../services/BladeCoatingColorService";
import BladeCoatingColor from "../../../Models/BladeCoatingColor";
import CardComponent from "./CardComponent";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import { useSnapshot } from "valtio";
import ModalFormButton from "../../ModalButton/ModalButton";

const BladeCoatingCustomizationComponent: React.FC = () => {
  const [bladeCoatingColors, setBladeCoatingColors] = useState<
    BladeCoatingColor[]
  >([]);
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    const fetchBladeCoatingColors = async () => {
      const service = new BladeCoatingColorService();
      const colors = await service.getAllActive();
      setBladeCoatingColors(colors);
    };

    fetchBladeCoatingColors();
  }, []);

  const bladeCoatingColorClick = (color: BladeCoatingColor) => {
    state.bladeCoatingColor = color;
    requestAnimationFrame(() => {
      state.invalidate();
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {bladeCoatingColors.map((color) => (
          <CardComponent
            key={color.id}
            backgroundPicture={color.colorCode}
            tooltipText={`${color.type}, ${color.color}`}
            onClick={() => bladeCoatingColorClick(color)}
          />
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Characteristics
          data={snap.bladeCoatingColor}
          isReadOnly1={true}
          currentBladeCoatingColor={""}
          onChange={() => {}}
          type="BladeCoatingColor"
        />
      </div>
      <div className="p-3">
        <ModalFormButton component="bladeShape"></ModalFormButton>
      </div>
    </>
  );
};

export default BladeCoatingCustomizationComponent;
