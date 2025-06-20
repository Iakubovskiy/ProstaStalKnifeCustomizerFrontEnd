import { AppFile } from "@/app/Interfaces/File";

export interface BladeShapeForCanvas {
  id: string;
  name: string;
  image: AppFile;
  price: number;
  bladeShapeModel: AppFile;
  sheathModel: AppFile | null;
}
