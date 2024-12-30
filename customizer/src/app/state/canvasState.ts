import { proxy } from "valtio";
import { useEffect } from "react";
import BladeCoating from "@/app/Models/BladeCoating";
import BladeShape from "@/app/Models/BladeShape";
import Fastening from "@/app/Models/Fastening";
import SheathColor from "@/app/Models/SheathColor";
import HandleColor from "@/app/Models/HandleColor";
import Engraving from "@/app/Models/Engraving";

interface State {
  handleColor: HandleColor;
  sheathColor: SheathColor;
  bladeCoatingColor: BladeCoatingColor;
  bladeCoating: BladeCoating;
  bladeShape: BladeShape;
  engraving: Engraving[];
  fastening: Fastening[];
}

const state = proxy<State>({
  handleColor: {
    id: 0,
    colorName: "",
    colorCode: "#d8a635",
    material: "",
    materialUrl: ""
  },
  sheathColor: {
    id: 0,
    colorName: "",
    materialUrl: "",
    price: 0,
    material: "",
    colorCode: "",
    EngravingColorCode: "",
  },
  bladeCoatingColor: {
    id: 0,
    color: "",
    colorCode: "#1810f3",
    engravingColorCode: "",
  },
  bladeCoating: {
    id: 0,
    name: "",
    price: 0,
    colors: [],
    materialUrl: "",
  },
  bladeShape: {
    id: 0,
    name: "",
    bladeShapeModelUrl: "",
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
    sheathModelUrl: "",
  },
  engraving: [],
  fastening: [],
});

export const useCanvasState = () => {
  return state;
};
