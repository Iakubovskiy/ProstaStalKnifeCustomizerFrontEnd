"use client";
import React, {useEffect, useRef, useState} from "react";
import "../../styles/globals.css";
import CustomCanvas from "../../app/components/CustomCanvas/CustomCanvas";
import { useCanvasState } from "@/app/state/canvasState";
import { Trash2 } from "lucide-react";

const FileInput = ({ label, accept, stateKey }: { label: string; accept: string; stateKey: string }) => {
  const state = useCanvasState();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    if (stateKey === "colorMapUrl") setFileUrl(state.bladeCoatingColor.colorMapUrl);
    if (stateKey === "normalMapUrl") setFileUrl(state.bladeCoatingColor.normalMapUrl);
    if (stateKey === "roughnessMapUrl") setFileUrl(state.bladeCoatingColor.roughnessMapUrl);
    if (stateKey === "bladeShapeModelUrl") setFileUrl(state.bladeShape.bladeShapeModelUrl);
  }, [state.bladeCoatingColor, state.bladeShape, stateKey]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      if (stateKey === "colorMapUrl") {
        state.bladeCoatingColor.colorMapUrl = url;
      } else if (stateKey === "normalMapUrl") {
        state.bladeCoatingColor.normalMapUrl = url;
      } else if (stateKey === "roughnessMapUrl") {
        state.bladeCoatingColor.roughnessMapUrl = url;
      }
      else if (stateKey === "bladeShapeModelUrl") {
        state.bladeShape = { ...state.bladeShape, bladeShapeModelUrl: url };
      }
    }
  };

  const handleRemove = () => {
    setFileUrl(null);
    setInputKey(Date.now());

    if (stateKey === "colorMapUrl") {
      state.bladeCoatingColor = { ...state.bladeCoatingColor, colorMapUrl: null };
    } else if (stateKey === "normalMapUrl") {
      state.bladeCoatingColor = { ...state.bladeCoatingColor, normalMapUrl: null };
    } else if (stateKey === "roughnessMapUrl") {
      state.bladeCoatingColor = { ...state.bladeCoatingColor, roughnessMapUrl: null };
    } else if (stateKey === "bladeShapeModelUrl") {
      state.bladeShape = { ...state.bladeShape, bladeShapeModelUrl: "" };
    }
  };

  return (
      <div className="flex items-center justify-between bg-gray-800 p-2 rounded-lg text-white">
        <label className="w-full cursor-pointer">
          {label}
          <input
              key={inputKey}
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
          />
        </label>
        {fileUrl && (
            <button onClick={handleRemove} className="text-red-400 hover:text-red-600">
              <Trash2 size={20} />
            </button>
        )}
      </div>
  );
};

const TestPage = () => {
  return (
      <div className="flex h-screen">
        <div className="flex-1">
          <div style={{ height: "90vh" }}>
            <CustomCanvas />
          </div>
        </div>
        <div className="w-72 bg-gray-900 p-4 space-y-2 text-white overflow-y-auto">
          <h2 className="text-lg font-semibold">Файли</h2>
          <FileInput label="Blade Shape" accept=".glb" stateKey="bladeShapeModelUrl" />
          <FileInput label="Sheath" accept=".glb" stateKey="sheathModel" />
          <FileInput label="Color Map" accept="image/*" stateKey="colorMapUrl" />
          <FileInput label="Normal Map" accept="image/*" stateKey="normalMapUrl" />
          <FileInput label="Roughness Map" accept="image/*" stateKey="roughnessMapUrl" />
        </div>
      </div>
  );
};

export default TestPage;
