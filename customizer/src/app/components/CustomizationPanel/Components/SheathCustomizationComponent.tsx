import React, { useEffect, useState } from "react";
import SheathColorService from "../../../services/SheathColorService";
import CardComponent from "./CardComponent";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import { useSnapshot } from "valtio";
import ModalFormButton from "../../ModalButton/ModalButton";
import { SheathColorForCanvas } from "./../../../Interfaces/Knife/SheathColorForCanvas";

const SheathCustomizationComponent: React.FC = () => {
  const [sheathColors, setSheathColors] = useState<SheathColorForCanvas[]>([]);
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    const fetchSheathColors = async () => {
      const service = new SheathColorService();
      const colors = await service.getAllActiveForCanvas();
      console.log(colors);
      setSheathColors(colors);
    };

    fetchSheathColors();
  }, []);

  const sheathColorClick = (color: SheathColorForCanvas) => {
    state.sheathColor = color;
    requestAnimationFrame(() => {
      state.invalidate();
    });
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {sheathColors.map((color) => (
          <CardComponent
            key={color.id}
            backgroundPicture={color.colorCode}
            tooltipText={"color.color"}
            onClick={() => sheathColorClick(color)}
          />
        ))}
      </div>
      {/* <div style={{ marginTop: "16px" }}>
        <Characteristics
          data={snap.sheathColor}
          isReadOnly1={true}
          currentBladeCoatingColor={""}
          onChange={() => {}}
          type="SheathColorForCanvas"
        />
      </div> */}
      <div className="p-3">
        <ModalFormButton component="bladeShape"></ModalFormButton>
      </div>
    </>
  );
};

export default SheathCustomizationComponent;
