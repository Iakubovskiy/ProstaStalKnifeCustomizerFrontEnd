import React from "react";
import styles from "./Characteristics.module.css";
import BladeShape from "../../Models/BladeShape";
import Fastening from "../../Models/Fastening";
import HandleColor from "../../Models/HandleColor";
import SheathColor from "../../Models/SheathColor";
import BladeCoatingColor from "@/app/Models/BladeCoatingColor";

interface CharacteristicsProps<T> {
  data: T;
  isReadOnly1: boolean;
  currentBladeCoatingColor: string;
  type:
    | "BladeShape"
    | "SheathColor"
    | "HandleColor"
    | "Fastening"
    | "BladeCoatingColor";
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

// Custom Card Component
const CustomCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={styles.card}>{children}</div>
);

function Characteristics<
  T extends
    | SheathColor
    | HandleColor
    | Fastening
    | BladeShape
    | BladeCoatingColor
>({ data, isReadOnly1, type, onChange }: CharacteristicsProps<T>) {
  const renderFields = () => {
    switch (type) {
      case "SheathColor":
        return (
          <>
            <CustomInput
              label="Назва кольору"
              value={(data as SheathColor).color}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
            <CustomInput
              label="Матеріал"
              value={(data as SheathColor).material}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
            />
          </>
        );

      case "HandleColor":
        return (
          <>
            <CustomInput
              label="Назва кольору"
              value={(data as HandleColor).colorName}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, colorName: e.target.value })}
            />
            <CustomInput
              label="Матеріал"
              value={(data as HandleColor).material}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
            />
          </>
        );

      case "Fastening":
        return (
          <>
            <CustomInput
              label="Назва"
              value={(data as Fastening).name}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
            <CustomInput
              label="Матеріал"
              value={(data as Fastening).material}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
            />
            <CustomInput
              label="Назва кольору"
              value={(data as Fastening).color}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
          </>
        );

      case "BladeShape":
        return (
          <>
            <CustomInput
              label="Назва"
              value={(data as BladeShape).name}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
            <CustomInput
              label="Довжина загалом"
              type="number"
              value={(data as BladeShape).totalLength.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, totalLength: e.target.value })
              }
            />
            <CustomInput
              label="Довжина клинка"
              type="number"
              value={(data as BladeShape).bladeLength.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, bladeLength: e.target.value })
              }
            />
            <CustomInput
              label="Ширина клинка"
              type="number"
              value={(data as BladeShape).bladeWidth.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, bladeWidth: e.target.value })
              }
            />
            <CustomInput
              label="Вага клинка"
              type="number"
              value={(data as BladeShape).bladeWeight.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, bladeWeight: e.target.value })
              }
            />
            <CustomInput
              label="Кут заточки"
              type="number"
              value={(data as BladeShape).sharpeningAngle.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, sharpeningAngle: e.target.value })
              }
            />
            <CustomInput
              label="Твердість"
              type="number"
              value={(data as BladeShape).rockwellHardnessUnits.toString()}
              isReadOnly={isReadOnly1}
              onChange={(e) =>
                onChange({ ...data, rockwellHardnessUnits: e.target.value })
              }
            />
          </>
        );

      case "BladeCoatingColor":
        return (
          <>
            <CustomInput
              label="Тип"
              value={(data as BladeCoatingColor).type}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, type: e.target.value })}
            />
            <CustomInput
              label="Колір"
              value={(data as BladeCoatingColor).color}
              isReadOnly={isReadOnly1}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
            <CustomInput
              label="Ціна"
              type="number"
              value={(data as BladeCoatingColor).price.toString()}
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
