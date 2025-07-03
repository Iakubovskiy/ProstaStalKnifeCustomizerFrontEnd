import React from "react";
import { Tooltip, Card } from "@nextui-org/react";

interface MenuCardProps {
  icon: string;
  name: string;
  tooltipText: string;
  onClick: () => void;
  isCompact?: boolean;
}
const getTextSizeClass = (text: string, isCompact: boolean) => {
  if (text.length > 20) return isCompact ? "text-xs" : "text-sm";
  if (text.length > 10) return isCompact ? "text-xs" : "text-sm";
  return isCompact ? "text-xs" : "text-sm";
};
const MenuCard: React.FC<MenuCardProps> = ({
  icon,
  name,
  tooltipText,
  onClick,
  isCompact = false,
}) => {
  return (
    <div className="w-full">
      <Tooltip content={tooltipText} placement="bottom" className="text-black">
        <Card
          isPressable
          isHoverable
          shadow="sm"
          onPress={onClick}
          className="transition-all duration-200 hover:scale-105 hover:shadow-md w-full"
          style={{
            minHeight: isCompact ? "50px" : "60px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            background: "linear-gradient(135deg, #f0e5d6 0%, #e8dcc6 100%)",
            borderRadius: isCompact ? "8px" : "10px",
            padding: isCompact ? "8px" : "12px",
            gap: isCompact ? "6px" : "10px",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="flex-shrink-0"
            style={{
              width: isCompact ? "32px" : "36px",
              height: isCompact ? "32px" : "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.4)",
              borderRadius: isCompact ? "6px" : "8px",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src={icon}
              alt={`${name} icon`}
              style={{
                width: isCompact ? "20px" : "24px",
                height: isCompact ? "20px" : "24px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-gray-700 leading-tight ${getTextSizeClass(
                name,
                isCompact
              )}`}
              style={{
                margin: 0,
                textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {name}
            </h3>
          </div>
        </Card>
      </Tooltip>
    </div>
  );
};

export default MenuCard;
