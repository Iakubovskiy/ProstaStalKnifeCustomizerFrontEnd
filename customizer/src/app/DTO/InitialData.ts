import BladeShape from "@/app/Models/BladeShape";
import HandleColor from "@/app/Models/HandleColor";
import SheathColor from "@/app/Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";
import { BladeShapeForCanvas } from "../Interfaces/Knife/BladeShapeForCanvas";
import { HandleColorForCanvas } from "../Interfaces/Knife/HandleColorForCanvas";
import { SheathColorForCanvas } from "../Interfaces/Knife/SheathColorForCanvas";
import { BladeCoatingColorForCanvas } from "../Interfaces/Knife/BladeCoatingColorForCanvas";

export default interface InitialData {
  bladeShape: BladeShapeForCanvas;
  handleColor: HandleColorForCanvas;
  sheathColor: SheathColorForCanvas;
  bladeCoatingColor: BladeCoatingColorForCanvas;
}
