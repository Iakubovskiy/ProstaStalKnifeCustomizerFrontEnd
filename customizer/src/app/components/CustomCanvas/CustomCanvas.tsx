import React, {useEffect, useRef, useState} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {OrbitControls, useGLTF, Decal, useTexture, Html} from "@react-three/drei";
import { useSnapshot } from "valtio";
import { useCanvasState } from "@/app/state/canvasState";
import * as THREE from "three";
import { useControls } from "leva";
import Engraving from "@/app/Models/Engraving";

interface MaterialProps {
  color?: string;
  metalness?: number;
  roughness?: number;
  textureUrl?: string;
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
}
interface DecalMaterialProps {
  pictureUrl: string;
  offsetFactor: number;
}

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

const DecalMaterial: React.FC<DecalMaterialProps> = ({
  pictureUrl,
  offsetFactor = 2,
}) => {
  const texture = useTexture(pictureUrl);

  // Ефект для оновлення текстури
  useEffect(() => {
    texture.needsUpdate = true;
  }, [pictureUrl, texture]);

  return (
    //@ts-ignore
    <meshStandardMaterial
      map={texture}
      transparent
      polygonOffset
      polygonOffsetFactor={offsetFactor}
      polygonOffsetUnits={-2}
      needsUpdate={true}
    />
  );
};
// @ts-ignore
const SingleDecal = ({ meshRef, engraving, offsetFactor }) => {
  const [decalKey, setDecalKey] = useState(0);

  // Ефект для оновлення ключа при зміні pictureUrl
  useEffect(() => {
    setDecalKey((prev) => prev + 1);
  }, [engraving.pictureUrl]);

  if (!meshRef.current || !engraving?.pictureUrl) return null;

  return (
    <Decal
      key={decalKey} // Додаємо ключ для форсування ререндеру
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
        key={`material-${decalKey}`} // Також додаємо ключ для матеріалу
        pictureUrl={engraving.pictureUrl}
        offsetFactor={offsetFactor}
      />
    </Decal>
  );
};

