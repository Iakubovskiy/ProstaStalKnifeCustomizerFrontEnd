import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls, useGLTF, Decal, useTexture} from '@react-three/drei';
import { useSnapshot } from 'valtio';
import { useCanvasState } from '@/app/state/canvasState';
import * as THREE from 'three';
import {useControls} from "leva";

const textureLoader = new THREE.TextureLoader();

interface MaterialProps {
    color?: string;
    metalness?: number;
    roughness?: number;
    textureUrl?: string;
}

interface ModelPartProps {
    url: string;
    materialProps?: Record<string, MaterialProps>;
    position?: [number, number, number];
    rotation?: [number, number, number];
}

interface EngravingMesh {
    name: string;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    position: THREE.Vector3;
    rotation: THREE.Euler;
}
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

const SingleDecal = ({ meshRef, engraving, controls }) => {
    if (!meshRef.current) return null;

    return (
            <Decal
                mesh={meshRef.current}
                position={[controls.positionX, controls.positionY, controls.positionZ]}
                rotation={[controls.rotationX, controls.rotationY, controls.rotationZ]}
                scale={controls.scale}
            >
                <DecalMaterial pictureUrl={engraving.pictureUrl} />
            </Decal>
    );
};

const DecalWithControls = ({ meshRef, engraving, index }) => {
    const controls = useControls(`Engraving ${index}`, {
        positionX: { value: engraving.locationX, min: -50, max: 50, step: 0.1 },
        positionY: { value: engraving.locationY, min: -50, max: 50, step: 0.1 },
        positionZ: { value: engraving.locationZ, min: -50, max: 50, step: 0.1 },
        rotationX: { value: engraving.rotationX, min: -Math.PI, max: Math.PI, step: 0.1 },
        rotationY: { value: engraving.rotationY, min: -Math.PI, max: Math.PI, step: 0.1 },
        rotationZ: { value: engraving.rotationZ, min: -Math.PI, max: Math.PI, step: 0.1 },
        scale: { value: 1, min: 0.1, max: 50, step: 0.1 }
    });

    return (
        <SingleDecal
            meshRef={meshRef}
            engraving={engraving}
            controls={controls}
        />
    );
};

const EngravedMesh = ({ geometry, material, position, rotation, engravings }) => {
    const meshRef = useRef();

    return (
        <group>
            <mesh
                ref={meshRef}
                geometry={geometry}
                material={material.clone()}
                position={position}
                rotation={rotation}
            >
            {engravings?.map((eng, index) => (
                "engravingSide"+eng.side === material.name && (
                    <DecalWithControls
                        key={`${eng.id}-${index}`}
                        meshRef={meshRef}
                        engraving={eng}
                        index={index}
                    />
                )
            ))}
            </mesh>
        </group>
    );
};


