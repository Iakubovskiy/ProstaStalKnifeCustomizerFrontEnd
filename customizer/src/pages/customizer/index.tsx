"use client";

import React, {useState} from "react";
import { useSearchParams } from "next/navigation";
import CustomizationPanel from "@/app/components/CustomizationPanel/CustomizationPanel";
import styles from "./customizer.module.css";
import "../../styles/globals.css";
import { KnifePurchaseContainer } from "@/app/components/CustomizationPanel/Components/KnifePurchase/KnifePurchaseContainer";
import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";
import {useTranslation} from "react-i18next";
import { Share } from "lucide-react";
import APIService from "@/app/services/ApiService";
import KnifeService from "@/app/services/KnifeService";
import FileService from "@/app/services/FileService";
import { toast } from 'react-hot-toast';
import {EngravingDTO} from "@/app/DTOs/EngravingDTO";
import { AppFile } from "@/app/Interfaces/File";
import {useCanvasState} from "@/app/state/canvasState";
import {useSnapshot} from "valtio";
import {KnifeDTO} from "@/app/DTOs/KnifeDTO";
import {CloseIcon} from "@nextui-org/shared-icons";

const CustomizerPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams?.get("id");
  const { t } = useTranslation();
  const state = useCanvasState();
  const snap = useSnapshot(state);

  const [isSharing, setIsSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  const shareDesign = async () => {
    setIsSharing(true);

    try {
      const apiService = new APIService();
      const knifeService = new KnifeService(apiService);
      const fileService = new FileService(apiService);

      const processedEngravings: EngravingDTO[] = [];
      for (const engraving of snap.engravings) {
        let pictureId: string | null = engraving.picture?.id || null;
        const pictureForLaserId: string | null = engraving.pictureForLaser?.id || null;

        if (engraving.fileObject) {
          const uploadedFile: AppFile = await fileService.upload(engraving.fileObject);
          pictureId = uploadedFile.id;
        }
        let names: { [key: string]: string } | null = null;
        if(engraving.name) {
          names = {
            'ua': engraving.name,
            'en': engraving.name,
          };
        }
        console.log('names =', names);

        processedEngravings.push({
          pictureId: pictureId,
          pictureForLaserId: pictureForLaserId,
          side: engraving.side,
          text: engraving.text,
          font: engraving.font,
          locationX: engraving.locationX,
          locationY: engraving.locationY,
          locationZ: engraving.locationZ,
          rotationX: engraving.rotationX,
          rotationY: engraving.rotationY,
          rotationZ: engraving.rotationZ,
          scaleX: engraving.scaleX,
          scaleY: engraving.scaleY,
          scaleZ: engraving.scaleZ,
          isActive: false,
          names: names,
        });
      }

      const processedAttachments: string[] = snap.attachment ? [snap.attachment.id] : [];

      const knifeToCreate: KnifeDTO = {
        isActive: false,
        names: {
          ua: "просто макет",
          en: "just template",
        },
        shapeId: snap.bladeShape.id,
        bladeCoatingColorId: snap.bladeCoatingColor.id,
        handleId: snap.handleColor?.id ?? null,
        sheathId: snap.bladeShape.sheathId,
        sheathColorId: snap.sheathColor?.id ?? null,
        newEngravings: processedEngravings,
        existingAttachmentIds: processedAttachments,
        titles: {
          ua: "макет ножа",
          en: "knife template",
        },
        descriptions: {},
        metaTitles: {},
        metaDescriptions: {},
        tagsIds: [],
        existingEngravingIds: [],
        imageFileId: ""
      };

      const createdKnife = await knifeService.create(knifeToCreate);
      const newKnifeId = createdKnife.id;

      const shareUrl = `${window.location.origin}/view/${newKnifeId}`;

      setSharedUrl(shareUrl);
      setShowSuccessPopup(true);

    } catch (error) {
      console.error("Failed to share design:", error);
    }finally {
      setIsSharing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    toast.success(t("shareDesign.copiedToast"), { duration: 2000 });
  }

  return (
    <>
      {isSharing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg text-black">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <div className="text-xl font-bold">
                {t("shareDesign.savingToast")}
              </div>
            </div>
          </div>
      )}

      {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white px-8 py-6 shadow-lg rounded-lg w-full max-w-lg">
              {/* Кнопка закриття */}
              <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
              >
                <CloseIcon className="w-6 h-6 text-gray-600" />
              </button>

              <h3 className="text-lg font-medium text-gray-900">{t("shareDesign.successTitle")}</h3>
              <div className="mt-4 flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                <p className="flex-1 text-sm text-gray-700 truncate">{sharedUrl}</p>
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                    title={t("shareDesign.copyTooltip")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
      )}
      <div className={styles.customizer}>
        <div className={styles.canvasContainer}>
          <div className="absolute left-4 z-10">
            <button
                onClick={shareDesign}
                className="
                  inline-flex items-center gap-2
                  mt-4
                  px-2 py-2
                  bg-green-500 text-white
                  text-sm font-medium
                  rounded-lg
                  hover:bg-green-600
                  transition-colors
              "
            >
              <Share className="w-5 h-5" />
              {t("customizationPanel.shareButton")}
            </button>
          </div>
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
