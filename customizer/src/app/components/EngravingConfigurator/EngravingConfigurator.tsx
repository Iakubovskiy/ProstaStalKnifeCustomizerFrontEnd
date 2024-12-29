import React from "react";
import { useControls } from "leva";
import { Decal, useTexture } from "@react-three/drei";

const DecalMaterial = ({ pictureUrl }) => {
  const texture = useTexture(pictureUrl);

  return (
    <meshStandardMaterial
      map={texture}
      transparent
      polygonOffset
      polygonOffsetFactor={-1}
    />
  );
};

const EngravingConfigurator = ({ engraving, meshRef, index }) => {
  const controls = useControls(`Engraving ${index}`, {
    positionX: { value: engraving.locationX, min: -50, max: 50, step: 0.1 },
    positionY: { value: engraving.locationY, min: -50, max: 50, step: 0.1 },
    rotationZ: {
      value: engraving.rotationZ,
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
    },
    scale: { value: engraving.scaleX, min: 0.1, max: 10, step: 0.1 },
  });

  return (
    <Decal
      mesh={meshRef.current}
      position={[controls.positionX, controls.positionY, engraving.locationZ]}
      rotation={[0, 0, controls.rotationZ]}
      scale={controls.scale}
    >
      <DecalMaterial pictureUrl={engraving.pictureUrl} />
    </Decal>
  );
};

export default EngravingConfigurator;
