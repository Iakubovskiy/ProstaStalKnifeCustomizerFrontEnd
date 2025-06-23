import { AppFile } from "@/app/Interfaces/File";

export interface HandleColorForCanvas {
  id: string;
  material: string;
  color: string;
  colorCode: string;
  price: number;
  modelUrl: string | null;
  colorMap: AppFile | null;
  normalMap: AppFile | null;
  roughnessMap: AppFile | null;
}
