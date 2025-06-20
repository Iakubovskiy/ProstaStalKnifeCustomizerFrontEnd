import React from "react";
import CustomCanvas from "@/app/components/CustomCanvas/CustomCanvas";
import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel";
// import { KnifePurchaseContainer } from "@/app/components/CustomizationPanel/Components/KnifePurchase/KnifePurchaseContainer";
import styles from "./customizer.module.css";
import "../../styles/globals.css";
import CustomNavbar from "@/app/components/CustomNavbar/CustomNavbar";
import NavigationMob from "@/app/components/Nav/MobileNavBar";
import Footer from "@/app/components/Footer/Footer";
const CustomizerPage = () => {
  return (
    <>
      <div className={styles.desk}>
        <CustomNavbar></CustomNavbar>
      </div>
      <div className={styles.mob}>
        <NavigationMob></NavigationMob>
      </div>
      <div className={styles.customizer}>
        <div className={styles.canvasContainer}>
          <CustomCanvas />
        </div>
        <div className={styles.controlsContainer}>
          <CustomizationPanel />
          {/* <KnifePurchaseContainer productId={null} /> */}
        </div>
      </div>
      <div className={styles.footer}>
        <Footer></Footer>
      </div>
    </>
  );
};

export default CustomizerPage;
