import React from "react";
import { Tooltip, Card } from "@nextui-org/react";

interface ArrowCardProps {
  icon: string;
  tooltipText: string;
  onClick: () => void;
  disabled?: boolean;
  isSmall?: boolean;
}

const ArrowCard: React.FC<ArrowCardProps> = ({
  icon,
  tooltipText,
  onClick,
  disabled = false,
  isSmall = false,
}) => {
  const cardSize = isSmall ? "36px" : "48px";
  const iconSize = isSmall ? "16px" : "20px";

  return (
    <div>
      <Tooltip
        content={disabled ? "" : tooltipText}
        placement="bottom"
        className="text-black"
      >
        <Card
          isPressable={!disabled}
          isHoverable={!disabled}
          shadow="sm"
          onPress={disabled ? undefined : onClick}
          className="transition-all duration-200 hover:scale-105"
          style={{
            width: cardSize,
            height: cardSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: disabled
              ? "linear-gradient(135deg, #e5e5e5 0%, #d0d0d0 100%)"
              : "linear-gradient(135deg, #f0e5d6 0%, #e8dcc6 100%)",
            borderRadius: isSmall ? "6px" : "8px",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <img
            src={icon}
            alt="navigation arrow"
            style={{
              width: iconSize,
              height: iconSize,
              opacity: disabled ? 0.5 : 1,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
            }}
          />
        </Card>
      </Tooltip>
    </div>
  );
};

export default ArrowCard;
