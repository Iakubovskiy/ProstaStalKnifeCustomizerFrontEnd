"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AttachmentService from "@/app/services/AttachmentService";
import CardComponent from "./CardComponent";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import { useSnapshot } from "valtio";
import ModalFormButton from "../../ModalButton/ModalButton";
import { AttachmentForCanvas } from "@/app/Interfaces/Knife/AttachmentForCanvas";

const PreviewGenerator = dynamic(() => import("./PreviewGenerator"), {
  ssr: false,
  loading: () => (
    <div style={{ width: 150, height: 150, background: "#f0f0f0" }} />
  ),
});

const AttachmentCustomizationComponent: React.FC = () => {
  const [fastenings, setAttachments] = useState<AttachmentForCanvas[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const fasteningService = new AttachmentService();
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchAttachments = async () => {
      try {
        const fastenings = await fasteningService.getAllActiveForCanvas();
        setAttachments(fastenings);
      } catch (error) {
        console.error("Error fetching fastenings:", error);
      }
    };

    fetchAttachments();
  }, []);

  const handlePreviewGenerated = (id: string, preview: string) => {
    setPreviews((prev) => ({
      ...prev,
      [id]: preview,
    }));
  };

  const fasteningOptionClick = (attachment: AttachmentForCanvas) => {
    state.attachment = attachment;
    console.log(state);
    state.invalidate();
  };

  const removeAttachment = () => {
    state.attachment = null;
    console.log("Attachment removed:", state);
    state.invalidate();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          position: "relative",
        }}
      >
        {/* Пуста картка для видалення attachment */}
        <CardComponent
          backgroundPicture="#f9fafb"
          tooltipText="Без доповнень"
          onClick={removeAttachment}
        />

        {/* Картки з attachments */}
        {fastenings.map((attachment) => (
          <React.Fragment key={attachment.id}>
            <CardComponent
              backgroundPicture={previews[attachment.id] || "#ffffff"}
              tooltipText={"Доповнення"}
              onClick={() => fasteningOptionClick(attachment)}
            />
            {!previews[attachment.id] && (
              <PreviewGenerator
                modelUrl={attachment.model?.fileUrl}
                onPreviewGenerated={(preview) =>
                  handlePreviewGenerated(attachment.id, preview)
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="p-3">
        <ModalFormButton component="attachments"></ModalFormButton>
      </div>
    </>
  );
};

export default AttachmentCustomizationComponent;
