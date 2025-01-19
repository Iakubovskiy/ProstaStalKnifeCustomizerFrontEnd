import React from "react";
import { Tooltip, Card } from "@nextui-org/react";

interface CardComponentProps {
  backgroundPicture: string;
  tooltipText: string;
  onClick: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({
  backgroundPicture,
  tooltipText,
  onClick,
}) => {
  const isColor = (value: string) =>
    /^#([0-9A-F]{3}){1,2}$/i.test(value) || /^rgb|rgba/.test(value);
  return (
    <div>
      <Tooltip content={tooltipText} placement="bottom" className="text-black">
        <Card
          isPressable
          isHoverable
          onPress={onClick}
          style={{
            background: isColor(backgroundPicture)
              ? backgroundPicture
              : `url(${backgroundPicture}) center/cover no-repeat`,
            borderRadius: "8px",
          }}
          className={`
                        flex  justify-center
                        lg:w-[75px] lg:h-[75px]
                        md:w-[75px] md:h-[75px]  
                        sm:w-[75px] sm:h-[75px] 
                        xs:w-[75px] xs:h-[75px]
                        min-w-[75px] min-h-[75px]
                        
                    `}
        ></Card>
      </Tooltip>
    </div>
  );
};

export default CardComponent;
