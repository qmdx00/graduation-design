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
    # 接收 base64 数据
    b64 = payload['image']
    # 处理图片
    image = convert_base64_to_image(b64)
    # 返回预测结果
    return predict_image(image)

#  定位图片中的数字
def located_number(img):
    (row, col) = img.shape
    # 上下左右边界
    row_top = 0
    row_bottom = 0
    col_top = 0
    col_bottom = 0
    # 寻找边界并赋值
    for r in range(0, row):
        if img.sum(axis=1)[r] > 0:
            row_top = r
            break

    for r in range(row-1, 0, -1):
        if img.sum(axis=1)[r] > 0:
            row_bottom = r
            break

    for c in range(0, col):
        if img.sum(axis=0)[c] > 0:
            col_top = c
            break
            
    for c in range(col-1, 0, -1):
        if img.sum(axis=0)[c] > 0:
            col_bottom = c
            break
    # 根据边界裁剪图片
    new_img = img[row_top:row_bottom, col_top:col_bottom]

    width = col_bottom - col_top
    height = row_bottom - row_top
    margin = int(abs(width - height)/2)
    # 将图片填充为正方形
    if width > height:
        new_img = cv.copyMakeBorder(new_img, margin, margin, 0, 0, cv.BORDER_CONSTANT)
    elif width < height:
        new_img = cv.copyMakeBorder(new_img, 0, 0, margin, margin, cv.BORDER_CONSTANT)
    # 返回裁剪后的图片
    return new_img 

# 将base64图片转换成灰度图并进行裁剪填充处理，返回 28x28 的处理后的图片
def convert_base64_to_image(b64_str: str):
    byte_array = np.frombuffer(base64.b64decode(b64_str), np.uint8)
    image = cv.imdecode(byte_array, cv.IMREAD_COLOR)
    # 转换成灰度图
    gray_image = cv.cvtColor(image, cv.COLOR_RGB2GRAY)
    # 截取数字区域
    number_area = located_number(gray_image)
    # 将图片缩放成 28x28大小
    new_img = cv.resize(number_area, (22, 22), interpolation=cv.INTER_AREA)
    new_img = np.pad(new_img, pad_width=3, mode='constant', constant_values=0)
    return new_img


def predict_image(image):
    body = {"instances": (image / 255.0).tolist()}
    url = "http://model-server:8501/v1/models/handwriting:predict"
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
