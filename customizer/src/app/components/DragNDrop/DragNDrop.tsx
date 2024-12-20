import React, { useState } from "react";

interface FileDragAndDropProps {
  onFileSelected: (file: File | null) => void;
}

const DragNDrop: React.FC<FileDragAndDropProps> = ({ onFileSelected }) => {
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setFile(selectedFile);
      setErrorMessage(null);
      onFileSelected(selectedFile);
    } else {
      setFile(null);
      setErrorMessage("Only JPEG and PNG files are allowed.");
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
            <p className="text-gray-500">Перемістіть</p>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="text-blue-500 underline cursor-pointer mt-2"
            >
              Choose file
            </label>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-700">Selected File: {file.name}</p>
            <button
              onClick={clearFile}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove File
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
