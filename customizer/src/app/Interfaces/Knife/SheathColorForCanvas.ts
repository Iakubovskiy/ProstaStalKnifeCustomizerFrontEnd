import {AppFile} from "@/app/Interfaces/File";

export interface SheathColorForCanvas {
    id: string;
    colorMap: AppFile | null;
    normalMap: AppFile | null;
    roughnessMap: AppFile | null;
    colorCode: string;
    engravingColorCode: string;
}