import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:5001";

export const predictDisease = async (file, lang = "hi") => {
  if (!file) throw new Error("No image file received");

  // works with both memoryStorage (buffer) and diskStorage (path)
  const imageData = file.buffer ?? fs.readFileSync(file.path);

  const form = new FormData();
  form.append("image", imageData, {
    filename: file.originalname,
    contentType: file.mimetype,
  });
  form.append("lang", lang);

  try {
    const { data } = await axios.post(`${ML_URL}/predict`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
      maxBodyLength: Infinity,
    });
    return data;
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      throw new Error("Model service is not running on " + ML_URL);
    }
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
  } finally {
    // delete the temporary photo saved by diskStorage
    if (file.path) fs.unlink(file.path, () => {});
  }
};