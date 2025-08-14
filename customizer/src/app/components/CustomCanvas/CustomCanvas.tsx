import React, {Suspense, useEffect, useRef, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {useCanvasState} from "@/app/state/canvasState";
import CustomLoader from "./Support/CustomLoader";

import KnifeService from "@/app/services/KnifeService";
import AttachmentService from "@/app/services/AttachmentService";
import InitialDataService from "@/app/services/InitialDataService";
import APIService from "@/app/services/ApiService";
import {Attachment} from "@/app/Interfaces/Attachment";
import {KnifeForCanvas} from "@/app/Interfaces/Knife/KnifeForCanvas";
import {BladeCoatingColorForCanvas} from "@/app/Interfaces/Knife/BladeCoatingColorForCanvas";
import {BladeShapeForCanvas} from "@/app/Interfaces/Knife/BladeShapeForCanvas";
import {HandleColorForCanvas} from "@/app/Interfaces/Knife/HandleColorForCanvas";
import {SheathColorForCanvas} from "@/app/Interfaces/Knife/SheathColorForCanvas";
import Scene from "./Scene";

interface Props {
  productId?: string | null;
}


const screenshotCurrentCanvas = (ref: HTMLCanvasElement | null) => {
  if (!ref) return;
  const dataURL = ref.toDataURL("image/jpeg");
  return dataURL;
};

const KnifeConfigurator: React.FC<Props> = ({ productId }) => {
  const state = useCanvasState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const localCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
      // @ts-ignore
      state.attachment = {
        id: attachment.id,
        name: attachment.name,
        model: attachment.model ?? { fileUrl: "", id: "" },
      };
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
          try {
            const knifeData = await knifeService.getById(productId);
            populateKnifeState(knifeData.knifeForCanvas);
          } catch (knifeError: any) {
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

  useEffect(() => {
    state.getScreenshot = () => {
      return screenshotCurrentCanvas(localCanvasRef.current);
    };
    return () => {
      state.getScreenshot = () => {
        console.warn("Screenshot component was unmounted.");
        return undefined;
      };
    };
  }, []);

  return (
    <Canvas
      frameloop="always"
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        preserveDrawingBuffer: true,
      }}
      onCreated={({ gl }) => {
        localCanvasRef.current = gl.domElement;
      }}
    >
      <Suspense fallback={<CustomLoader />}>
        {isLoading ? null : error ? null : (
          <Scene />
        )}
      </Suspense>
    </Canvas>
  );
};

export default KnifeConfigurator;
