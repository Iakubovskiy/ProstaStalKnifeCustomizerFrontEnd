import React from "react";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { useCanvasState } from "@/app/state/canvasState";
import Lighting from "./Lighting";
import Controls from "./Controls";
import Background from "@/app/components/CustomCanvas/Background";
import ModelPart from "./ModelPart";

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
              gl={{
                  powerPreference: "high-performance",
                  antialias: true,
                  preserveDrawingBuffer: false,
              }}
          >
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
                          position={[0, -20, 0]}
                          rotation={[0, 0, 0]}
                      />
                  )}

                  {snap.fastening && validateModelUrl(snap.fastening.modelUrl) && (
                      <ModelPart
                          url={snap.fastening.modelUrl}
                          {...sheathSettings}
                          position={[-5, -20, -5.4]}
                          rotation={[0, 0, Math.PI / 2]}
                      />
                  )}
                  {/*@ts-ignore*/}
              </group>
          </Canvas>
      </>
);
};

export default KnifeConfigurator;
