from flask import Flask, render_template
from flask_socketio import SocketIO
import requests
import json
import base64
import numpy as np
from cv2 import cv2 as cv

app = Flask(__name__)
io = SocketIO(app, cors_allowed_origins='*')


@io.on('connect')
def connect():
    print("client connected")


@io.on('image')
def receive_image(payload):
    print("image received")
    b64 = payload['image']
    image = convert_base64_to_image(b64)
    return predict_image(image)


def convert_base64_to_image(b64_str: str):
    byte_array = np.frombuffer(base64.b64decode(b64_str), np.uint8)
    image = cv.imdecode(byte_array, cv.IMREAD_COLOR)
    return cv.resize(image, (28, 28), interpolation=cv.INTER_AREA)


def predict_image(image):
    body = {"instances": (image / 255.0)[:, :, 0].tolist()}
    url = "http://localhost:8501/v1/models/handwriting:predict"
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=json.dumps(body))
    result = response.text.encode('utf8')
    return json.loads(result)['predictions'][0]


@app.route('/')
def hello():
    return render_template("index.html")


if __name__ == '__main__':
    io.run(app, host='0.0.0.0')
