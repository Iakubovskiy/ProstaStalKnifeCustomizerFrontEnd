import {Texture} from "./Texture";
import {SheathColorPriceByType} from "@/app/Interfaces/SheathColorPriceByType";

export interface SheathColor {
  id: string;
  color: string;
  colors?: LocalizedContent | null;
  colorCode: string | null;
  isActive: boolean;
  material: string;
  materials?: LocalizedContent | null;
  engravingColorCode: string;
  texture: Texture | null;
  colorMap: File | null;
  prices: SheathColorPriceByType[];
}
