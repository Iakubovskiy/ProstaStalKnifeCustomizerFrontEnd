import { AppFile } from "@/app/Interfaces/File";
import { SheathColorPriceByType } from "../SheathColorPriceByType";

export interface SheathColorForCanvas {
  id: string;
  prices: SheathColorPriceByType[];
  colorMap: AppFile | null;
  normalMap: AppFile | null;
  roughnessMap: AppFile | null;
  colorCode: string;
  engravingColorCode: string;
}
