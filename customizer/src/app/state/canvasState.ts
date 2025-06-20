import { proxy } from "valtio";

import { invalidate } from "@react-three/fiber";
import { HandleColorForCanvas } from "../Interfaces/Knife/HandleColorForCanvas";
import { SheathColorForCanvas } from "../Interfaces/Knife/SheathColorForCanvas";
import { BladeCoatingColorForCanvas } from "../Interfaces/Knife/BladeCoatingColorForCanvas";
import { BladeShapeForCanvas } from "../Interfaces/Knife/BladeShapeForCanvas";
import { EngravingForCanvas } from "../Interfaces/Knife/EngravingForCanvas";
import { AttachmentForCanvas } from "../Interfaces/Knife/AttachmentForCanvas";
import { AppFile } from "../Interfaces/File";

interface State {
  invalidate: () => void;
  handleColor: HandleColorForCanvas;
  sheathColor: SheathColorForCanvas;
  bladeCoatingColor: BladeCoatingColorForCanvas;
  bladeShape: BladeShapeForCanvas;
  engravings: EngravingForCanvas[];
  attachment: AttachmentForCanvas | null;
}

const state = proxy<State>({
  invalidate: () => invalidate(),
  handleColor: {
    id: "",
    colorCode: "#d8a635",
    colorMap: null,
    normalMap: null,
    roughnessMap: null,
    modelUrl: null,
  },
  sheathColor: {
    id: "",
    colorMap: null,
    normalMap: null,
    roughnessMap: null,
    colorCode: "",
    engravingColorCode: "",
  },
  bladeCoatingColor: {
    id: "",
    colorCode: "#1810f3",
    engravingColorCode: "",
    colorMap: null,
    normalMap: null,
    roughnessMap: null,
  },

  bladeShape: {
    id: "",
    name: "",
    bladeShapeModel: null as unknown as AppFile,
    sheathModel: null,
  },
  engravings: [],
  attachment: {
    id: "",
    model: null as unknown as AppFile,
  },
});

export const useCanvasState = () => {
  return state;
};
