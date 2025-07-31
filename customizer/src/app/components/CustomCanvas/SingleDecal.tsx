import React, { Suspense } from "react"; // 1. Імпортуємо Suspense
import { Decal } from "@react-three/drei";
import DecalMaterial from "./DecalMaterial";

// @ts-ignore
const SingleDecal = ({ meshRef, engraving, offsetFactor }) => {
    // 2. Цей код для примусового оновлення через key більше НЕ ПОТРІБЕН.
    // Його можна сміливо видалити, бо Suspense - це правильний інструмент.
    // const [decalKey, setDecalKey] = useState(0);
    // useEffect(() => { ... }, []);

    if (!meshRef.current || !engraving?.picture || !engraving?.picture.fileUrl) {
        return null;
    }

    return (
        <Decal
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
            {/*
        3. ОСЬ РІШЕННЯ:
        Обгортаємо компонент, який містить асинхронний хук useTexture,
        в компонент Suspense. fallback={null} означає, що поки йде
        завантаження, на цьому місці нічого не буде рендеритись.
      */}
            <Suspense fallback={null}>
                <DecalMaterial
                    pictureUrl={engraving.picture.fileUrl}
                    offsetFactor={offsetFactor}
                />
            </Suspense>
        </Decal>
    );
};

export default SingleDecal;