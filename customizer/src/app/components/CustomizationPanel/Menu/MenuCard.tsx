import React from "react";
import { Tooltip, Card } from "@nextui-org/react";

interface MenuCardProps {
  icon: string;
  tooltipText: string;
  onClick: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, tooltipText, onClick }) => {
  return (
    <div>
      <Tooltip content={tooltipText} placement="bottom" className="text-black">
        <Card
          isPressable
          isHoverable
          shadow="none"
          onPress={onClick}
          style={{
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0e5d6",
            borderRadius: "8px",
          }}
        >
          <img
            src={icon}
            alt="menu icon"
            style={{ width: "32px", height: "32px" }}
          />
        </Card>
      </Tooltip>
    </div>
  );
};

export default MenuCard;
