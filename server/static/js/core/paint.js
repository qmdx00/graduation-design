import config from '../config/index.js'
import { outputCanvasToImage, clearCanvas, sendDataToServer } from './utils.js'

/**
 * paint对象，canvas绘制，键盘事件监听
 */
export class Paint {
    /**
     * 构造函数
     * @param {HTMLElement} root canvas元素
     * @param {CanvasRenderingContext2D} ctx Context 2d 对象
     * @param {WebSocket} socket websocket 对象
     */
    constructor(root, ctx, socket) {
        this._root = root
        this._ctx = ctx
        this._socket = socket
        // 初始化默认鼠标位置
        this._cur = {x: 0, y: 0}
        // 重置this指向
        this._bindKey = this._bindKey.bind(this)
    }

    // 缓存鼠标的位置信息
    _captureMousePosition() {
        this._root.onmousemove = event => {
            this._cur.x = event.offsetX
            this._cur.y = event.offsetY
        }
    }

    /**
     * 开始键按下触发
     */
    _handleKeyDown() {
        this._ctx.beginPath()
        this._root.onmousemove = event => {
            this._ctx.moveTo(this._cur.x, this._cur.y)
            this._ctx.lineTo(event.offsetX, event.offsetY)
            this._ctx.stroke()
            this._cur.x = event.offsetX
            this._cur.y= event.offsetY
        }
    }

    /**
     * 开始键松开触发
     */
    _handleKeyUp() {
        this._ctx.closePath()
        this._captureMousePosition()

        sendDataToServer(this._root, this._socket, predict => {
            let items = []
            for(let i = 0; i < predict.length; i++) {
                let item = new Object()
                item.possible = predict[i]
                item.value = i
                items.push(item)
            }
            items.sort((a, b) => b.possible - a.possible)
            console.dir(items)
        })
    }

    /**
     * 绑定触发函数和键盘事件
     * @param {KeyboardEvent} event 键盘事件
     */
    _bindKey(event) {
        // 按住空格开始绘制，松开结束
        if (event.keyCode === config.paint.keyCode) {
            document.onkeydown = null
            this._handleKeyDown()
            document.onkeyup = event => {
                if (event.keyCode === config.paint.keyCode) {
                    this._handleKeyUp()
                    document.onkeyup = null
                    document.onkeydown = this._bindKey
                }
            }
        }
        // 按下回车下载图片
        if (event.keyCode === config.output.keyCode) {
            outputCanvasToImage(this._root, new Date().getTime())
        }
        // 按下Del清空画布
        if (event.keyCode === config.paint.clear) {
            clearCanvas(this._ctx)
        }
    }

    /**
     * 初始化键盘和鼠标动作，开始缓存鼠标位置
     */
    initPaint() {
        document.onkeydown = this._bindKey
        this._captureMousePosition()
        this._socket = io.connect(config.websocket.url)
    }

}