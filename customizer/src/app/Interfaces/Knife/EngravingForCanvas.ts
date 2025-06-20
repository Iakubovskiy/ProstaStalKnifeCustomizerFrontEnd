import {AppFile} from "@/app/Interfaces/File";

export interface EngravingForCanvas {
    id: string;
    side: number;
    text: string | null;
    font: string | null;
    picture: AppFile | null;
    locationX: number;
    locationY: number;
    locationZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
}