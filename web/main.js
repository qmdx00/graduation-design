import config from './config/index.js.js'
import { Paint } from './core/paint.js.js'


// 获取canvas元素
let root = document.getElementById("canvas")
let ctx = root.getContext('2d')
// 设置canvas大小
ctx.canvas.width = config.canvas.width
ctx.canvas.height = config.canvas.height
// 设置canvas导出图片的背景颜色
ctx.fillStyle = config.canvas.bgColor
ctx.fillRect(0, 0, config.canvas.width, config.canvas.height)
// 设置画笔粗细和颜色
ctx.lineWidth = config.canvas.lineWidth
ctx.strokeStyle = config.canvas.lineStyle
// 初始化paint对象
let paint = new Paint(root, ctx)
paint.initPaint()