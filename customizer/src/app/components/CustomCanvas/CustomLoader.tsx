import React from "react";
import { useProgress, Html } from "@react-three/drei";

const CustomLoader = () => {
  const { progress } = useProgress();
  return (
    // @ts-ignore
    <group>
      <Html center>
        <div style={{ color: "#ffab44", width: "150 px" }} className="text-2xl">
          Завантаження: {progress.toFixed(0)}%
        </div>
      </Html>
      {/* @ts-ignore */}
    </group>
  );
};

export default CustomLoader;
