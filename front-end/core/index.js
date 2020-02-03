import { blob_to_image } from './utils.js'
import conf from '../config/index.js'

/**
 * init canvas element.
 * @param {*} root canvas element
 */
export const init = root => {
    // get Context 2d object
    let ctx = root.getContext('2d')
    // set canvas size
    ctx.canvas.width = conf.canvas.width
    ctx.canvas.height = conf.canvas.height
    
    // ctx.fillStyle = 'green'
    // ctx.fillRect(10, 10, 150, 100)

    output_canvas_to_image(root, "test", 0.1)
}

/**
 * capture canvas to image.
 * @param {HTMLElement} root canvas element
 * @param {string} filename image filename
 * @param {number} scale zoom scale for image
 */
const output_canvas_to_image = (root, filename, scale) => {
    let img = root.toDataURL("image/jpeg", scale)
    blob_to_image(filename, img)
}