import numpy as np, cv2, os
os.environ["TF_CPP_MIN_LOG_LEVEL"]="3"
import tensorflow as tf
_W = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mobilenet_1_0_224_tf_no_top.h5")
_net = None
def net():
    global _net
    if _net is None:
        base = tf.keras.applications.MobileNet(input_shape=(224,224,3), include_top=False, weights=None, pooling="avg")
        base.load_weights(_W)
        _net = base
    return _net
def prep(bgr):
    rgb = cv2.cvtColor(cv2.resize(bgr,(224,224)), cv2.COLOR_BGR2RGB).astype("float32")
    return tf.keras.applications.mobilenet.preprocess_input(rgb)
def embed_batch(imgs_bgr):
    x = np.stack([prep(i) for i in imgs_bgr])
    return net().predict(x, batch_size=32, verbose=0)
def center_zoom(bgr, f=0.7):
    h,w = bgr.shape[:2]; ch,cw=int(h*f),int(w*f); y,x=(h-ch)//2,(w-cw)//2
    return bgr[y:y+ch, x:x+cw]
