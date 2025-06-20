// /components/FileUpload.tsx

import React, { useRef, useState } from "react";
import { Button, Spinner, Image } from "@nextui-org/react";
import { Upload, X, File as FileIcon } from "lucide-react";
import FileService from "@/app/services/FileService";
import {AppFile} from "@/app/Interfaces/File";

interface FileUploadProps {
  label: string;
  currentFile: AppFile | null | undefined;
  onFileChange: (file: AppFile | null) => void;
  isRequired?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  currentFile,
  onFileChange,
  isRequired,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileService = new FileService();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newFile = await fileService.upload(file);
      onFileChange(newFile);
    } catch (error) {
      console.error("File upload error:", error);
      alert("Не вдалося завантажити файл.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const triggerFileSelect = () => inputRef.current?.click();
  const handleRemoveFile = () => onFileChange(null);

  return (
    <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
      <label className="font-semibold text-lg">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-4 p-2 border-dashed border-2 rounded-md min-h-[100px]">
        {isUploading ? (
          <Spinner label="Завантаження..." />
        ) : currentFile ? (
          <div className="flex items-center gap-4">
            <Image
              src={currentFile.fileUrl}
              alt="Preview"
              width={80}
              height={80}
              className="object-cover rounded-md"
              fallbackSrc="https://via.placeholder.com/80"
            />
            <div className="flex-grow">
              <p className="font-mono text-xs break-all">{currentFile.id}</p>
            </div>
            <Button
              isIconOnly
              color="danger"
              variant="light"
              onPress={handleRemoveFile}
            >
              <X size={20} />
            </Button>
          </div>
        ) : (
          <div className="text-gray-500 flex items-center gap-2">
            <FileIcon size={24} />
            <p>Файл не вибрано</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.glb,.obj,.fbx"
      />
      <Button onPress={triggerFileSelect} startContent={<Upload size={18} />}>
        {currentFile ? "Замінити файл" : "Вибрати файл"}
      </Button>
    </div>
  );
};

export default FileUpload;
