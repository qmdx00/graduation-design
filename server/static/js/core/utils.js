import config from '../config/index.js'

/**
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs
 * https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * 
 * DataURL 格式如下：
 * data:[<mediatype>][;base64],<data>
 */

/**
 * from data url get data.
 * @param {any} content data url
 * @returns {string}
 */
const getData = content => content.split(';base64,')[1]

/**
 * from data url get media type.
 * @param {any} content data url
 * @returns {string}
 */
const getMediaType = content => content.split(';base64,')[0]

/**
 * from meta get media type suffix.
 * @param {any} content data url
 * @returns {string}
 */
const getTypeSuffix = content => getMediaType(content).split('/')[1]


/**
 * convert data url to blob.
 * @param {any} content data url
 * @returns {Blob} Blob object
 */
const dataUrlToBlob = content => {
    const byteData = atob(getData(content))
    const byteArray = new Array(byteData.length)

    for (let i = 0; i < byteData.length; i++) {
        byteArray[i] = byteData.charCodeAt(i)
    }

    return new Blob([new Uint8Array(byteArray)], {type: getMediaType(content)})
}


/**
 * 将canvas导出为图片
 * @param {HTMLElement} root canvas元素
 * @param {string} filename 图片文件名
 */
export const outputCanvasToImage = (root, filename) => {
    let content = root.toDataURL(`image/${config.output.image}`, config.canvas.scale)
    let blob = dataUrlToBlob(content)
    // 构建a标签并模拟点击
    let url = URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.href = url
    link.setAttribute("download", `${filename}.${getTypeSuffix(content)}`)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(url)
}

/**
 * send base64 string to server
 * @param {HTMLElement} root canvas元素
 * @param {SocketIOClient} socket SocketIOClient 对象
 * @param {Function} callback 回调函数返回预测结果
 */
export const sendDataToServer = (root, socket, callback) => {
    console.log("send")
    socket.emit('image', {
        image: getData(root.toDataURL(`image/${config.output.image}`, config.canvas.scale))
    }, callback)
    // socket.send(getData(root.toDataURL(`image/${config.output.image}`, config.canvas.scale)))
}

/**
 * 清空画布
 * @param {CanvasRenderingContext2D} ctx context 2d对象 
 */
export const clearCanvas = ctx => {
    ctx.fillStyle = config.canvas.bgColor
    ctx.fillRect(0, 0, config.canvas.width, config.canvas.height)
}