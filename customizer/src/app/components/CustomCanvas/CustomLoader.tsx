import React from "react";
import {Box, useProgress, Html} from "@react-three/drei";

const CustomLoader= () => {
    const { progress } = useProgress();
    return (
        // @ts-ignore
        <group>
            {/* Простий контур (наприклад, куб) */}
            <Box args={[1, 1, 1]} position={[0,0,0]}>
                {/* @ts-ignore */}
                <meshStandardMaterial wireframe color="grey" opacity={0.5} transparent />
            </Box>
            {/* Текст з прогресом */}
            {/* @ts-ignore */}
            <Html center>
                <div style={{ color: 'white', /* інші стилі */ }}>
                    Завантаження: {progress.toFixed(0)}%
                </div>
            </Html>
            {/* @ts-ignore */}
        </group>
    );
}

export default CustomLoader;