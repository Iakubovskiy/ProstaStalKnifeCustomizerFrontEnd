import React from "react";
import CustomCanvas from "@/app/components/CustomCanvas/CustomCanvas";
import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel";
import { KnifePurchaseContainer } from "@/app/components/CustomizationPanel/Components/KnifePurchase/KnifePurchaseContainer";
import styles from "./customizer.module.css";
import "../../styles/globals.css";
const CustomizerPage = () => {
  return (
    <div className={styles.customizer}>
      <div className={styles.canvasContainer}>
        <CustomCanvas />
      </div>
      <div className={styles.controlsContainer}>
        <CustomizationPanel />
        <KnifePurchaseContainer productId={null}/>
      </div>
    </div>
  );
};

export default CustomizerPage;
