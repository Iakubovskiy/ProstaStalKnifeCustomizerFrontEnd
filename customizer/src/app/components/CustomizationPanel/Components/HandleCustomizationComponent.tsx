import React, { useEffect, useState } from "react";
import HandleColorService from "../../../services/HandleService";
import CardComponent from "./CardComponent";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import { useSnapshot } from "valtio";
import ModalFormButton from "../../ModalButton/ModalButton";
import { HandleColorForCanvas } from "./../../../Interfaces/Knife/HandleColorForCanvas";

const HandleCustomizationComponent: React.FC = () => {
  const [handleColors, setHandleColors] = useState<HandleColorForCanvas[]>([]);
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    const fetchHandleColors = async () => {
      const service = new HandleColorService();
      const colors = await service.getAllActiveForCanvas();
      setHandleColors(colors);
    };

    fetchHandleColors();
  }, []);

  const handleColorClick = (color: HandleColorForCanvas) => {
    state.handleColor = color;
    requestAnimationFrame(() => {
      state.invalidate();
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {handleColors.map((color) => (
          <CardComponent
            key={color.id}
            backgroundPicture={color.colorCode}
            tooltipText={""}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Characteristics
            key = {snap.handleColor.id}
            data={
              snap.handleColor
            }
            isReadOnly1={true}
            currentBladeCoatingColor={""}
            onChange={() => {}}
            type="HandleForCanvas"
        />
      </div>

      <div className="p-3">
        <ModalFormButton component="handle"></ModalFormButton>
      </div>
    </>
  );
};

export default HandleCustomizationComponent;
