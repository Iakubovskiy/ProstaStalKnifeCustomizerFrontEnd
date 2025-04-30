import React from "react";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { useCanvasState } from "@/app/state/canvasState";
import Lighting from "./Lighting";
import Controls from "./Controls";
import Background from "@/app/components/CustomCanvas/Background";
import ModelPart from "./ModelPart";
import { Suspense } from "react";
import CustomLoader from './CustomLoader';
import { Perf } from 'r3f-perf';

const KnifeConfigurator = () => {
  const state = useCanvasState();
  const snap = useSnapshot(state);

  const validateModelUrl = (url: string): boolean => {
    return Boolean(
        url &&
        (url.endsWith(".glb") ||
            url.endsWith(".gltf") ||
            url.startsWith("blob:"))
    );
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
      },
    },
  };

  if (!validateModelUrl(snap.bladeShape.bladeShapeModelUrl)) {
    return (
        <Canvas>
          <Lighting/>
          <Controls/>
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
                  <Lighting/>
                  <Controls/>
                  <Background/>
                  {/*@ts-ignore*/}
                  <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
                      {validateModelUrl(snap.bladeShape.bladeShapeModelUrl) && (
                          <ModelPart
                              url={snap.bladeShape.bladeShapeModelUrl}
                              {...bladeSettings}
                          />
                      )}

                      {validateModelUrl(snap.bladeShape.sheathModelUrl) && (
                          <ModelPart
                              url={snap.bladeShape.sheathModelUrl}
                              {...sheathSettings}
                              position={[0, -10, 0]}
                              rotation={[0, 0, 0]}
                          />
                      )}

                      {snap.fastening && validateModelUrl(snap.fastening.modelUrl) && (
                          <ModelPart
                              url={snap.fastening.modelUrl}
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
