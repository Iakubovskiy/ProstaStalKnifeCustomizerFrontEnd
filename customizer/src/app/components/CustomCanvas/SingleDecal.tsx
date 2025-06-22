import React, { useEffect, useState } from "react";
import { Decal } from "@react-three/drei";
import DecalMaterial from "./DecalMaterial";

// @ts-ignore
const SingleDecal = ({ meshRef, engraving, offsetFactor }) => {
  const [decalKey, setDecalKey] = useState(0);

  useEffect(() => {
    setDecalKey((prev) => prev + 1);
  }, [engraving.picture?.fileUrl]);

  if (!meshRef.current || !engraving?.picture || !engraving?.picture.fileUrl)
    return null;

  return (
    <Decal
      key={decalKey}
      mesh={meshRef.current}
      position={[
        engraving.locationX || 0,
        engraving.locationY || 0,
        engraving.text === null ? 0 : -1,
      ]}
      rotation={[
        0,
        engraving.side === 2 ? Math.PI : 0,
        engraving.rotationZ || 0,
      ]}
      scale={engraving.scaleX || 20}
    >
      <DecalMaterial
        key={`material-${decalKey}`}
        pictureUrl={engraving.picture.fileUrl}
        offsetFactor={offsetFactor}
      />
    </Decal>
  );
};

export default SingleDecal;