// @ts-ignore
const DecalWithControls = ({ meshRef, engraving, index }) => {
  const state = useCanvasState();

  // Перевіряємо наявність всіх необхідних властивостей
  if (!engraving) return null;

  return (
    <SingleDecal
      meshRef={meshRef}
      engraving={engraving}
      
    //@ts-ignore
      controls={{
        positionX: engraving.locationX || 0,
        positionY: engraving.locationY || 0,
        positionZ: engraving.text === null ? 0 : -1,
        rotationX: 0,
        rotationY: engraving.side === 2 ? Math.PI : 0,
        rotationZ: engraving.rotationZ || 0,
        scale: engraving.scaleX || 20,
      }}
      offsetFactor={index * -0.1}
    />
  );
};
interface EngravedMeshProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: THREE.Vector3 | [number, number, number];
  rotation: THREE.Euler | [number, number, number];
  engravings: Engraving[];
}
const EngravedMesh : React.FC<EngravedMeshProps> = ({
  geometry,
  material,
  position,
  rotation,
  engravings,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [meshKey, setMeshKey] = useState(0);

  useEffect(() => {
    setMeshKey((prev) => prev + 1);
  }, [engravings.length, engravings.map((e) => e.pictureUrl).join(",")]);

  return (
    //@ts-ignore
    <group key={meshKey}>
        {/*@ts-ignore*/}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material.clone()}
        position={position}
        rotation={rotation}
        color={"red"}
      >
        {engravings?.map(
          (eng, index) =>
            "engravingSide" + eng.side === material.name && (
              <SingleDecal
                key={`${eng.id}-${index}-${meshKey}`}
                meshRef={meshRef}
                engraving={eng}
                offsetFactor={index * -0.1}
              />
            )
        )}
          {/*@ts-ignore*/}
      </mesh>
        {/*@ts-ignore*/}
    </group>
  );
};
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
      if (props.color) {
        material.color.set(props.color);
      }
      if (typeof props.metalness === "number") {
        material.metalness = props.metalness;
      }
      if (typeof props.roughness === "number") {
        material.roughness = props.roughness;
      }

      /*if (props.textureUrl && !texturesRef.current[props.textureUrl]) {
        try {
          const texture = await new Promise<THREE.Texture>(
            (resolve, reject) => {
              textureLoader.load(props.textureUrl!, resolve, undefined, reject);
            }
          );

          console.log("Loaded texture:", texture);

          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1, 1);
          texture.flipY = false;

          texturesRef.current[props.textureUrl] = texture;
          material.map = texture;
          material.transparent = true;
          material.opacity = 0;
        } catch (error) {
          console.error("Error loading texture:", error);
        }
      } else if (props.textureUrl) {
        material.map = texturesRef.current[props.textureUrl];
      }*/

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
            });
            break;

          case "model":
            updateMaterial(child.material, materialName, {
              metalness: 1,
              roughness: 0.3,
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
              metalness: 0.1,
              roughness: 0.9,
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
          foundEngravingMeshes.push({
            name: materialName,
            geometry: child.geometry,
            material: child.material,
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

//@ts-ignore
const ControlButtons = ({handleArrowClick, handleZoom}) => {
  return (
      <>
        <div style={{
          position: 'absolute',
          top: '2%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
        }}>
          <button
              onClick={() => handleArrowClick("up")}
              style={{
                position: 'absolute',
                top: 0,
                left: '0%',
                color: "black",
                transform: 'translateX(-50%)',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #666',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
          >
            ↑
          </button>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '0%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
        }}>
          <button
              onClick={() => handleArrowClick("down")}
              style={{
                position: 'absolute',
                color: "black",
                bottom: 0,
                left: '0%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #666',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
          >
            ↓
          </button>
        </div>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '1%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
        }}>
          <button
              onClick={() => handleArrowClick("left")}
              style={{
                position: 'absolute',
                color: "black",
                left: 0,
                top: '15%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #666',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
          >
            ←
          </button>
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '30%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
        }}>
          <button
              onClick={() => handleArrowClick("right")}
              style={{
                position: 'absolute',
                color: "black",
                right: 0,
                top: '15%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #666',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
          >
            →
          </button>
        </div>

        <div style={{
          position: 'absolute',
          right: '31%',
          bottom: '0%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
              onClick={() => handleZoom("in")}
              style={{
                width: '40px',
                color: "black",
                height: '40px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #666',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
          >
            +
          </button>
          <button
              onClick={() => handleZoom("out")}
              style={{
                width: '40px',
                color: "black",
                height: '40px',
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid #666',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
          >
            -
          </button>
        </div>
      </>
  );
};

const KnifeConfigurator = () => {
  const state = useCanvasState();
  const snap = useSnapshot(state);
  //@ts-ignore
  const controlsRef = useRef();


  const handleArrowClick = (direction: "up" | "down" | "left" | "right") => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const delta = Math.PI / 18;

    //@ts-ignore
    const currentAzimuth = controls.getAzimuthalAngle();
    //@ts-ignore
    const currentPolar = controls.getPolarAngle();

    switch (direction) {
      case "up":
        //@ts-ignore
        controls.setPolarAngle(Math.max(0, currentPolar - delta));
        break;
      case "down":
        //@ts-ignore
        controls.setPolarAngle(Math.min(Math.PI, currentPolar + delta));
        break;
      case "left":
        //@ts-ignore
        controls.setAzimuthalAngle(currentAzimuth - delta);
        break;
      case "right":
        //@ts-ignore
        controls.setAzimuthalAngle(currentAzimuth + delta);
        break;
    }
    //@ts-ignore
    controls.update();
  };

  const handleZoom = (inOut: "in" | "out") => {
    const delta = 1;
    //@ts-ignore
    const currentDistance = controlsRef.current.object.position.length();
    if (inOut === "in" && currentDistance > 10) {
      //@ts-ignore
      controlsRef.current.object.position.setLength(currentDistance - delta);
    } else if (inOut === "out" && currentDistance < 100) {
      //@ts-ignore
      controlsRef.current.object.position.setLength(currentDistance + delta);
    }
  };

  const validateModelUrl = (url: string): boolean => {
    return Boolean(
        url &&
        (url.endsWith(".glb") ||
            url.endsWith(".gltf") ||
            url.startsWith("blob:"))
    );
  };

  const bladeSettings = {
    materialProps: {
      default: {
        color: snap.bladeCoatingColor.colorCode,
      },
    },
    position: [0, 0, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
  };

  const sheathSettings = {
    materialProps: {
      default: {
      },
    },
  };

  const Lighting = () => (
      <>
        {/*@ts-ignore*/}
        <ambientLight intensity={1.5}/>
        {/*@ts-ignore*/}
        <directionalLight position={[10, 10, 5]} intensity={0.8}/>
        {/*@ts-ignore*/}
        <directionalLight position={[-10, -10, -5]} intensity={0.4}/>
      </>
  );

    const Controls = () => {
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

  if (!validateModelUrl(snap.bladeShape.bladeShapeModelUrl)) {
    return (
        <Canvas>
          <Lighting/>
          <Controls/>
        </Canvas>
    );
  }

  return (
      <>
        <Canvas
            gl={{
              powerPreference: "high-performance",
              antialias: true,
              preserveDrawingBuffer: false,
            }}
        >
          <Lighting/>
          <Controls/>
          <Background/>

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
                  position={[0, -20, 0]}
                  rotation={[0, 0, 0]}
              />
          )}

          {snap.fastening && validateModelUrl(snap.fastening.modelUrl) && (
              <ModelPart
                  url={snap.fastening.modelUrl}
                  {...sheathSettings}
                  position={[-5, -20, -5.4]}
                  rotation={[0, 0, Math.PI / 2]}
              />
          )}
        </Canvas>
        {/*<ControlButtons handleArrowClick={handleArrowClick} handleZoom={handleZoom}/>*/}
      </>
  );
};

export default KnifeConfigurator;
