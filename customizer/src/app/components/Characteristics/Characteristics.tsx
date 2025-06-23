import React from "react";
import styles from "./Characteristics.module.css";
import {BladeCoatingColorForCanvas} from "@/app/Interfaces/Knife/BladeCoatingColorForCanvas";
import {BladeShapeForCanvas} from "@/app/Interfaces/Knife/BladeShapeForCanvas";
import {HandleColorForCanvas} from "@/app/Interfaces/Knife/HandleColorForCanvas";
import { SheathColorForCanvas } from "@/app/Interfaces/Knife/SheathColorForCanvas";
import {AttachmentForCanvas} from "@/app/Interfaces/Knife/AttachmentForCanvas";

interface CharacteristicsProps<T> {
  data: T;
  isReadOnly1: boolean;
  currentBladeCoatingColor: string;
  type:
    | "BladeShapeForCanvas"
    | "SheathColorForCanvas"
    | "HandleForCanvas"
    | "AttachmentForCanvas"
    | "BladeCoatingColorForCanvas";
  onChange: (updatedData: T) => void;
}

// Custom Input Component
interface CustomInputProps {
  label: string;
  value: string;
  type?: string;
  isReadOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  type = "text",
  isReadOnly = false,
  onChange,
}) => (
  <div className={styles.input}>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={isReadOnly}
      className={styles.inputField}
    />
  </div>
);

const CustomCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

function Characteristics<
  T extends
    | SheathColorForCanvas
    | HandleColorForCanvas
    | AttachmentForCanvas | null
    | BladeShapeForCanvas
    | BladeCoatingColorForCanvas
>({ data, isReadOnly1, type, onChange }: CharacteristicsProps<T>) {
  const renderFields = () => {
    switch (type) {
      case "SheathColorForCanvas":
        return (
          <>
            <CustomInput
              label="Назва кольору"
              value={(data as SheathColorForCanvas).color}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
          </>
        );

      case "HandleForCanvas":
        return (
          <>
            <CustomInput
              label="Назва кольору"
              value={(data as HandleColorForCanvas).color}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
            <CustomInput
              label="Матеріал"
              value={(data as HandleColorForCanvas).material}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
            />
          </>
        );

      case "AttachmentForCanvas":
        return (
          <>
            <CustomInput
              label="Назва"
              value={(data as AttachmentForCanvas)?.name || ""}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
            <CustomInput
              label="Матеріал"
              value={(data as AttachmentForCanvas)?.material || ""}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
            />
            <CustomInput
              label="Назва кольору"
              value={(data as AttachmentForCanvas)?.color || ''}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
          </>
        );

      case "BladeShapeForCanvas":
        return (
          <>
            <CustomInput
              label="Назва"
              value={(data as BladeShapeForCanvas).name}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
            <CustomInput
              label="Довжина загалом"
              type="number"
              value={(data as BladeShapeForCanvas).bladeCharacteristicsModel.totalLength.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, totalLength: e.target.value })
              }
            />
            <CustomInput
              label="Довжина клинка"
              type="number"
              value={(data as BladeShapeForCanvas).bladeCharacteristicsModel.bladeLength.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, bladeLength: e.target.value })
              }
            />
            <CustomInput
              label="Ширина клинка"
              type="number"
              value={(data as BladeShapeForCanvas).bladeCharacteristicsModel.bladeWidth.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, bladeWidth: e.target.value })
              }
            />
            <CustomInput
              label="Вага клинка"
              type="number"
              value={(data as BladeShapeForCanvas).bladeCharacteristicsModel.bladeWeight.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, bladeWeight: e.target.value })
              }
            />
            <CustomInput
              label="Кут заточки"
              type="number"
              value={(data as BladeShapeForCanvas).bladeCharacteristicsModel.sharpeningAngle.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, sharpeningAngle: e.target.value })
              }
            />
            <CustomInput
              label="Твердість"
              type="number"
              value={(data as BladeShapeForCanvas).bladeCharacteristicsModel.rockwellHardnessUnits.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, rockwellHardnessUnits: e.target.value })
              }
            />
          </>
        );

      case "BladeCoatingColorForCanvas":
          console.log(data as BladeCoatingColorForCanvas);
        return (
          <>
            <CustomInput
              label="Тип"
              value={(data as BladeCoatingColorForCanvas).type}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, type: e.target.value })}
            />
            <CustomInput
              label="Колір"
              value={(data as BladeCoatingColorForCanvas).color}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
            <CustomInput
              label="Ціна"
              type="number"
              value={(data as BladeCoatingColorForCanvas).price.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, price: e.target.value })}
            />
          </>
        );

      default:
        return <p className={styles.unknown}>Unknown data type</p>;
    }
  };

  return <CustomCard>{renderFields()}</CustomCard>;
}

export default Characteristics;
