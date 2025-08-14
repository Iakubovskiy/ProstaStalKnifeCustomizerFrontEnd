import {useCanvasState} from "@/app/state/canvasState";
import {useSnapshot} from "valtio";
import {AppFile} from "@/app/Interfaces/File";
import Lighting from "@/app/components/CustomCanvas/Support/Lighting";
import Controls from "@/app/components/CustomCanvas/Support/Controls";
import Background from "@/app/components/CustomCanvas/Support/Background";
import ModelPart from "@/app/components/CustomCanvas/ModelPart";
import React from "react";

export const Scene = () => {
    const state = useCanvasState();
    const snap = useSnapshot(state);

    const validateModelUrl = (url: string | null | undefined): boolean => {
        return Boolean(
            url &&
            (url.endsWith(".glb") ||
                url.endsWith(".gltf") ||
                url.startsWith("blob:"))
        );
    };

    const isValidAppFile = (file: AppFile | null): file is AppFile => {
        return file !== null && file.fileUrl !== null && file.fileUrl !== undefined;
    };

    const bladeSettings = {
        materialProps: { default: { color: snap.bladeCoatingColor.colorCode } },
    };
    const sheathSettings = {
        materialProps: { default: { color: snap.sheathColor.colorCode } },
    };

    return (
        <>
            <Lighting />
            <Controls />
            <Background />
            <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
                {isValidAppFile(snap.bladeShape.bladeShapeModel) &&
                    validateModelUrl(snap.bladeShape.bladeShapeModel.fileUrl) && (
                        <ModelPart
                            url={snap.bladeShape.bladeShapeModel.fileUrl!}
                            {...bladeSettings}
                        />
                    )}
                {snap.bladeShape.sheathModel &&
                    isValidAppFile(snap.bladeShape.sheathModel) &&
                    validateModelUrl(snap.bladeShape.sheathModel.fileUrl) && (
                        <ModelPart
                            url={snap.bladeShape.sheathModel.fileUrl!}
                            {...sheathSettings}
                            position={[0, -10, 0]}
                            rotation={[0, 0, 0]}
                        />
                    )}
                {snap.attachment &&
                    snap.attachment.model &&
                    isValidAppFile(snap.attachment.model) &&
                    validateModelUrl(snap.attachment.model.fileUrl) && (
                        <ModelPart
                            url={snap.attachment.model.fileUrl!}
                            {...sheathSettings}
                            position={[-1, -10, -1]}
                            rotation={[0, 0, Math.PI / 2]}
                        />
                    )}
            </group>
        </>
    );
};

export default Scene;