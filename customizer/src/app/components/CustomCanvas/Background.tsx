import React, {useEffect} from "react";
import {useThree} from "@react-three/fiber";
import {useTexture} from "@react-three/drei";
import * as THREE from "three";

const Background: React.FC = () => {
    const { scene, gl } = useThree();
    const texture = useTexture("/background.jpg");

    useEffect(() => {
        const formattedTexture = new THREE.WebGLCubeRenderTarget(
            texture.image.height
        ).fromEquirectangularTexture(gl, texture);

        scene.background = formattedTexture.texture;

        return () => {
            scene.background = null; // Встановлюємо фон на null
            formattedTexture.dispose(); // Очищуємо ресурси
        };
    }, [scene, gl, texture]);

    return null;
};

export default Background;