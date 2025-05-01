import React from "react";
import { useProgress, Html } from "@react-three/drei";

const CustomLoader = () => {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-coffe bg-opacity-75 p-6 rounded-lg text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
        <div className="text-xl text-black font-bold">
          Завантаження: {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
};

export default CustomLoader;
