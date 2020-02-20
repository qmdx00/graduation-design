# websocket server
import base64
import asyncio
import websockets
from websockets import WebSocketServerProtocol
import matplotlib.pyplot as plt
import numpy as np
from cv2 import cv2 as cv


def convert_base64_to_image(b64_str: str):
    byte_array = np.frombuffer(base64.b64decode(b64_str), np.uint8)
    image = cv.imdecode(byte_array, cv.IMREAD_COLOR)
    return cv.resize(image, (28, 28), interpolation=cv.INTER_AREA)


def predict_value(image):
    pass


def show_image(image):
    plt.imshow(image)
    plt.show()


async def hello(websocket: WebSocketServerProtocol, path: str):
    while True:
        b64_str = await websocket.recv()
        image = convert_base64_to_image(b64_str)
        show_image(image)


start_server = websockets.serve(hello, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
