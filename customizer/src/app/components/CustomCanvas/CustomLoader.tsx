import React from "react";
import {Box, useProgress, Html} from "@react-three/drei";

const CustomLoader= () => {
    const { progress } = useProgress();
    return (
        // @ts-ignore
        <group>
            <Box args={[1, 1, 1]} position={[0,0,0]}>
                {/* @ts-ignore */}
                <meshStandardMaterial wireframe color="grey" opacity={0.5} transparent />
            </Box>
            {/* @ts-ignore */}
            <Html center>
                <div style={{ color: 'white' }}>
                    Завантаження: {progress.toFixed(0)}%
                </div>
            </Html>
            {/* @ts-ignore */}
        </group>
    );
}

export default CustomLoader;