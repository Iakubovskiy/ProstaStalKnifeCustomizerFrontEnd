import {AppFile} from "@/app/Interfaces/File";

export interface Texture {
  id: string;
  name: string;
  normalMap: AppFile;
  roughnessMap: AppFile;
}
