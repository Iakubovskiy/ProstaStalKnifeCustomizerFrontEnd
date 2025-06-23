import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import { useCanvasState } from "@/app/state/canvasState";
import Lighting from "./Lighting";
import Controls from "./Controls";
import Background from "@/app/components/CustomCanvas/Background";
import ModelPart from "./ModelPart";
import CustomLoader from "./CustomLoader";
import { AppFile } from "@/app/Interfaces/File";

import KnifeService from "@/app/services/KnifeService";
import AttachmentService from "@/app/services/AttachmentService";
import InitialDataService from "@/app/services/InitialDataService";
import APIService from "@/app/services/ApiService";
import { Knife } from "@/app/Interfaces/Knife/Knife";
import { Attachment } from "@/app/Interfaces/Attachment";
import { KnifeForCanvas } from "@/app/Interfaces/Knife/KnifeForCanvas";
import { BladeCoatingColorForCanvas } from "@/app/Interfaces/Knife/BladeCoatingColorForCanvas";
import { BladeShapeForCanvas } from "@/app/Interfaces/Knife/BladeShapeForCanvas";
import { HandleColorForCanvas } from "@/app/Interfaces/Knife/HandleColorForCanvas";
import { SheathColorForCanvas } from "@/app/Interfaces/Knife/SheathColorForCanvas";

interface Props {
  productId?: string | null;
}

// 1. Створюємо внутрішній компонент для сцени
const Scene = () => {
  const state = useCanvasState();
  const snap = useSnapshot(state);

  const validateModelUrl = (url: string | null | undefined): boolean => {
    return Boolean(
      url &&
        (url.endsWith(".glb") ||
          url.endsWith(".gltf") ||
          url.startsWith("blob:"))
    );
  };

  const isValidAppFile = (file: AppFile | null): file is AppFile => {
    return file !== null && file.fileUrl !== null && file.fileUrl !== undefined;
  };

  const bladeSettings = {
    materialProps: { default: { color: snap.bladeCoatingColor.colorCode } },
  };
  const sheathSettings = {
    materialProps: { default: { color: snap.sheathColor.colorCode } },
  };

  return (
    <>
      <Lighting />
      <Controls />
      <Background />
      <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
        {isValidAppFile(snap.bladeShape.bladeShapeModel) &&
          validateModelUrl(snap.bladeShape.bladeShapeModel.fileUrl) && (
            <ModelPart
              url={snap.bladeShape.bladeShapeModel.fileUrl!}
              {...bladeSettings}
            />
          )}
        {snap.bladeShape.sheathModel &&
          isValidAppFile(snap.bladeShape.sheathModel) &&
          validateModelUrl(snap.bladeShape.sheathModel.fileUrl) && (
            <ModelPart
              url={snap.bladeShape.sheathModel.fileUrl!}
              {...sheathSettings}
              position={[0, -10, 0]}
              rotation={[0, 0, 0]}
            />
          )}
        {snap.attachment &&
          snap.attachment.model &&
          isValidAppFile(snap.attachment.model) &&
          validateModelUrl(snap.attachment.model.fileUrl) && (
            <ModelPart
              url={snap.attachment.model.fileUrl!}
              {...sheathSettings}
              position={[-1, -10, -1]}
              rotation={[0, 0, Math.PI / 2]}
            />
          )}
      </group>
    </>
  );
};

const KnifeConfigurator: React.FC<Props> = ({ productId }) => {
  const state = useCanvasState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiService = new APIService();
    const knifeService = new KnifeService(apiService);
    const attachmentService = new AttachmentService(apiService);
    const initialDataService = new InitialDataService();

    const populateKnifeState = (data: KnifeForCanvas) => {
      state.bladeShape = data.bladeShape;
      state.bladeCoatingColor = data.bladeCoatingColor;
      state.handleColor = data.handleColor || state.handleColor;
      state.sheathColor = data.sheathColor || state.sheathColor;
      // @ts-ignore
      state.attachment =
        data.attachment && data.attachment.length > 0
          ? data.attachment[0]
          : null;
      state.engravings = data.engravings || [];
    };

    const populateAttachmentState = (attachment: Attachment) => {
      // Для attachment заповнюємо тільки поле attachment
      // @ts-ignore
      state.attachment = {
        id: attachment.id,
        name: attachment.name,
        model: attachment.model,
        // Додайте інші потрібні поля з attachment
      };

      // Можливо, потрібно очистити інші поля або встановити значення за замовчуванням
      // state.bladeShape = defaultBladeShape;
      // state.bladeCoatingColor = defaultBladeCoatingColor;
      // і т.д.
    };

    const SelectByDefault = (
      shape: BladeShapeForCanvas,
      coatingColor: BladeCoatingColorForCanvas,
      sheath: SheathColorForCanvas,
      handleColor: HandleColorForCanvas
    ) => {
      let changed = false;
      if (state.bladeShape.id !== shape.id) {
        state.bladeShape = { ...shape };
        state.bladeShape.sheathId = shape.sheathId;
        changed = true;
      }
      if (state.bladeCoatingColor.id !== coatingColor.id) {
        state.bladeCoatingColor = coatingColor;
        changed = true;
      }
      if (state.handleColor.id !== handleColor.id) {
        state.handleColor = handleColor;
        changed = true;
      }
      if (state.sheathColor.id !== sheath.id) {
        state.sheathColor = sheath;
        changed = true;
      }
      if (changed) state.invalidate();
    };

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (productId) {
          // Спочатку пробуємо завантажити як knife
          try {
            const knifeData = await knifeService.getById(productId);
            populateKnifeState(knifeData.knifeForCanvas);
          } catch (knifeError: any) {
            // Якщо не вдалося завантажити як knife, пробуємо як attachment
            if (knifeError.status === 404) {
              try {
                const attachmentData = await attachmentService.getById(
                  productId
                );
                populateAttachmentState(attachmentData);
              } catch (attachmentError: any) {
                console.error(
                  "Failed to load attachment data:",
                  attachmentError
                );
                throw new Error("Продукт не знайдено");
              }
            } else {
              throw knifeError;
            }
          }
        } else {
          // Якщо productId немає, завантажуємо початкові дані
          const initialData = await initialDataService.getData();
          console.log("Initial data fetched:", initialData);
          SelectByDefault(
            initialData.knifeForCanvas.bladeShape,
            initialData.knifeForCanvas.bladeCoatingColor,
            initialData.knifeForCanvas.sheathColor,
            initialData.knifeForCanvas.handleColor
          );
        }
      } catch (err) {
        console.error("Failed to load product data:", err);
        setError("Не вдалося завантажити дані для конфігуратора.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId, state]);

  // 2. Тепер ми завжди рендеримо <Canvas>
  return (
    <Canvas
      frameloop="always"
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        preserveDrawingBuffer: false,
      }}
    >
      <Suspense fallback={<CustomLoader />}>
        {/* 3. Логіку рендерингу переносимо всередину */}
        {isLoading ? null : error ? null : (
          // Коли все добре, рендеримо сцену
          <Scene />
        )}
      </Suspense>
    </Canvas>
  );
};

export default KnifeConfigurator;
