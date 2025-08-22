import { useCanvasState } from "@/app/state/canvasState";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Settings2,
  Trash2,
  Paperclip,
} from "lucide-react";
import ModalFormButton from "../ModalButton/ModalButton";
import { DraggablePopup } from "./DraggablePopup";
import Select, { StylesConfig, SingleValue, GroupBase } from "react-select";
import { EngravingForCanvas } from "@/app/Interfaces/Knife/EngravingForCanvas";
import { ref } from "valtio";
import {fontOptions} from "./fontOptions";

export const PositioningControls: React.FC<{ id: number }> = ({ id }) => {
  const customState = useCanvasState();
  const engraving =
    id >= 0 && id < customState.engravings.length
      ? customState.engravings[id]
      : null;

  const [controls, setControls] = useState({
    positionX: engraving?.locationX ?? 0,
    positionY: engraving?.locationY ?? 0,
    rotationZ: ((engraving?.rotationZ ?? 0) * 180) / Math.PI,
    scale: engraving?.scaleX ?? 20,
  });

  const handleControlChange = (name: string, value: number) => {
    setControls((prev) => {
      const newControls = { ...prev, [name]: value };
      const currentEngraving =
        id >= 0 && id < customState.engravings.length
          ? customState.engravings[id]
          : null;
      if (currentEngraving) {
        const updatedEngraving = { ...currentEngraving };
        switch (name) {
          case "positionX":
            updatedEngraving.locationX = value;
            break;
          case "positionY":
            updatedEngraving.locationY = value;
            break;
          case "rotationZ":
            updatedEngraving.rotationZ = (value * Math.PI) / 180;
            break;
          case "scale":
            updatedEngraving.scaleX = value;
            updatedEngraving.scaleY = value;
            updatedEngraving.scaleZ = value;
            break;
        }
        const newEngravings = [...customState.engravings];
        newEngravings[id] = updatedEngraving;
        customState.engravings = newEngravings;
        customState.invalidate();
      }
      return newControls;
    });
  };

  useEffect(() => {
    const currentEngraving =
      id >= 0 && id < customState.engravings.length
        ? customState.engravings[id]
        : null;
    if (currentEngraving) {
      setControls({
        positionX: currentEngraving.locationX,
        positionY: currentEngraving.locationY,
        rotationZ: (currentEngraving.rotationZ * 180) / Math.PI,
        scale: currentEngraving.scaleX,
      });
    } else {
      setControls({ positionX: 0, positionY: 0, rotationZ: 0, scale: 20 });
    }
  }, [id, customState.engravings]);

  if (!engraving) {
    return (
      <div className="text-xs text-red-500 p-2">
        Помилка: Гравіювання не знайдено.
      </div>
    );
  }

  const mainColor = "#8b7258";
  const accentColor = "#b8845f";
  const bgColorLight = "#f8f4f0";
  const trackColor = "#e0d7cb";

  return (
    <div
      className="mt-1 p-3 rounded-lg shadow-sm"
      style={{ background: "linear-gradient(to bottom, #f9f6f2, #f3eadf)" }}
    >
      <div className="border-t pt-3" style={{ borderColor: accentColor }}>
        <div className="grid gap-y-4 gap-x-2">
          <div>
            <label
              className="block text-xs mb-1 font-medium"
              style={{ color: "#2d3748" }}
            >
              Горизонтально: {controls.positionX.toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="40"
              step="0.1"
              value={controls.positionX}
              onChange={(e) =>
                handleControlChange("positionX", parseFloat(e.target.value))
              }
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer slider-coffee"
              style={{ background: trackColor, borderRadius: "5px" }}
            />
          </div>
          <div>
            <label
              className="block text-xs mb-1 font-medium"
              style={{ color: "#2d3748" }}
            >
              Вертикально: {controls.positionY.toFixed(1)}
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={controls.positionY}
              onChange={(e) =>
                handleControlChange("positionY", parseFloat(e.target.value))
              }
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer slider-coffee"
              style={{ background: trackColor, borderRadius: "5px" }}
            />
          </div>
          <div>
            <label
              className="block text-xs mb-1 font-medium"
              style={{ color: "#2d3748" }}
            >
              Кут повороту: {controls.rotationZ.toFixed(0)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={controls.rotationZ}
              onChange={(e) =>
                handleControlChange("rotationZ", parseFloat(e.target.value))
              }
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer slider-coffee"
              style={{ background: trackColor, borderRadius: "5px" }}
            />
          </div>
          <div>
            <label
              className="block text-xs mb-1 font-medium"
              style={{ color: "#2d3748" }}
            >
              Розмір: {controls.scale.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="30"
              step="0.1"
              value={controls.scale}
              onChange={(e) =>
                handleControlChange("scale", parseFloat(e.target.value))
              }
              className="w-full h-2.5 rounded-lg appearance-none cursor-pointer slider-coffee"
              style={{ background: trackColor, borderRadius: "5px" }}
            />
          </div>
        </div>
        <style jsx>{`
          .slider-coffee {
            -webkit-appearance: none;
            appearance: none;
            outline: none;
            height: 10px;
          }
          .slider-coffee::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(
              135deg,
              ${accentColor} 0%,
              ${mainColor} 100%
            );
            cursor: pointer;
            border: 2px solid ${bgColorLight};
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
            margin-top: -4px;
          }
          .slider-coffee::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: linear-gradient(
              135deg,
              ${accentColor} 0%,
              ${mainColor} 100%
            );
            cursor: pointer;
            border: 2px solid ${bgColorLight};
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
          }
          .slider-coffee::-moz-range-track {
            background: ${trackColor};
            height: 10px;
            border-radius: 5px;
          }
        `}</style>
      </div>
    </div>
  );
};

enum Side {
  Right = 1,
  Left = 2,
  Axillary = 3,
}
export interface OptionType {
  value: string | number;
  label: string;
}
const customSelectStyles: StylesConfig<
  OptionType,
  false,
  GroupBase<OptionType>
> = {
  control: (p, s) => ({
    ...p,
    backgroundColor: "#f8f4f0",
    borderColor: s.isFocused ? "#8b7258" : "#b8845f",
    boxShadow: s.isFocused ? "0 0 0 1px #8b7258" : "none",
    color: "#2d3748",
    borderRadius: "0.375rem",
    minHeight: "42px",
    "&:hover": { borderColor: "#8b7258" },
  }),
  menu: (p) => ({
    ...p,
    backgroundColor: "#f8f4f0",
    borderColor: "#b8845f",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    boxShadow:
      "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    zIndex: 20,
  }),
  option: (p, s) => ({
    ...p,
    backgroundColor: s.isSelected
      ? "#8b7258"
      : s.isFocused
      ? "#f0e5d6"
      : "#f8f4f0",
    color: s.isSelected ? "#f8f4f0" : "#2d3748",
    padding: "0.5rem 0.75rem",
    cursor: "pointer",
    "&:active": { backgroundColor: "#a08a73" },
  }),
  singleValue: (p) => ({ ...p, color: "#2d3748" }),
  placeholder: (p) => ({ ...p, color: "#6b7280" }),
  dropdownIndicator: (p) => ({
    ...p,
    color: "#8b7258",
    "&:hover": { color: "#2d3748" },
  }),
  indicatorSeparator: (p) => ({ ...p, backgroundColor: "#b8845f" }),
};

interface EngravingComponentProps {
  isMobileContext: boolean;
  mobilePositioningTargetIdContext: number | null;
  onToggleMobilePositioningTarget: (id: number | null) => void;
}

const EngravingComponent: React.FC<EngravingComponentProps> = ({
  isMobileContext,
  mobilePositioningTargetIdContext,
  onToggleMobilePositioningTarget,
}) => {
  interface CardItem {
    id: number;
    type: "text" | "file";
    selectedSide: number;
    font?: string;
    text?: string;
    isExpanded?: boolean;
    selectedFile?: File | null;
    isPositioningOpen?: boolean;
  }

  const customState = useCanvasState();
  const [items, setItems] = useState<CardItem[]>([]);
  const fontSize = 300;

  useEffect(() => {
    if (!customState.engravings || customState.engravings.length === 0) {
      setItems([]);
    } else {
      const newItems = customState.engravings.map(
        (engraving, index: number) => {
          const existingItem = items.find((it) => it.id === index);
          return {
            id: index,
            type: (engraving.text === "" || engraving.text === null) ? "file" : ("text" as "text" | "file"),
            selectedSide: engraving.side,
            font: engraving.font || "Montserrat",
            text: engraving.text || "",
            isExpanded: existingItem ? existingItem.isExpanded : true,
            selectedFile: existingItem ? existingItem.selectedFile : null,
            isPositioningOpen: existingItem
              ? existingItem.isPositioningOpen
              : false,
          };
        }
      );
      setItems(newItems);
    }
  }, [customState.engravings]);

  const removeCard = (idToRemove: number) => {
    if (isMobileContext && mobilePositioningTargetIdContext === idToRemove) {
      onToggleMobilePositioningTarget(null);
    } else if (
      isMobileContext &&
      mobilePositioningTargetIdContext !== null &&
      idToRemove < mobilePositioningTargetIdContext
    ) {
      onToggleMobilePositioningTarget(mobilePositioningTargetIdContext - 1);
    }

    setItems((prevItems) => {
      const updatedCanvasEngravings = [...customState.engravings];
      updatedCanvasEngravings.splice(idToRemove, 1);
      customState.engravings = updatedCanvasEngravings;
      customState.invalidate();

      return prevItems
        .filter((item) => item.id !== idToRemove)
        .map((item, index) => ({ ...item, id: index }));
    });
  };

  const measureTextInDOM = (text: string, fontFamily: string, fontSize: number): { width: number; height: number } => {
    const fontBase64 = fontOptions.find((option) => option.value === fontFamily)?.base64;
    const style = document.createElement("style");
    style.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
    }
  `;
    document.head.appendChild(style);
    const span = document.createElement("span");

    span.style.fontFamily = `'${fontFamily}', serif`;
    span.style.fontSize = `${fontSize}px`;
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.left = "-9999px";
    span.style.top = "-9999px";
    span.textContent = text;
    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    const dimensions = { width: rect.width, height: rect.height };
    document.body.removeChild(span);

    return dimensions;
  }

  const textToSvgUrl = (
    text: string,
    fontFamily: string,
    color: string,
    textWidth: number,
    textHeight: number,
    fontSize: number,
    returnAsString: boolean = false
  ): string => {
    const fontBase64 = fontOptions.find((option) => option.value === fontFamily)?.base64;

    const svg = `
      <svg 
        width="${textWidth}" 
        height="${textHeight}"
        xmlns="http://www.w3.org/2000/svg"
        
      >
      <style>
            @font-face {
                font-family: '${fontFamily}';
                src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
            }
            text{
                font-family: '${fontFamily}',serif;
            }
        </style>
        <text
          dominant-baseline="hanging"
          text-anchor="start"
          font-family="${fontFamily}"
          font-size="${fontSize}"
          fill="${color}"
        >
          ${text}
        </text>   
      </svg>
    `;
    if (returnAsString) {
      return svg;
    }

    const blob = new Blob([svg.replace(/\s\s+/g, " ")], {
      type: "image/svg+xml",
    });
    return URL.createObjectURL(blob);
  }

  const emptyImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ihGyysAAAAASUVORK5CYII=";

  const handleFontChange = (
    id: number,
    selectedOption: SingleValue<OptionType>
  ) => {
    const value = selectedOption
      ? (selectedOption.value as string)
      : "Montserrat";
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, font: value };
          if (customState.engravings[id]) {
            customState.engravings[id].font = value;
            if (item.type === "text" && item.text) {
              const textDimensions = measureTextInDOM(item.text, value, fontSize);
              const textWidth = textDimensions.width;
              const textHeight = textDimensions.height;
              const newUrl = textToSvgUrl(
                item.text,
                value,
                customState.engravings[id].side === 3? customState.sheathColor.engravingColorCode : customState.bladeCoatingColor.engravingColorCode || "#000000",
                textWidth,
                textHeight,
                fontSize
              );
              if (customState.engravings[id].picture) {
                customState.engravings[id].picture.fileUrl = newUrl;
              }
              const svgString = textToSvgUrl(
                  item.text,
                  value,
                  customState.engravings[id].side === 3? customState.sheathColor.engravingColorCode : customState.bladeCoatingColor.engravingColorCode || "#000000",
                  textWidth,
                  textHeight,
                  fontSize,
                  true
              );
              const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
              const file = new File([svgBlob], `engraving-${id}.svg`, { type: "image/svg+xml" });
              const localPreviewUrl = URL.createObjectURL(svgBlob);

              updateEngravingState(id, {
                text: item.text,
                picture: {
                  id: `svg-pending-${customState.engravings[id].id}`,
                  fileUrl: localPreviewUrl,
                },
                fileObject: ref(
                    file
                ),
              });
            }
            customState.invalidate();
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleSideChange = (
    id: number,
    selectedOption: SingleValue<OptionType>
  ) => {
    const value = selectedOption
      ? (selectedOption.value as number)
      : Side.Right;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, selectedSide: value };
          if(item.type === "file" && item.selectedFile){
            const file = item.selectedFile;
            const isSVG = file.type === "image/svg+xml";
            const engravingColor = value === Side.Axillary? customState.sheathColor.engravingColorCode : customState.bladeCoatingColor.engravingColorCode || "#000000";
            if (isSVG) {
              const reader = new FileReader();
              reader.onload = () => {
                let svgText = reader.result as string;

                svgText = replaceStrokeColor(svgText, engravingColor);

                const blob = new Blob([svgText], { type: "image/svg+xml" });
                const svgUrl = URL.createObjectURL(blob);

                updateEngravingState(id, {
                  picture: {
                    id: "",
                    fileUrl: svgUrl,
                  },
                  fileObject: ref(file),
                });
              };
              reader.readAsText(file);
            } else {
              updateEngravingState(id, {
                picture: {
                  id: "",
                  fileUrl: URL.createObjectURL(file),
                },
                fileObject: ref(file),
              });
            }
          }
          else if (item.type === "text" && item.text && item.font) {
            const textDimensions = measureTextInDOM(item.text, item.font, fontSize);
            const textWidth = textDimensions.width;
            const textHeight = textDimensions.height;
            const newUrl = textToSvgUrl(
                item.text,
                item.font,
                value === Side.Axillary? customState.sheathColor.engravingColorCode : customState.bladeCoatingColor.engravingColorCode || "#000000",
                textWidth,
                textHeight,
                fontSize
            );
            if (customState.engravings[id].picture) {
              customState.engravings[id].picture.fileUrl = newUrl;
            }
            customState.invalidate();
          }
          if (customState.engravings[id]) {
            customState.engravings[id].side = value;
            customState.engravings[id].rotationY =
              value === Side.Left ? Math.PI / 2 : 0;
            customState.invalidate();
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleTypeChange = (
    id: number,
    selectedOption: SingleValue<OptionType>
  ) => {
    const value = selectedOption
      ? (selectedOption.value as "text" | "file")
      : "text";
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, type: value };
          if (customState.engravings[id]) {
            if (value === "file") {
              updatedItem.text = "";
              updatedItem.font = "";
              customState.engravings[id].text = "";
              customState.engravings[id].font = "";
            } else {
              updatedItem.selectedFile = null;
              if (customState.engravings[id].picture) {
                customState.engravings[id].picture.fileUrl = emptyImage;
              }
              if (item.text && item.font) {
                const textDimensions = measureTextInDOM(item.text, item.font, fontSize);
                const textWidth = textDimensions.width;
                const textHeight = textDimensions.height;
                const newUrl = textToSvgUrl(
                  item.text,
                  item.font,
                  customState.engravings[id].side === 3? customState.sheathColor.engravingColorCode : customState.bladeCoatingColor.engravingColorCode || "#000000",
                  textWidth,
                  textHeight,
                  fontSize
                );
                if (customState.engravings[id].picture) {
                  customState.engravings[id].picture.fileUrl = newUrl;
                }
              }
            }
            customState.invalidate();
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const updateEngravingState = (
    index: number,
    newProps: Partial<EngravingForCanvas>
  ) => {
    const currentEngraving = customState.engravings[index];
    if (currentEngraving) {
      const updatedEngraving = { ...currentEngraving, ...newProps };
      const newEngravings = [...customState.engravings];
      newEngravings[index] = updatedEngraving;
      customState.engravings = newEngravings;
    }
  };

  const handleTextChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item))
    );
    const item = items.find((it) => it.id === id);
    const currentEngraving = customState.engravings[id];

    if (item && currentEngraving) {
      const textDimensions = measureTextInDOM(value || "", item.font || "Montserrat", fontSize);
      const textWidth = textDimensions.width;
      const textHeight = textDimensions.height;
      const svgString = textToSvgUrl(
        value,
        item.font ?? "Montserrat",
          customState.engravings[id].side === 3? customState.sheathColor.engravingColorCode : customState.bladeCoatingColor.engravingColorCode || "#000000",
          textWidth,
          textHeight,
          fontSize,
          true
      );
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const file = new File([svgBlob], `engraving-${id}.svg`, { type: "image/svg+xml" });
      const localPreviewUrl = URL.createObjectURL(svgBlob);
      updateEngravingState(id, {
        text: value,
        picture: {
          id: `svg-pending-${customState.engravings[id].id}`,
          fileUrl: localPreviewUrl,
        },
        fileObject: ref(
          file
        ),
      });
    }
  };

  const replaceStrokeColor = (svgText: string, newColor: string): string => {
    return svgText.replace(/(<(path|g|svg)[^>]*style="[^"]*)stroke\s*:\s*#[0-9a-fA-F]{3,6}([^"]*)"/gi,
        (match, p1, tag, p3) => {
          return `${p1}stroke:${newColor}${p3}"`;
        }
    );
  }

  const getEngravingColor = (id: number) : string => {
    let engravingColor: string;
    if(customState.engravings[id].side === Side.Axillary) {
      engravingColor = customState.sheathColor.engravingColorCode;
    }
    else {
      engravingColor = customState.bladeCoatingColor.engravingColorCode;
    }
    return engravingColor;
  }

  const handleFileChange = (id: number, file: File | null) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedFile: file } : item
      )
    );
    if (file) {
      const isSVG = file.type === "image/svg+xml";
      const engravingColor = getEngravingColor(id);
      if (isSVG) {
        const reader = new FileReader();
        reader.onload = () => {
          let svgText = reader.result as string;

          svgText = replaceStrokeColor(svgText, engravingColor);

          const blob = new Blob([svgText], { type: "image/svg+xml" });
          const svgUrl = URL.createObjectURL(blob);

          updateEngravingState(id, {
            picture: {
              id: "",
              fileUrl: svgUrl,
            },
            fileObject: ref(file),
          });
        };
        reader.readAsText(file);
      } else {
        updateEngravingState(id, {
          picture: {
            id: "",
            fileUrl: URL.createObjectURL(file),
          },
          fileObject: ref(file),
        });
      }
    } else {
      updateEngravingState(id, {
        picture: { id: "empty", fileUrl: emptyImage },
        fileObject: null,
      });
    }
  };

  const toggleExpand = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const addCard = () => {
    const newEngravingId = customState.engravings.length;
    const newEngraving: EngravingForCanvas = {
      id: "",
      picture: { fileUrl: emptyImage, id: "" },
      side: Side.Right,
      text: "",
      font: "Montserrat",
      locationX: 0,
      locationY: 0,
      locationZ: 0.01,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scaleX: 20,
      scaleY: 20,
      scaleZ: 20,
    };
    customState.engravings = [...customState.engravings, newEngraving];
    customState.invalidate();
    const newCardState: CardItem = {
      id: newEngravingId,
      type: "text" as const,
      selectedSide: Side.Right,
      font: "Montserrat",
      text: "",
      selectedFile: null,
      isExpanded: true,
      isPositioningOpen: false,
    };
    setItems((prev) => [...prev, newCardState]);
  };

  const handleOpenDraggablePopup = (id: number) => {
    if (isMobileContext) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isPositioningOpen: !item.isPositioningOpen }
          : { ...item, isPositioningOpen: false }
      )
    );
  };
  const handleTogglePositioning = (id: number) => {
    if (isMobileContext) {
      const targetId = mobilePositioningTargetIdContext === id ? null : id;
      onToggleMobilePositioningTarget(targetId);
    } else {
      handleOpenDraggablePopup(id);
    }
  };

  const typeOptions: OptionType[] = [
    { value: "text", label: "Текст" },
    { value: "file", label: "Фото" },
  ];

  const sideOptions: OptionType[] = [
    { value: Side.Right, label: "Права" },
    { value: Side.Left, label: "Ліва" },
    { value: Side.Axillary, label: "Піхви" },
  ];

  return (
      <div className="w-full">
        <div className="p-0 sm:p-0 w-full max-w-2xl mx-auto">
          <div className="mb-4">
            <ModalFormButton></ModalFormButton>
          </div>
          <button
              className="p-3 w-full rounded-lg transition font-medium mb-6 shadow-sm hover:shadow-md active:shadow-inner"
              style={{ backgroundColor: "rgb(143, 88, 48)", color: "#f8f4f0" }}
              onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(184, 132, 95)")
              }
              onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgb(143, 88, 48)")
              }
              onClick={addCard}
          >
            Додати гравіювання
          </button>

          <div className="space-y-4">
            {items.map((item) => {
              const isPositioningDetachedForThisItem =
                  isMobileContext && mobilePositioningTargetIdContext === item.id;

              const showPositioningControlsInCard =
                  item.isExpanded && !isPositioningDetachedForThisItem && !item.isPositioningOpen;

              return (
                  <div
                      key={item.id}
                      className="rounded-lg shadow-md"
                      style={{
                        background:
                            "linear-gradient(to bottom right, #b8845f, #8b7258)",
                        color: "#f8f4f0",
                      }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4 space-x-2">
                        <h3 className="font-semibold lg:text-lg text-sm whitespace-nowrap whitespace-nowrap">
                          Гравіювання {item.id + 1}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <button
                              onClick={() => toggleExpand(item.id)}
                              className="px-2.5 py-1.5 transition-colors flex items-center justify-center gap-1.5 rounded-md text-sm text-[#f8f4f0] hover:bg-[#a08a73] active:bg-[#8b7258]"
                          >
                            {item.isExpanded ? (
                                <>
                                  <ChevronUp size={16} />
                                  <span>Згорнути</span>
                                </>
                            ) : (
                                <>
                                  <ChevronDown size={16} />
                                  <span>Розгорнути</span>
                                </>
                            )}
                          </button>
                          <button
                              className="p-1.5 rounded-full transition-colors hover:bg-[#a08a73] active:bg-[#8b7258]"
                              onClick={() => removeCard(item.id)}
                              title="Видалити гравіювання"
                          >
                            <Trash2 size={18} className="text-[#f8f4f0]" />
                          </button>
                        </div>
                      </div>

                      {item.isExpanded && (
                          <>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Тип:
                                </label>
                                <Select<OptionType, false, GroupBase<OptionType>>
                                    options={typeOptions}
                                    styles={customSelectStyles}
                                    value={typeOptions.find(
                                        (opt) => opt.value === item.type
                                    )}
                                    onChange={(selectedOption) =>
                                        handleTypeChange(item.id, selectedOption)
                                    }
                                    placeholder="Виберіть тип..."
                                    isSearchable={false}
                                />
                              </div>
                              {item.type === "text" ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">
                                        Текст:
                                      </label>
                                      <input
                                          type="text"
                                          className="rounded p-2 w-full border focus:ring-1 focus:outline-none"
                                          style={{
                                            backgroundColor: "#f8f4f0",
                                            color: "#2d3748",
                                            borderColor: "#b8845f",
                                            /* @ts-ignore */
                                            "--tw-ring-color": "#8b7258",
                                          }}
                                          value={item.text || ""}
                                          onChange={(e) =>
                                              handleTextChange(item.id, e.target.value)
                                          }
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">
                                        Шрифт:
                                      </label>
                                      <Select
                                          options={fontOptions}
                                          styles={customSelectStyles}
                                          value={fontOptions.find(
                                              (opt) => opt.value === item.font
                                          )}
                                          onChange={(selectedOption) =>
                                              handleFontChange(item.id, selectedOption)
                                          }
                                          placeholder="Виберіть шрифт..."
                                          isSearchable={false}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">
                                        Сторона:
                                      </label>
                                      <Select
                                          options={sideOptions}
                                          styles={customSelectStyles}
                                          value={sideOptions.find(
                                              (opt) => opt.value === item.selectedSide
                                          )}
                                          onChange={(selectedOption) =>
                                              handleSideChange(item.id, selectedOption)
                                          }
                                          placeholder="Виберіть сторону..."
                                          isSearchable={false}
                                      />
                                    </div>
                                  </div>
                              ) : (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">
                                        Завантажити файл:
                                      </label>

                                      {(() => {
                                        const currentEngraving =
                                            customState.engravings[item.id];
                                        const pictureUrl =
                                            currentEngraving?.picture?.fileUrl;

                                        const isFromLibrary =
                                            pictureUrl &&
                                            !pictureUrl.startsWith("blob:") &&
                                            !pictureUrl.startsWith("data:image/png;base64");

                                        if (isFromLibrary) {
                                          const fileName =
                                              pictureUrl.split("/").pop() ||
                                              "невідомий файл";

                                          return (
                                              <div className="flex items-center justify-between p-2 rounded-md bg-f0e5d6 border border-b8845f">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                  <Paperclip
                                                      size={16}
                                                      className="text-8b7258 flex-shrink-0"
                                                  />
                                                  <span
                                                      className="text-sm text-2d3748 font-medium truncate"
                                                      title={fileName}
                                                  >
                                          {fileName}
                                        </span>
                                                </div>
                                                <label
                                                    htmlFor={`file-input-${item.id}`}
                                                    className="ml-4 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer bg-8b7258 text-white hover:bg-a08a73"
                                                >
                                                  Замінити
                                                </label>
                                                <input
                                                    id={`file-input-${item.id}`}
                                                    type="file"
                                                    accept="image/*, .svg"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            item.id,
                                                            e.target.files
                                                                ? e.target.files[0]
                                                                : null
                                                        )
                                                    }
                                                />
                                              </div>
                                          );
                                        } else {
                                          return (
                                              <div>
                                                <input
                                                    type="file"
                                                    id={`file-input-${item.id}`}
                                                    accept="image/*, .svg"
                                                    className="w-full text-sm rounded-md file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold hover:file:cursor-pointer"
                                                    style={{
                                                      color: "#f8f4f0",
                                                      /* @ts-ignore */
                                                      "--file-button-bg": "rgb(143, 88, 48)",
                                                      "--file-button-text": "#f8f4f0",
                                                      "--file-button-hover-bg":
                                                          "rgb(146, 116, 84)",
                                                    }}
                                                    onChange={(e) =>
                                                        handleFileChange(
                                                            item.id,
                                                            e.target.files
                                                                ? e.target.files[0]
                                                                : null
                                                        )
                                                    }
                                                />
                                              </div>
                                          );
                                        }
                                      })()}
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">
                                        Сторона:
                                      </label>
                                      <Select
                                          options={sideOptions}
                                          styles={customSelectStyles}
                                          value={sideOptions.find(
                                              (opt) => opt.value === item.selectedSide
                                          )}
                                          onChange={(selectedOption) =>
                                              handleSideChange(item.id, selectedOption)
                                          }
                                          placeholder="Виберіть сторону..."
                                          isSearchable={false}
                                      />
                                    </div>
                                  </div>
                              )}
                            </div>

                            <button
                                className="mt-4 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group w-full"
                                style={{
                                  background:
                                      "linear-gradient(135deg, #f8f4f0 0%, #f0e5d6 100%)",
                                  border: "1px solid #b8845f",
                                  color: "#2d3748",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                      "linear-gradient(135deg, #b8845f 0%, #8b7258 100%)";
                                  e.currentTarget.style.color = "#f8f4f0";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                      "linear-gradient(135deg, #f8f4f0 0%, #f0e5d6 100%)";
                                  e.currentTarget.style.color = "#2d3748";
                                }}
                                onClick={() => handleTogglePositioning(item.id)}
                            >
                              <Settings2
                                  size={16}
                                  className="transition-transform group-hover:rotate-12"
                              />
                              Закріпити панель розташування
                            </button>

                            {!isMobileContext && item.isPositioningOpen && (
                                <DraggablePopup
                                    title={`Позиціонування #${item.id + 1}`}
                                    onClose={() => handleOpenDraggablePopup(item.id)}
                                >
                                  <PositioningControls id={item.id} />
                                </DraggablePopup>
                            )}

                            {showPositioningControlsInCard && !isMobileContext && (
                                <PositioningControls id={item.id} />
                            )}
                          </>
                      )}
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};

export default EngravingComponent;
