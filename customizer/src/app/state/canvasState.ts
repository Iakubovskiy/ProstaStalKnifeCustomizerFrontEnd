import { proxy } from "valtio";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import BladeShape from "@/app/Models/BladeShape";
import Fastening from "@/app/Models/Fastening";
import SheathColor from "@/app/Models/SheathColor";
import HandleColor from "@/app/Models/HandleColor";
import Engraving from "@/app/Models/Engraving";
import { invalidate } from "@react-three/fiber";

interface State {
  invalidate:() => void;
  handleColor: HandleColor;
  sheathColor: SheathColor;
  bladeCoatingColor: BladeCoatingColor;
  bladeShape: BladeShape;
  engravings: Engraving[];
  fastening: Fastening | null;
}

const state = proxy<State>({
  invalidate : () => invalidate(),
  handleColor: {
    id: "",
    colorName: "",
    colorCode: "#d8a635",
    material: "",
    isActive: false,
    colorMapUrl: null,
    normalMapUrl: null,
    roughnessMapUrl: null,
  },
  sheathColor: {
    id: "",
    color: "",
    price: 0,
    material: "",
    isActive: true,
    colorMapUrl: null,
    normalMapUrl: null,
    roughnessMapUrl: null,
    colorCode: "",
    engravingColorCode: "",
  },
  bladeCoatingColor: {
    id: "",
    color: "",
    colorCode: "#1810f3",
    engravingColorCode: "",
    type: "",
    price: 0,
    isActive: true,
    colorMapUrl: null,
    normalMapUrl: null,
    roughnessMapUrl: null,
  },

  bladeShape: {
    id: "",
    name: "",
    bladeShapeModelUrl: "",
    price: 0,
    totalLength: 0,
    bladeLength: 0,
    bladeWidth: 0,
    bladeWeight: 0,
    sharpeningAngle: 0,
    rockwellHardnessUnits: 0,
    sheathModelUrl: "",
    isActive: false,
  },
  engravings: [],
  fastening: {
    id: "",
    name: "",
    color: "",
    colorCode: "",
    price: 0,
    material: "",
    modelUrl: "",
    isActive: true,
  },
});

export const useCanvasState = () => {
  return state;
};
