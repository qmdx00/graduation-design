/**
 * https://developer.mozilla.org/zh-CN/docs/Web/HTTP/data_URIs
 * https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * 
 * DataURL like below:
 * data:[<mediatype>][;base64],<data>
 */

/**
 * from data url get data.
 * @param {any} content data url
 * @returns {string}
 */
const get_data = content => content.split(';base64,')[1]

/**
 * from data url get media type.
 * @param {any} content data url
 * @returns {string}
 */
const get_media_type = content => content.split(';base64,')[0]

/**
 * from meta get media type suffix.
 * @param {any} content data url
 * @returns {string}
 */
const get_type_suffix = content => get_media_type(content).split('/')[1]


/**
 * convert data url to blob.
 * @param {any} content data url
 * @returns {Blob}
 */
const data_url_to_blob = content => {
    const type_data = atob(get_data(content))
    const byte_number = new Array(type_data.length)

    for (let i = 0; i < type_data.length; i++) {
        byte_number[i] = type_data.charCodeAt(i)
    }

    const byte_array = new Uint8Array(byte_number)
    return new Blob([byte_array], {type: get_media_type(content)})
}


/**
 * download blob object as image.
 * @param {string} filename download filename
 * @param {any} content data url
 */
export const blob_to_image = (filename, content) => {
    let blob = data_url_to_blob(content)

    // create 'a' tag and auto click
    let url = URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.href = url
    link.setAttribute("download", `${filename}.${get_type_suffix(content)}`);
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click();
    URL.revokeObjectURL(url);
}