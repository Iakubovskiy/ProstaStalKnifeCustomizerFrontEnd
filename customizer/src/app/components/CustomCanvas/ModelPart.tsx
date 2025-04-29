import * as THREE from "three";
import React, {useEffect, useRef, useState} from "react";
import {useGLTF} from "@react-three/drei";
import {useCanvasState} from "@/app/state/canvasState";
import {useSnapshot} from "valtio/index";
import EngravedMesh from "@/app/components/CustomCanvas/EngravedMesh";
import Engraving from "@/app/Models/Engraving";

interface MaterialProps {
    color?: string;
    metalness?: number;
    roughness?: number;
    colorMapUrl?: string | null;
    roughnessMapUrl?: string | null;
    normalMapUrl?: string | null;
}

interface ModelPartProps {
    url: string;
    materialProps?: Record<string, MaterialProps> | null;
    position?: [number, number, number];
    rotation?: [number, number, number];
}

interface EngravingMesh {
    name: string;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    matrix?: THREE.Matrix4;
}

export function isUrlResettable(url: string): boolean {
    if (url.startsWith("/") && !url.startsWith("//")) {
        return true;
    }

    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

const ModelPart: React.FC<ModelPartProps> = ({
                                                 url,
                                                 position = [0, 0, 0],
                                                 rotation = [0, 0, 0],
                                             }) => {
    const { scene } = useGLTF(url);
    const modelRef = useRef(null);
    const state = useCanvasState();
    const snap = useSnapshot(state);
    const [engravingMeshes, setEngravingMeshes] = useState<EngravingMesh[]>([]);
    const texturesRef = useRef<Record<string, THREE.Texture>>({});

    const updateMaterial = async (
        material: THREE.Material,
        materialName: string,
        props: MaterialProps
    ) => {
        if (material instanceof THREE.MeshStandardMaterial) {
            const textureLoader = new THREE.TextureLoader();
            if (props.color) {
                material.color.set(props.color);
            }
            if (props.colorMapUrl && isUrlResettable(props.colorMapUrl)) {
                const map = textureLoader.load(props.colorMapUrl, (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(1, 1);
                });
                material.color.set(0xffffff);
                material.map = map;
            } else{
                material.map = null;
            }
            if ( props.normalMapUrl && isUrlResettable(props.normalMapUrl)) {
                material.normalMap = textureLoader.load(props.normalMapUrl, (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(1, 1);
                })
                material.needsUpdate = true;
            } else {
                material.normalMap = null;
            }
            if ( props.roughnessMapUrl && isUrlResettable(props.roughnessMapUrl)) {
                material.roughnessMap = textureLoader.load(props.roughnessMapUrl, (texture) => {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(1, 1);
                });
            } else {
                material.roughnessMap = null;
            }

            if (
                materialName === "engravingSide1" ||
                materialName === "engravingSide2" ||
                materialName === "engravingSide3"
            ) {
                material.transparent = true;
                material.opacity = 0;
            }

            material.needsUpdate = true;
        }
    };

    useEffect(() => {
        if (!modelRef.current || !scene) return;

        scene.traverse((child: any) => {
            if (child.isMesh) {
                const materialName = child.material.name;

                switch (materialName) {
                    case "bladeCoating":
                        updateMaterial(child.material, materialName, {
                            color: snap.bladeCoatingColor.colorCode,
                            metalness: 0.2,
                            roughness: 1,
                            colorMapUrl: snap.bladeCoatingColor.colorMapUrl,
                            roughnessMapUrl: snap.bladeCoatingColor.roughnessMapUrl,
                            normalMapUrl: snap.bladeCoatingColor.normalMapUrl,
                        });
                        break;

                    case "handle":
                        updateMaterial(child.material, materialName, {
                            color: snap.handleColor.colorCode,
                        });
                        break;

                    case "engravingSide1":
                    case "engravingSide2":
                    case "engravingSide3":
                        updateMaterial(child.material, materialName, {
                            color: snap.bladeCoatingColor.engravingColorCode
                        });
                        break;

                    case "sheath":
                        updateMaterial(child.material, materialName, {
                            color: snap.sheathColor.colorCode,
                            colorMapUrl: snap.sheathColor.colorMapUrl,
                            roughnessMapUrl: snap.sheathColor.roughnessMapUrl,
                            normalMapUrl: snap.sheathColor.normalMapUrl,
                        });
                        break;
                }
            }
        });
    }, [scene, snap.handleColor, snap.bladeCoatingColor, snap.sheathColor]);

    useEffect(() => {
        return () => {
            Object.values(texturesRef.current).forEach((texture) => {
                texture.dispose();
            });
            texturesRef.current = {};
        };
    }, []);
    
    useEffect(() => {
        if (!modelRef.current || !scene) return;

        const foundEngravingMeshes: EngravingMesh[] = [];

        scene.traverse((child: any) => {
            if (child.isMesh) {
                const materialName = child.material.name;
                if (
                    materialName === "engravingSide1" ||
                    materialName === "engravingSide2" ||
                    materialName === "engravingSide3"
                ) {
                    child.updateMatrixWorld(true);
                    const matrix = child.matrixWorld.clone();

                    foundEngravingMeshes.push({
                        name: materialName,
                        geometry: child.geometry,
                        material: child.material,
                        matrix: matrix,
                        position: child.position,
                        rotation: child.rotation,
                    });
                    child.visible = false;
                }
            }
        });
        setEngravingMeshes(foundEngravingMeshes);
    }, [scene]);

    return (
        // @ts-ignore
        <group position={position} rotation={rotation}>
            {/*@ts-ignore*/}
            <primitive ref={modelRef} object={scene} />
            {engravingMeshes.map((mesh, idx) => {
                return (
                    <EngravedMesh
                        key={`${mesh.name}-${idx}`}
                        geometry={mesh.geometry}
                        material={mesh.material}
                        position={mesh.position}
                        rotation={mesh.rotation}
                        engravings={snap.engravings as Engraving[]}
                    />
                );
            })}
            {/*@ts-ignore*/}
        </group>
    );
};

export default ModelPart;