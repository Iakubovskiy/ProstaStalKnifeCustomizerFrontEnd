import { BladeCharacteristics } from "@/app/Interfaces/BladeCharacteristics";
import { Sheath } from "@/app/Interfaces/Sheath";
import { AppFile } from "@/app/Interfaces/File";

export interface BladeShape {
  id: string;
  shapeType: BladeShapeType;
  name: string;
  names?: LocalizedContent;
  price: number;
  bladeCharacteristicsModel: BladeCharacteristics;
  bladeShapePhoto: AppFile;
  bladeShapeModel: AppFile;
  isActive: boolean;
  sheath: Sheath | null;
}
