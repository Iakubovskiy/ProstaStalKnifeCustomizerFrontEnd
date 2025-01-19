import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Decal, useTexture } from "@react-three/drei";
import { useSnapshot } from "valtio";
import { useCanvasState } from "@/app/state/canvasState";
import * as THREE from "three";
import { useControls } from "leva";

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
}

// const ResizeFix = () => {
//   const { gl, camera } = useThree(); // Отримуємо камеру і WebGL-контекст

//   useEffect(() => {
//     const handleResize = () => {
//       // Оновлюємо розмір WebGL-контексту
//       gl.setSize(window.innerWidth, window.innerHeight);

//       // Оновлюємо співвідношення сторін камери
//     };

//     // Додаємо слухач для зміни розміру вікна
//     window.addEventListener("resize", handleResize);

//     // Викликаємо перший раз для коректного налаштування
//     handleResize();

//     return () => {
//       // Очищаємо слухач, щоб уникнути витоків пам'яті
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [gl, camera]);

//   return null;
// };

const Background: React.FC = () => {
  const { scene, gl } = useThree(); // Отримуємо scene і renderer (gl)
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

const DecalMaterial: React.FC<
  DecalMaterialProps & { offsetFactor?: number }
> = ({ pictureUrl, offsetFactor = 2 }) => {
  const texture = useTexture(pictureUrl);

  return (
    // @ts-ignore
    <meshStandardMaterial
      map={texture}
      transparent
      polygonOffset
      polygonOffsetFactor={offsetFactor} // Зміщення для уникнення накладання
      polygonOffsetUnits={-2} // Базова одиниця зміщенняor={-1}
    />
  );
};
// @ts-ignore
const SingleDecal = ({ meshRef, engraving, controls, offsetFactor }) => {
  if (!meshRef.current) return null;

  return (
    <Decal
      mesh={meshRef.current}
      position={[controls.positionX, controls.positionY, controls.positionZ]}
      rotation={[controls.rotationX, controls.rotationY, controls.rotationZ]}
      scale={controls.scale}
    >
      <DecalMaterial
        pictureUrl={engraving.pictureUrl}
        offsetFactor={offsetFactor}
      />
    </Decal>
  );
};

const radiansToDegrees = (rad: number) => (rad * 180) / Math.PI;
const degreesToRadians = (deg: number) => (deg * Math.PI) / 180;
// @ts-ignore
const DecalWithControls = ({ meshRef, engraving, index }) => {
  const state = useCanvasState();

  // Remove the Leva useControls hook and directly use the values from the engraving object
  const controls = {
    positionX: engraving.locationX,
    positionY: engraving.locationY,
    positionZ: engraving.text === null ? 0 : -1,
    rotationX: 0,
    rotationY: engraving.side === 2 ? Math.PI : 0,
    rotationZ: engraving.rotationZ,
    scale: engraving.scaleX,
  };

  return (
    <SingleDecal
      meshRef={meshRef}
      engraving={engraving}
      controls={controls}
      offsetFactor={index * -0.1}
    />
  );
};

const EngravedMesh = ({
  //@ts-ignore
  geometry,
  //@ts-ignore
  material,
  //@ts-ignore
  position,
  //@ts-ignore
  rotation,
  //@ts-ignore
  engravings,
}) => {
  // @ts-ignore
  const meshRef = useRef();

  return (
    // @ts-ignore
    <group>
      {/*@ts-ignore*/}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material.clone()}
        position={position}
        rotation={rotation}
      >
        {engravings?.map(
          // @ts-ignore
          (eng, index) =>
            "engravingSide" + eng.side === material.name && (
              <DecalWithControls
                key={`${eng.id}-${index}`}
                meshRef={meshRef}
                engraving={eng}
                index={index}
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
  materialProps = {},
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
    console.log("update material started");
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
            console.log(1);
            updateMaterial(child.material, materialName, {
              color: snap.bladeCoatingColor.colorCode,
              metalness: 0.0,
              roughness: 0.0,
            });
            break;

          case "model":
            updateMaterial(child.material, materialName, {
              color: "#CCCCCC",
              metalness: 1,
              roughness: 0.3,
            });
            break;

          case "handle":
            updateMaterial(child.material, materialName, {
              color: snap.handleColor.colorCode,
              metalness: 0.1,
              roughness: 0.8,
            });
            break;

          case "engravingSide1":
          case "engravingSide2":
          case "engravingSide3":
            updateMaterial(child.material, materialName, {
              color: snap.bladeCoatingColor.engravingColorCode,
              metalness: 0.6,
              roughness: 0.4,
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
  console.log(engravingMeshes);
  console.log(snap);
  return (
    // @ts-ignore
    <group position={position} rotation={rotation}>
      {/*@ts-ignore*/}
      <primitive ref={modelRef} object={scene} />
      {engravingMeshes.map((mesh, idx) => (
        <EngravedMesh
          key={`${mesh.name}-${idx}`}
          geometry={mesh.geometry}
          material={mesh.material}
          position={mesh.position}
          rotation={mesh.rotation}
          engravings={snap.engravings}
        />
      ))}
      {/*@ts-ignore*/}
    </group>
  );
};

const KnifeConfigurator: React.FC = () => {
  const state = useCanvasState();
  const snap = useSnapshot(state);

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
      color: snap.bladeCoatingColor.colorCode,
      metalness: 0.8,
      roughness: 0.2,
    },
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  };

  const sheathSettings = {
    materialProps: {
      color: snap.sheathColor.colorCode,
      metalness: 0.1,
      roughness: 0.9,
    },
  };

  const Lighting: React.FC = () => (
    <>
      {/*@ts-ignore*/}
      <ambientLight intensity={0.5} />
      {/*@ts-ignore*/}
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      {/*@ts-ignore*/}
      <directionalLight position={[-10, -10, -5]} intensity={0.4} />
    </>
  );

  const Controls: React.FC = () => (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={10}
      maxDistance={100}
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
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        preserveDrawingBuffer: false, // Уникайте збереження буферів для розробки
      }}
    >
      {/* <ResizeFix /> */}
      <Lighting />
      <Controls />
      <Background />

      {validateModelUrl(snap.bladeShape.bladeShapeModelUrl) && (
        //@ts-ignore
        <ModelPart
          url={snap.bladeShape.bladeShapeModelUrl}
          {...bladeSettings}
        />
      )}

      {validateModelUrl(snap.bladeShape.sheathModelUrl) && (
        //@ts-ignore
        <ModelPart
          url={snap.bladeShape.sheathModelUrl}
          {...sheathSettings}
          position={[0, -20, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
      )}
    </Canvas>
  );
};

export default KnifeConfigurator;
