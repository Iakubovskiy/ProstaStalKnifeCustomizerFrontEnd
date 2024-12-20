import React from "react";
import { Input, Card } from "@nextui-org/react";
import styles from "./Characteristics.module.css";
import BladeShape from "../../Models/BladeShape";
import Fastening from "../../Models/Fastening";
import HandleColor from "../../Models/HandleColor";
import SheathColor from "../../Models/SheathColor";
import BladeCoating from "../../Models/BladeCoating";

interface CharacteristicsProps<T> {
  data: T;
  isReadOnly1: boolean;
  currentBladeCoatingColor: string;
  type:
    | "BladeShape"
    | "SheathColor"
    | "HandleColor"
    | "Fastening"
    | "BladeCoating";
  onChange: (updatedData: T) => void;
}

function Characteristics<
  T extends SheathColor | HandleColor | Fastening | BladeShape | BladeCoating
>({
  data,
  isReadOnly1,
  currentBladeCoatingColor,
  type,
  onChange,
}: CharacteristicsProps<T>) {
  const renderFields = () => {
    console.log(data.constructor.name);
    switch (type) {
      case "SheathColor":
        return (
          <>
            <Input
              label="Назва кольору"
              defaultValue={(data as SheathColor).color}
              isReadOnly
              className={styles.input}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
            />
            <Input
              label="Матеріал"
              defaultValue={(data as SheathColor).material}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
              className={styles.input}
            />
          </>
        );

      case "HandleColor":
        return (
          <>
            <Input
              label="Назва кольору"
              defaultValue={(data as HandleColor).colorName}
              className={styles.input}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) => onChange({ ...data, colorName: e.target.value })}
            />
            <Input
              label="Матеріал"
              defaultValue={(data as HandleColor).material}
              className={styles.input}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
            />
          </>
        );

      case "Fastening":
        return (
          <>
            <Input
              label="Назва"
              defaultValue={(data as Fastening).name}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
            />
            <Input
              label="Матеріал"
              defaultValue={(data as Fastening).material}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
              className={styles.input}
            />
            <Input
              label="Назва кольору"
              defaultValue={(data as Fastening).color}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
            />
          </>
        );

      case "BladeShape":
        return (
          <>
            <Input
              label="Назва"
              defaultValue={(data as BladeShape).name}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className={styles.input}
            />
            <Input
              label="Довжина загалом"
              type="number"
              defaultValue={(data as BladeShape).totalLength.toString()}
              onChange={(e) =>
                onChange({ ...data, totalLength: e.target.value })
              }
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
            />
            <Input
              label="Довжина клинка"
              type="number"
              defaultValue={(data as BladeShape).bladeLength.toString()}
              onChange={(e) =>
                onChange({ ...data, bladeLength: e.target.value })
              }
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
            />
            <Input
              label="Ширина клинка"
              type="number"
              defaultValue={(data as BladeShape).bladeWidth.toString()}
              onChange={(e) =>
                onChange({ ...data, bladeWidth: e.target.value })
              }
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
            />
            <Input
              label="Вага клинка"
              type="number"
              defaultValue={(data as BladeShape).bladeWeight.toString()}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) =>
                onChange({ ...data, bladeWeight: e.target.value })
              }
              className={styles.input}
            />
            <Input
              label="Кут заточки"
              type="number"
              defaultValue={(data as BladeShape).sharpeningAngle.toString()}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) =>
                onChange({ ...data, sharpeningAngle: e.target.value })
              }
              className={styles.input}
            />
            <Input
              label="Твердість"
              type="number"
              defaultValue={(
                data as BladeShape
              ).rockwellHardnessUnits.toString()}
              onChange={(e) =>
                onChange({ ...data, rockwellHardnessUnits: e.target.value })
              }
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
            />
          </>
        );

      case "BladeCoating":
        return (
          <>
            <Input
              label="Тип"
              defaultValue={(data as BladeCoating).type}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              onChange={(e) => onChange({ ...data, type: e.target.value })}
              className={styles.input}
            />
            <Input
              label="Обраний колір"
              defaultValue={currentBladeCoatingColor}
              {...(isReadOnly1 ? { isReadOnly: true } : {})}
              className={styles.input}
            />
          </>
        );

      default:
        return <p className={styles.unknown}>Unknown data type</p>;
    }
  };

  return (
    <Card
      style={{ padding: "1rem", width: "100%", border: "1px solid #000" }}
      className={styles.card}
    >
      {renderFields()}
    </Card>
  );
}

export default Characteristics;
