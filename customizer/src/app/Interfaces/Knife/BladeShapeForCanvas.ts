import {AppFile} from "@/app/Interfaces/File";

export interface BladeShapeForCanvas {
    id: string;
    name: string;
    bladeShapeModel: AppFile;
    sheathModel: AppFile | null;
}