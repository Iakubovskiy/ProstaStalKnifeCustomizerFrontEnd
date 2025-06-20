import {AppFile} from "@/app/Interfaces/File";
import { Texture } from "@/app/Interfaces/Texture";

export interface BladeCoatingColor {
  id: string;
  price: number;
  color: string;
  colorCode: string | null;
  engravingColorCode: string;
  isActive: boolean;
  texture: Texture | null;
  colorMap: AppFile | null;
}
