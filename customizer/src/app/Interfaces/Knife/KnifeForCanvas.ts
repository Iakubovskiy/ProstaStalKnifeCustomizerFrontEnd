import { AttachmentForCanvas } from "./AttachmentForCanvas";
import { HandleColorForCanvas } from "./HandleColorForCanvas";
import {BladeShapeForCanvas} from "@/app/Interfaces/Knife/BladeShapeForCanvas";
import {EngravingForCanvas} from "@/app/Interfaces/Knife/EngravingForCanvas";
import {BladeCoatingColorForCanvas} from "@/app/Interfaces/Knife/BladeCoatingColorForCanvas";
import { SheathColorForCanvas } from "./SheathColorForCanvas";

export interface KnifeForCanvas {
    attachments: AttachmentForCanvas[] | null;
    bladeCoatingColor: BladeCoatingColorForCanvas;
    bladeShape: BladeShapeForCanvas;
    engravings: EngravingForCanvas[] | null;
    handleColor: HandleColorForCanvas | null;
    sheathColor: SheathColorForCanvas | null;
}