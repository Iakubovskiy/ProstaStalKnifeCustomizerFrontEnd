import React from "react";
import { RectAreaLight } from 'three';
import { useThree } from '@react-three/fiber';
import {RectAreaLightHelper, RectAreaLightUniformsLib} from 'three-stdlib';
import {useHelper} from "@react-three/drei";
import * as THREE from 'three';


RectAreaLightUniformsLib.init();

const RectAreaLightWithHelper = ({ ...props }) => {
    const lightRef = React.useRef<RectAreaLight>(null!);
    // useHelper(lightRef, RectAreaLightHelper, 'cyan');
    return <rectAreaLight ref={lightRef} {...props} />;
};

const Lighting = () => {
    return (
        <>
            <group position={[0, 45, 0]}>
                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, -20]}
                    rotation={[-Math.PI / 2, 0, 0]}
                />

                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, 20]}
                    rotation={[-Math.PI / 2, 0, 0]}
                />
            </group>
            <group position={[0, -45, 0]}>
                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, -20]}
                    rotation={[Math.PI / 2, 0, 0]}
                />

                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, 20]}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            </group>
            <group position={[0, -20, 0]}>
                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, -20]}
                    rotation={[Math.PI-Math.PI/3, 0, Math.PI]}
                />

                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, 20]}
                    rotation={[Math.PI/3, 0, 0]}
                />
            </group>
            <group position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, -30]}
                    rotation={[Math.PI, 0,0]}
                />

                <RectAreaLightWithHelper
                    intensity={2}
                    color="#FFFFFF"
                    width={40}
                    height={20}
                    position={[0, 0, 30]}
                    rotation={[0, 0, 0]}
                />
            </group>
        </>
    );
};

    if (typeof window !== 'undefined' && THREE.RectAreaLight.prototype.toJSON) {
        const originalToJSON = THREE.RectAreaLight.prototype.toJSON;
        THREE.RectAreaLight.prototype.toJSON = function () {
            const data = originalToJSON.call(this);
            return data;
        };
    };

export default Lighting;