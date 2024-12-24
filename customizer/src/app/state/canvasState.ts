import { proxy } from 'valtio';
import { useEffect } from 'react';
import BladeCoatingService from "@/app/services/BladeCoatingService";
import BladeShapeService from "@/app/services/BladeShapeService";
import FasteningService from "@/app/services/FasteningService";
import SheathColorService from "@/app/services/SheathColorService";

interface State {
    handleColor: string;
    sheathColor: SheathColor;
    bladeCoatingColor: BladeCoatingColor;
    bladeCoating: BladeCoating;
    bladeShape: BladeShape;
    engraving: Engraving[];
    fastening: Fastening[];
}

const state = proxy<State>({
    handleColor: '#2ff310',
    sheathColor: {
        id: 0,
        colorName: '',
        materialUrl: '',
        price: 0,
        material: '',
        colorCode: '',
        EngravingColorCode: ''
    },
    bladeCoatingColor: {
        id: 0,
        color: '',
        colorCode: '#1810f3',
        engravingColorCode: ''
    },
    bladeCoating: {
        id: 0,
        type: '',
        price: 0,
        colors: [],
        MaterialUrl:"",
    },
    bladeShape: {
        id: 0,
        name: '',
        bladeShapeModelUrl: '',
        price: 0,
        totalLength: 0,
        bladeLength: 0,
        bladeWidth: 0,
        bladeWeight: 0,
        sharpeningAngle: 0,
        rockwellHardnessUnits: 0,
        engravingLocationX: 0,
        engravingLocationY: 0,
        engravingLocationZ: 0,
        engravingRotationX: 0,
        engravingRotationY: 0,
        engravingRotationZ: 0,
        handleShapeModelUrl: '',
        sheathModelUrl: '',
        handleLocationX: null,
        handleLocationY: null,
        handleLocationZ: null,
        handleRotationX: null,
        handleRotationY: null,
        handleRotationZ: null
    },
    engraving: [],
    fastening: [],
});

const initializeState = async () => {
    const bladeCoatingService = new BladeCoatingService();
    const bladeCoatingList = await bladeCoatingService.getAll();

    const bladeCoating = bladeCoatingList.length > 0
        ? await bladeCoatingService.getById(bladeCoatingList[0].id)
        : state.bladeCoating;

    state.bladeCoating = bladeCoating;
    state.bladeCoatingColor = bladeCoating.colors.length > 0 ? bladeCoating.colors[0] : state.bladeCoatingColor;

    const sheathColorService = new SheathColorService();
    const sheathColorList = await sheathColorService.getAll();
    state.sheathColor = sheathColorList.length > 0 ? sheathColorList[0] : state.sheathColor;

    const bladeShapeService = new BladeShapeService();
    const bladeShapeList = await bladeShapeService.getAll();
    state.bladeShape = bladeShapeList.length > 0 ? bladeShapeList[0] : state.bladeShape;

    const fasteningService = new FasteningService();
    const fasteningList = await fasteningService.getAll();
    state.fastening = fasteningList.length > 0 ? fasteningList : state.fastening;
};

export const useCanvasState = () => {
    useEffect(() => {
        initializeState().catch((err) => console.error('Error initializing state:', err));
    }, []);

    return state;
};
