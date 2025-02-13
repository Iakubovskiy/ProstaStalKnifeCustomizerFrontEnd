import {useEffect, useRef} from "react";
import {OrbitControls} from "@react-three/drei";

const Controls = () => {
    //@ts-ignore
    const controlsRef = useRef();
    useEffect(() => {
        if (controlsRef.current) {
            //@ts-ignore
            controlsRef.current.object.position.setLength(100);
            //@ts-ignore
            controlsRef.current.update();
        }
    }, []);

    return (
        <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.3}
            maxDistance={100}
            // @ts-ignore
            ref={controlsRef}
        />
    );
};

export default Controls;