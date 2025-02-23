import React, { useEffect, useState } from "react";

interface FileDragAndDropProps {
  onFileSelected: (file: File | null) => void;
  validExtensions: string[];
  fileUrl?: string;
  id?: string;
}

const DragNDrop: React.FC<FileDragAndDropProps> = ({
  onFileSelected,
  validExtensions,
  fileUrl,
  id
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  useEffect(() => {
    const loadFileFromUrl = async () => {
      if (fileUrl) {
        try {
          const response = await fetch(fileUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }

          const blob = await response.blob();
          const fileName = fileUrl.split("/").pop() || "downloaded_file.glb";
          const fetchedFile = new File([blob], fileName, { type: blob.type });
          setFile(fetchedFile);
          onFileSelected(fetchedFile);
        } catch (error) {
          console.error("Error loading file from URL:", error);
          setErrorMessage("Failed to load file from URL.");
        }
      }
    };

    loadFileFromUrl();
  }, [fileUrl]);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const selectedFile = e.dataTransfer.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const fileExtension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      setFile(selectedFile);
      setErrorMessage(null);
      onFileSelected(selectedFile);
    } else {
      setFile(null);
      setErrorMessage(
        `Допустимі формати файлів: ${validExtensions.join(", ")}`
      );
      onFileSelected(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setErrorMessage(null);
    onFileSelected(null);
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full h-40 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${
          errorMessage
            ? "border-red-500 bg-red-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        {!file ? (
          <div className="text-center">
            <p className="text-gray-500">Перемістіть або оберіть файл</p>
            <input
              type="file"
              accept={validExtensions.map((ext) => `*${ext}`).join(",")}
              onChange={handleFileInputChange}
              className="hidden"
              id={`file-upload-${id}`}
            />
            <label
              htmlFor={`file-upload-${id}`}
              className="text-blue-500 underline cursor-pointer mt-2"
            >
              Обрати файл
            </label>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700">Обрано файл: {file.name}</p>
            <button
              onClick={clearFile}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Видалити файл
            </button>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-red-500 text-center mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default DragNDrop;
