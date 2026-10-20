// // src/components/ImageUpload.jsx
// import { useState, useRef } from "react"
// import { UploadCloud, X, Loader2 } from "lucide-react";
// import api from "../services/api";

// // const ImageUpload = ({ onDetectionResult }) => {
// //   const [preview, setPreview] = useState(null);
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const fileInputRef = useRef(null);

// //   const handleFileSelect = (selectedFile) => {
// //     if (!selectedFile) return;
// //     if (!selectedFile.type.startsWith("image/")) {
// //       setError("Please upload an image file.");
// //       return;
// //     }
// //     setError("");
// //     setFile(selectedFile);
// //     setPreview(URL.createObjectURL(selectedFile));
// //   };

// //   const handleDrop = (e) => {
// //     e.preventDefault();
// //     handleFileSelect(e.dataTransfer.files[0]);
// //   };

// //   const clearImage = () => {
// //     setFile(null);
// //     setPreview(null);
// //     if (fileInputRef.current) fileInputRef.current.value = "";
// //   };

// //   const handleSubmit = async () => {
// //     if (!file) return;
// //     setLoading(true);
// //     setError("");

// //     const formData = new FormData();
// //     formData.append("image", file);

//   //   try {
//   //     // backend forwards this to the Python ML service (mlService.js)
//   //     const res = await api.post("/query/image-detect", formData, {
//   //       headers: { "Content-Type": "multipart/form-data" },
//   //     });
//   //     onDetectionResult?.(res.data);
//   //     clearImage();
//   //   } catch (err) {
//   //     setError(
//   //       err.response?.data?.message || "Detection failed. Try another image."
//   //     );
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // import { useState } from "react";
// // ...your other imports stay as they are

// const ML_URL = import.meta.env.VITE_ML_URL || "http://127.0.0.1:5001";   // PASTE HERE: after imports, OUTSIDE the component

// export default function ImageUpload() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");

//   const handleDetect = async () => {          // PASTE HERE: inside the component, where the old function was
//     if (!file) return;
//     const fd = new FormData();
//     fd.append("image", file);
//     fd.append("lang", "hi");

//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${ML_URL}/predict`, { method: "POST", body: fd });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Detection failed");
//       console.log("Flask reply:", data);
//       setResult(data);
//     } catch (e) {
//       setError(
//         e.message === "Failed to fetch"
//           ? "Model service is not running. Start Flask on port 5001."
//           : e.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ...your existing return (...) with the upload box and button
// }

//   return (
//     <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
//       <label className="font-medium text-gray-700">
//         Upload a crop/leaf photo for disease detection
//       </label>

//       {!preview ? (
//         <div
//           onDragOver={(e) => e.preventDefault()}
//           onDrop={handleDrop}
//           onClick={() => fileInputRef.current.click()}
//           className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-green-500 transition-colors"
//         >
//           <UploadCloud size={28} className="text-gray-400" />
//           <p className="text-sm text-gray-500">
//             Drag & drop or click to select an image
//           </p>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             className="hidden"
//             onChange={(e) => handleFileSelect(e.target.files[0])}
//           />
//         </div>
//       ) : (
//         <div className="relative w-fit">
//           <img
//             src={preview}
//             alt="Selected crop"
//             className="max-h-48 rounded-md object-cover"
//           />
//           <button
//             onClick={clearImage}
//             className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1"
//           >
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {error && <p className="text-sm text-red-600">{error}</p>}

//       <button
//         onClick={handleSubmit}
//         disabled={!file || loading}
//         className="self-end flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:opacity-50"
//       >
//         {loading ? (
//           <>
//             <Loader2 size={16} className="animate-spin" /> Analyzing...
//           </>
//         ) : (
//           "Detect Disease"
//         )}
//       </button>
//        {error && <p style={{ color: "red" }}>{error}</p>}
//     {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
//     </div>
//   );

// src/components/ImageUpload.jsx
import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

const ML_URL = import.meta.env.VITE_ML_URL || "http://127.0.0.1:5001";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [lang, setLang] = useState("hi");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // free the preview from memory when the photo changes or the page closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    if (selectedFile.size > 8 * 1024 * 1024) {
      setError("Image is too large. Please use a photo under 8 MB.");
      return;
    }
    setError("");
    setResult(null);
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
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDetect = async () => {
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);
    fd.append("lang", lang);

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${ML_URL}/predict`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Detection failed");
      console.log("Flask reply:", data);
      setResult(data);
    } catch (e) {
      setError(
        e.message === "Failed to fetch"
          ? "Model service is not running. Start Flask on port 5001."
          : e.message
      );
    } finally {
      setLoading(false);
    }
  };

  // shows any value from Flask's reply in a readable way
  const renderValue = (v) => {
    if (v === null || v === undefined) return "-";
    if (Array.isArray(v)) {
      return (
        <ul className="list-disc ml-5 space-y-1">
          {v.map((item, i) => (
            <li key={i}>
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    }
    if (typeof v === "object") {
      return (
        <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto">
          {JSON.stringify(v, null, 2)}
        </pre>
      );
    }
    return String(v);
  };

  const prettyKey = (k) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="font-medium text-gray-700">
            Upload a crop/leaf photo for disease detection
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="hi">हिन्दी</option>
            <option value="en">English</option>
          </select>
        </div>

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

        {/* file input stays outside the box so it exists even after a photo is chosen */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleDetect}
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

      {/* Answer from the Flask model */}
      {result && (
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-semibold text-green-800 mb-3">
            Detection Result
          </h4>
          <dl className="space-y-3 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs uppercase tracking-wide text-gray-500">
                  {prettyKey(key)}
                </dt>
                <dd className="text-gray-800 mt-0.5">{renderValue(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