const ModelPart: React.FC<ModelPartProps> = ({
                                                 url,
                                                 materialProps = {},
                                                 position = [0, 0, 0],
                                                 rotation = [0, 0, 0]
                                             }) => {
    const { scene } = useGLTF(url);
    const modelRef = useRef(null);
    const state = useCanvasState();
    const snap = useSnapshot(state);
    const [engravingMeshes, setEngravingMeshes] = useState<EngravingMesh[]>([]);

    const texturesRef = useRef<Record<string, THREE.Texture>>({});

    const updateMaterial = async (material: THREE.Material,materialName:string, props: MaterialProps) => {
        console.log("update material started");
        if (material instanceof THREE.MeshStandardMaterial) {
            if (props.color) {
                material.color.set(props.color);
            }
            if (typeof props.metalness === 'number') {
                material.metalness = props.metalness;
            }
            if (typeof props.roughness === 'number') {
                material.roughness = props.roughness;
            }

            if (props.textureUrl && !texturesRef.current[props.textureUrl]) {
                try {
                    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
                        textureLoader.load(
                            props.textureUrl!,
                            resolve,
                            undefined,
                            reject
                        );
                    });

                    console.log('Loaded texture:', texture);

                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(1, 1);
                    texture.flipY = false;

                    texturesRef.current[props.textureUrl] = texture;
                    material.map = texture;
                    material.transparent = true;
                    material.opacity = 0;
                } catch (error) {
                    console.error('Error loading texture:', error);
                }
            } else if (props.textureUrl) {
                material.map = texturesRef.current[props.textureUrl];
            }

            if (materialName === 'engravingSide1' || materialName === 'engravingSide2') {
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

                switch(materialName) {
                    case 'bladeCoating':
                        updateMaterial(child.material,materialName, {
                            color: snap.bladeCoatingColor.colorCode,
                            metalness: 0.0,
                            roughness: 0.0,
                            textureUrl: snap.bladeCoating.MaterialUrl
                        });
                        break;

                    case 'model':
                        updateMaterial(child.material,materialName, {
                            color: '#CCCCCC',
                            metalness: 1,
                            roughness: 0.3
                        });
                        break;

                    case 'handle':
                        updateMaterial(child.material, materialName,{
                            color: snap.handleColor,
                            metalness: 0.1,
                            roughness: 0.8
                        });
                        break;

                    case 'engravingSide1':
                    case 'engravingSide2':
                        updateMaterial(child.material, materialName, {
                            color: snap.bladeCoatingColor.engravingColorCode,
                            metalness: 0.6,
                            roughness: 0.4
                        });
                        break;

                    case 'sheath':
                        updateMaterial(child.material, materialName, {
                            color: snap.sheathColor.colorCode,
                            textureUrl: snap.sheathColor.materialUrl,
                            metalness: 0.1,
                            roughness: 0.9
                        });
                        break;
                }
            }
        });
    }, [scene, snap.handleColor, snap.bladeCoatingColor, snap.sheathColor]);

    useEffect(() => {
        return () => {
            Object.values(texturesRef.current).forEach(texture => {
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

                if (materialName === 'engravingSide1' || materialName === 'engravingSide2' || materialName === 'engravingSide3') {
                    foundEngravingMeshes.push({
                        name: materialName,
                        geometry: child.geometry,
                        material: child.material,
                        position: child.position,
                        rotation: child.rotation
                    });
                    child.visible = false;
                }

            }
        });

        setEngravingMeshes(foundEngravingMeshes);
    }, [scene]);
    console.log(engravingMeshes);
    return (
        <group position={position} rotation={rotation}>
            <primitive
                ref={modelRef}
                object={scene}
            />
            {engravingMeshes.map((mesh, idx) => (
                <EngravedMesh
                    key={`${mesh.name}-${idx}`}
                    geometry={mesh.geometry}
                    material={mesh.material}
                    position={mesh.position}
                    rotation={mesh.rotation}
                    engravings={snap.engraving}
                />
            ))}
        </group>
    );
};

const KnifeConfigurator: React.FC = () => {
    const state = useCanvasState();
    const snap = useSnapshot(state);

    const validateModelUrl = (url: string): boolean => {
        return Boolean(url && (url.endsWith('.glb') || url.endsWith('.gltf') || url.startsWith('blob:')));
    };

    const bladeSettings = {
        materialProps: {
            color: snap.bladeCoatingColor.colorCode,
            metalness: 0.8,
            roughness: 0.2
        },
        position: [0, 0, 0],
        rotation: [0, 0, 0]
    };

    const sheathSettings = {
        materialProps: {
            color: snap.sheathColor.colorCode,
            metalness: 0.1,
            roughness: 0.9
        }
    };

    const Lighting: React.FC = () => (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
        </>
    );

    const Controls: React.FC = () => (
        <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={30}
            maxDistance={300}
        />
    );

    if (!validateModelUrl(snap.bladeShape.bladeShapeModelUrl)) {
        return (
            <Canvas>
                <Lighting />
                <Controls />
            </Canvas>
        );
    }

    return (
        <Canvas camera={{ position: [0, 0, 100], fov: 45 }}>
            <Lighting />
            <Controls />

            {validateModelUrl(snap.bladeShape.bladeShapeModelUrl) && (
                <ModelPart
                    url={snap.bladeShape.bladeShapeModelUrl}
                    {...bladeSettings}
                />
            )}

            {validateModelUrl(snap.bladeShape.sheathModelUrl) && (
                <ModelPart
                    url={snap.bladeShape.sheathModelUrl}
                    {...sheathSettings}
                    position={[-40,-40,0]}
                />
            )}
        </Canvas>
    );
};

export default KnifeConfigurator;