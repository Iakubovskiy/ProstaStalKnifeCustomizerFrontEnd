import { proxy } from 'valtio';
import BladeCoatingService from "@/app/services/BladeCoatingService";
import BladeShapeService from "@/app/services/BladeShapeService";
import FasteningService from "@/app/services/FasteningService";
import SheathColorService from "@/app/services/SheathColorService";

const bladeCoatingService = new BladeCoatingService();
const bladeCoatingList = await bladeCoatingService.getAll();
const bladeCoating = await bladeCoatingService.getById(bladeCoatingList[0].id);

const sheathColorService = new SheathColorService();
const sheathColorList = await sheathColorService.getAll();
const sheathColor = await sheathColorService.getById(sheathColorList[0].id);

const bladeShapeService = new BladeShapeService();
const bladeShapeList = await bladeShapeService.getAll();
const bladeShape = await bladeShapeService.getById(bladeShapeList[0].id);

const state = proxy({
    handleColor: '#00000',
    sheathColor: sheathColor,
    bladeCoatingColor: bladeCoating.colors[0],
    bladeCoating: bladeCoating,
    bladeShape: bladeShape,
    engraving: null,
    fastening: null,
})

export { state }
