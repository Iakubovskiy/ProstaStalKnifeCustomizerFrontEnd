import React from "react";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { useCanvasState } from "@/app/state/canvasState";
import Lighting from "./Lighting";
import Controls from "./Controls";
import Background from "@/app/components/CustomCanvas/Background";
import ModelPart from "./ModelPart";
import { Suspense } from "react";
import CustomLoader from "./CustomLoader";
import { Perf } from "r3f-perf";
import { AppFile } from "@/app/Interfaces/File";

const KnifeConfigurator = () => {
  const state = useCanvasState();
  const snap = useSnapshot(state);
  console.log("KnifeConfigurator snap", snap);
  const validateModelUrl = (url: string): boolean => {
    return Boolean(
      url &&
        (url.endsWith(".glb") ||
          url.endsWith(".gltf") ||
          url.startsWith("blob:"))
    );
  };
  const isValidAppFile = (file: AppFile | null): file is AppFile => {
    console.log("isValidAppFile", file);

    return file !== null && file.fileUrl !== null && file.fileUrl !== undefined;
  };
  const bladeSettings = {
    materialProps: {
      default: {
        color: snap.bladeCoatingColor.colorCode,
      },
    },
  };

  const sheathSettings = {
    materialProps: {
      default: {
        color: snap.sheathColor.colorCode,
      },
    },
  };

  if (!isValidAppFile(snap.bladeShape.bladeShapeModel)) {
    return (
      <Canvas>
        <Lighting />
        <Controls />
      </Canvas>
    );
  }

  return (
    <>
      <Canvas
        frameloop="always"
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          preserveDrawingBuffer: false,
        }}
        // onCreated={({ invalidate }) => {
        //     state.invalidate = invalidate;
        // }}
      >
        <Suspense fallback={<CustomLoader />}>
          <Lighting />
          <Controls />
          <Background />
          {/*@ts-ignore*/}
          <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
            {isValidAppFile(snap.bladeShape.bladeShapeModel) &&
              validateModelUrl(snap.bladeShape.bladeShapeModel.fileUrl) && (
                <ModelPart
                  url={snap.bladeShape.bladeShapeModel.fileUrl}
                  {...bladeSettings}
                />
              )}
            {isValidAppFile(snap.bladeShape.sheathModel) &&
              validateModelUrl(snap.bladeShape.sheathModel.fileUrl) && (
                <ModelPart
                  url={snap.bladeShape.sheathModel.fileUrl}
                  {...sheathSettings}
                  position={[0, -10, 0]}
                  rotation={[0, 0, 0]}
                />
              )}

            {snap.attachment &&
              snap.attachment.model &&
              validateModelUrl(snap.attachment?.model.fileUrl) && (
                <ModelPart
                  url={snap.attachment.model.fileUrl}
                  {...sheathSettings}
                  position={[-1, -10, -1]}
                  rotation={[0, 0, Math.PI / 2]}
                />
              )}
            {/*@ts-ignore*/}
          </group>
        </Suspense>
      </Canvas>
    </>
  );
};

export default KnifeConfigurator;
