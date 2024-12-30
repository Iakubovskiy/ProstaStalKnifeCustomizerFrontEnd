"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import FasteningService from "@/app/services/FasteningService";
import CardComponent from "./CardComponent";
import Fastening from "@/app/Models/Fastening";
import { useCanvasState } from "@/app/state/canvasState";
import Characteristics from "@/app/components/Characteristics/Characteristics";
import BladeCoating from "@/app/Models/BladeCoating";
import { useSnapshot } from "valtio";

const PreviewGenerator = dynamic(() => import("./PreviewGenerator"), {
  ssr: false,
  loading: () => (
    <div style={{ width: 150, height: 150, background: "#f0f0f0" }} />
  ),
});

const FasteningCustomizationComponent: React.FC = () => {
  const [fastenings, setFastenings] = useState<Fastening[]>([]);
  const [previews, setPreviews] = useState<{ [key: number]: string }>({});
  const fasteningService = new FasteningService();
  const state = useCanvasState();
  const snap = useSnapshot(state);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchFastenings = async () => {
      try {
        const fastenings = await fasteningService.getAll();
        setFastenings(fastenings);
      } catch (error) {
        console.error("Error fetching fastenings:", error);
      }
    };

    fetchFastenings();
  }, []);

  const handlePreviewGenerated = (id: number, preview: string) => {
    setPreviews((prev) => ({
      ...prev,
      [id]: preview,
    }));
  };

  const fasteningOptionClick = (fastening: Fastening) => {
    state.fastening.push(fastening);
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
        {fastenings.map((fastening) => (
          <React.Fragment key={fastening.id}>
            <CardComponent
              backgroundPicture={previews[fastening.id] || "#ffffff"}
              tooltipText={fastening.name}
              onClick={() => fasteningOptionClick(fastening)}
            />
            {!previews[fastening.id] && (
              <PreviewGenerator
                modelUrl={fastening.modelUrl}
                onPreviewGenerated={(preview) =>
                  handlePreviewGenerated(fastening.id, preview)
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: "16px" }}>
        <Characteristics
          data={snap.fastening[0]}
          isReadOnly1={true}
          currentBladeCoatingColor={""}
          onChange={() => {}}
          type="Fastening"
        />
      </div>
    </>
  );
};

export default FasteningCustomizationComponent;
