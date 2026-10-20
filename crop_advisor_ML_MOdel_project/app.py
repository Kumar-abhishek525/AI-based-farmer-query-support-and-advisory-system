"""Crop leaf advisory API (MobileNet features + classifier, trained on lab + real-field photos).
Run:  pip install -r requirements.txt   then   python app.py   ->  http://127.0.0.1:5000
POST /predict  form-data: image=<file>, lang=hi|en (default hi)
"""
import joblib, cv2, numpy as np
from flask import Flask, request, jsonify, render_template
from embed_lib import embed_batch
from advice_en import ADVICE
from advice_hi import ADVICE_HI, LABEL_HI, NOTE_HI, OTHER_HI, UNSURE_HI

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024
bundle = joblib.load("crop_model_deep.joblib")
MODEL, CLASSES = bundle["model"], bundle["classes"]
MIN_CONF = 0.60   # below this we do NOT show a disease or medicine

def pretty(label): return label.replace("___", " - ").replace("_", " ")

@app.after_request
def cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp

@app.get("/")
def home(): return render_template("index.html")

@app.post("/predict")
def predict():
    f = request.files.get("image")
    if f is None or f.filename == "":
        return jsonify(error="No image uploaded / कोई फोटो नहीं मिली. Send form-data field 'image'."), 400
    img = cv2.imdecode(np.frombuffer(f.read(), np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        return jsonify(error="Could not read the image / फोटो पढ़ी नहीं जा सकी (JPG या PNG भेजें)."), 400
    lang = request.form.get("lang", "hi")
    hi = lang != "en"

    proba = MODEL.predict_proba(embed_batch([img]))[0]
    best = int(np.argmax(proba)); label = CLASSES[best]; conf = float(proba[best])
    base = dict(lang=lang, confidence=round(conf * 100, 1))

    if label == "Other_plant" and conf >= 0.5:
        msg = OTHER_HI if hi else "This does not look like a tomato or potato leaf. The model currently knows only tomato and potato leaves. Please upload a clear photo of one leaf of these crops."
        return jsonify(status="other", message=msg, **base)
    if conf < MIN_CONF or label == "Other_plant":
        msg = UNSURE_HI if hi else "The model is not sure, so it gives no advice (wrong medicine can harm the crop). Please upload a clear, close-up photo of one leaf in good light, or meet your local agriculture officer / KVK."
        return jsonify(status="unsure", message=msg, **base)

    problem, advice = (ADVICE_HI if hi else ADVICE)[label]
    return jsonify(
        status="ok", prediction=LABEL_HI[label] if hi else pretty(label),
        problem=problem, advice=advice,
        note=NOTE_HI if hi else "Advice is a general guide. Confirm doses with your local agriculture officer / KVK.",
        **base)

@app.errorhandler(413)
def too_big(_): return jsonify(error="Image too large (max 8 MB) / फोटो बहुत बड़ी है."), 413

if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=5000, debug=False)
       app.run(host="127.0.0.1", port=5001)
