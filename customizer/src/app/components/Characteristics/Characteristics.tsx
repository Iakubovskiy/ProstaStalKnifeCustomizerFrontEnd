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
  isReadOnly: boolean;
  currentBladeCoatingColor: string;
}

function Characteristics<
  T extends SheathColor | HandleColor | Fastening | BladeShape | BladeCoating
>({ data, isReadOnly, currentBladeCoatingColor }: CharacteristicsProps<T>) {
  const renderFields = () => {
    switch (data.constructor.name) {
      case "SheathColor":
        return (
          <>
            <Input
              label="Назва кольору"
              value={(data as SheathColor).color}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Матеріал"
              value={(data as SheathColor).material}
              readOnly={isReadOnly}
              className={styles.input}
            />
          </>
        );

      case "HandleColor":
        return (
          <>
            <Input
              label="Назва кольору"
              value={(data as HandleColor).color}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Матеріал"
              value={(data as HandleColor).material}
              readOnly={isReadOnly}
              className={styles.input}
            />
          </>
        );

      case "Fastening":
        return (
          <>
            <Input
              label="Назва"
              value={(data as Fastening).name}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Матеріал"
              value={(data as Fastening).material}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Назва кольору"
              value={(data as Fastening).color}
              readOnly={isReadOnly}
              className={styles.input}
            />
          </>
        );

      case "BladeShape":
        return (
          <>
            <Input
              label="Назва"
              value={(data as BladeShape).name}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Довжина загалом"
              type="number"
              value={(data as BladeShape).totalLength.toString()}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Довжина клинка"
              type="number"
              value={(data as BladeShape).bladeLength.toString()}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Ширина клинка"
              type="number"
              value={(data as BladeShape).bladeWidth.toString()}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Вага клинка"
              type="number"
              value={(data as BladeShape).bladeWeight.toString()}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Кут заточки"
              type="number"
              value={(data as BladeShape).sharpeningAngle.toString()}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Твердість"
              type="number"
              value={(data as BladeShape).rockwellHardnessUnits.toString()}
              readOnly={isReadOnly}
              className={styles.input}
            />
          </>
        );

      case "BladeCoating":
        return (
          <>
            <Input
              label="Тип"
              value={(data as BladeCoating).type}
              readOnly={isReadOnly}
              className={styles.input}
            />
            <Input
              label="Обраний колір"
              value={currentBladeCoatingColor}
              readOnly={isReadOnly}
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
      style={{ padding: "1rem", width: "100%", border:"1px solid #000" }}
      className={styles.card}
    >
      {renderFields()}
    </Card>
  );
}

export default Characteristics;
