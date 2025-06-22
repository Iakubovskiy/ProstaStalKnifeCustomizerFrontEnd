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
  id: string;
  handleColor: HandleColorForCanvas;
  sheathColor: SheathColorForCanvas;
  bladeCoatingColor: BladeCoatingColorForCanvas;
  bladeShape: BladeShapeForCanvas;
  engravings: EngravingForCanvas[];
  attachment: AttachmentForCanvas | null;
}

const state = proxy<State>({
  invalidate: () => invalidate(),
  id: "",
  handleColor: {
    id: "",
    price: 0,
    colorCode: "#d8a635",
    colorMap: null,
    normalMap: null,
    roughnessMap: null,
    modelUrl: null,
  },
  sheathColor: {
    id: "",
    colorMap: null,
    prices: [] as SheathColorForCanvas["prices"],
    normalMap: null,
    roughnessMap: null,
    colorCode: "",
    engravingColorCode: "",
  },
  bladeCoatingColor: {
    id: "",
    price: 0,
    colorCode: "#1810f3",
    engravingColorCode: "",
    colorMap: null,
    normalMap: null,
    roughnessMap: null,
  },

  bladeShape: {
    id: "",
    name: "",
    sheathId: "",
    shapeType: null as unknown as BladeShapeType,
    price: 0,
    bladeShapeImage: null as unknown as AppFile,
    bladeShapeModel: null as unknown as AppFile,
    sheathModel: null as unknown as AppFile,
  },
  engravings: [] as EngravingForCanvas[],
  attachment: null as AttachmentForCanvas | null,
});

export const useCanvasState = () => {
  return state;
};
