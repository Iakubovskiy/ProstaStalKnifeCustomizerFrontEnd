import { AppFile } from "@/app/Interfaces/File";
import { Texture } from "@/app/Interfaces/Texture";

export interface Handle {
  id: string;
  color: string;
  colors?: LocalizedContent | null;
  colorCode: string | null;
  isActive: boolean;
  material: string;
  materials?: LocalizedContent | null;
  texture: Texture | null;
  colorMap: AppFile | null;
  price: number;
  bladeShapeTypeId: string;
}
