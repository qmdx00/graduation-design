export default {
    canvas: {
        width: 280, // 画布宽度
        height: 280, // 画布高度
        bgColor: '#000', // 背景颜色
        scale: 1, // 缩放比例
        lineWidth: 5, // 画笔粗细
        lineStyle: '#fff' // 画笔颜色
    },
    paint: {
        keyCode: 32, // 空格键开始绘画
        clear: 8 // delete键清空画布
    },
    output: {
        image: 'jpeg', // 图片格式  jpeg | png
        keyCode: 13 // 回车键下载图片
    },
    websocket: {
        url: 'ws://localhost:8765'
    }
}