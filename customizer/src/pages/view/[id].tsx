import KnifeConfigurator from "@/app/components/CustomCanvas/CustomCanvas";
import {useRouter} from "next/router";
import React, {useMemo, useState} from "react";
import {Download} from "lucide-react";
import {useTranslation} from "react-i18next";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import {AppFile} from "@/app/Interfaces/File";
import KnifeService from "@/app/services/KnifeService";
import FileService from "@/app/services/FileService";

interface EngravingFile extends AppFile {
    uniqueName: string;
}

const ViewPage = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [downloading, setDownloading] = useState<boolean>();
    const knifeService = useMemo(() => new KnifeService(), []);
    const fileService = useMemo(() => new FileService(), []);
    let { id } = router.query;
    id = id as string;

    const handleDownloadAllEngravings = async () => {
        if (!id) return;
        const knife = await knifeService.getById(id);
        const engravingFiles: EngravingFile[] = [];
        const endsWithEngravingNumberSvg = (fileUrl:string):boolean => {
            const regex = /engraving-\d+\.svg$/;
            return regex.test(fileUrl);
        };

        for (const [index, engraving] of (knife.knifeForCanvas.engravings ?? []).entries()) {
            if (!engraving.picture) continue;

            if (endsWithEngravingNumberSvg(engraving.picture.fileUrl)) {
                const fileName: string = engraving.picture.fileUrl.split('/').pop() ?? "UnknownImage.svg";
                const svgFile = await fileService.urlToFile(engraving.picture.fileUrl, fileName, "image/svg+xml");

                engraving.picture = await fileService.convertSvgToDxf(svgFile);
            }

            const fileFormat = 'dxf';
            const fileName = `${knife.name.replace(/\s/g, '_')}_engraving_${index + 1}_name${engraving.name}.${fileFormat}`;
            engravingFiles.push({
                ...engraving.picture,
                uniqueName: fileName,
            });
        }

        if (engravingFiles.length === 0) return;
        setDownloading(true);

        const zip = new JSZip();
        const folder = zip.folder(`${id}_engravings`);

        try {
            const filePromises = engravingFiles.map(async (file) => {
                const response = await fetch(file.fileUrl);
                if (!response.ok) {
                    throw new Error(`Не вдалося завантажити файл: ${file.uniqueName}`);
                }
                const blob = await response.blob();
                folder?.file(file.uniqueName, blob);
            });

            await Promise.all(filePromises);

            zip.generateAsync({ type: 'blob' }).then(content => {
                saveAs(content, `${id}_engravings.zip`);
            });

        } catch (err) {
            console.error("Error creating zip file:", err);
            alert(err instanceof Error ? err.message : "Помилка при створенні архіву.");
        } finally {
            setDownloading(false);
        }
    };


    return (
        <div className="w-full" style={{ height: "80vh" }}>
            <div className="absolute left-4 z-10">
                <button
                    onClick={handleDownloadAllEngravings}
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
                    <Download className="w-5 h-5" />
                    {t("viewPage.getFiles")}
                </button>
            </div>
            <KnifeConfigurator productId={id} />
        </div>
    );
}

export default ViewPage;