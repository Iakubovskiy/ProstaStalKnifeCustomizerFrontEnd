import { AppFile } from "./File";

export interface Texture {
  id: string;
  name: string;
  normalMap: AppFile;
  roughnessMap: AppFile;
}
