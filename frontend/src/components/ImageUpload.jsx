// src/components/ImageUpload.jsx
import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import api from "../services/api";

const ImageUpload = ({ onDetectionResult }) => {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setError("");
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      // backend forwards this to the Python ML service (mlService.js)
      const res = await api.post("/query/image-detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onDetectionResult?.(res.data);
      clearImage();
    } catch (err) {
      setError(
        err.response?.data?.message || "Detection failed. Try another image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      <label className="font-medium text-gray-700">
        Upload a crop/leaf photo for disease detection
      </label>

      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-green-500 transition-colors"
        >
          <UploadCloud size={28} className="text-gray-400" />
          <p className="text-sm text-gray-500">
            Drag & drop or click to select an image
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="relative w-fit">
          <img
            src={preview}
            alt="Selected crop"
            className="max-h-48 rounded-md object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="self-end flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Analyzing...
          </>
        ) : (
          "Detect Disease"
        )}
      </button>
    </div>
  );
};

export default ImageUpload;