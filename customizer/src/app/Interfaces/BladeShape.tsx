import {BladeCharacteristics} from "@/app/Interfaces/BladeCharacteristics";
import {Sheath} from "@/app/Interfaces/Sheath";

export interface BladeShape {
  id: string;
  type: BladeShapeType;
  name: string;
  names?: LocalizedContent;
  price: number;
  characteristics: BladeCharacteristics;
  bladeShapePhoto: File;
  bladeShapeModel: File;
  isActive: boolean;
  sheath: Sheath | null;
}
