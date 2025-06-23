import { AppFile } from "@/app/Interfaces/File";

export interface BladeCoatingColorForCanvas {
  id: string;
  price: number;
  colorCode: string;
  color: string;
  type: string;
  engravingColorCode: string;
  colorMap: AppFile | null;
  normalMap: AppFile | null;
  roughnessMap: AppFile | null;
}
