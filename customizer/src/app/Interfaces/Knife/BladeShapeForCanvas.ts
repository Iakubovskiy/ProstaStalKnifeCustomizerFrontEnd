import { AppFile } from "@/app/Interfaces/File";
import {BladeCharacteristics} from "@/app/Interfaces/BladeCharacteristics";

export interface BladeShapeForCanvas {
  id: string;
  name: string;
  shapeType: BladeShapeType;
  bladeShapeImage: AppFile;
  price: number;
  bladeShapeModel: AppFile;
  sheathModel?: AppFile;
  sheathId?: string;
  bladeCharacteristicsModel : BladeCharacteristics;
}
