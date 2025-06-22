"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import CustomCanvas from "@/app/components/CustomCanvas/CustomCanvas";
import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel";
import styles from "./customizer.module.css";
import "../../styles/globals.css";
import CustomNavbar from "@/app/components/CustomNavbar/CustomNavbar";
import NavigationMob from "@/app/components/Nav/MobileNavBar";
import Footer from "@/app/components/Footer/Footer";
import { KnifePurchaseContainer } from "@/app/components/CustomizationPanel/Components/KnifePurchase/KnifePurchaseContainer";
import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";

const CustomizerPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("id");

  return (
    <>
      <div className={styles.customizer}>
        <div className={styles.canvasContainer}>
          <KnifeConfigurator />
        </div>
        <div className={styles.controlsContainer}>
          <CustomizationPanel />
          {productId ? (
            <KnifePurchaseContainer productId={productId} />
          ) : (
            <KnifePurchaseContainer />
          )}
        </div>
      </div>
    </>
  );
};

export default CustomizerPage;
