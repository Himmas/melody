/**
 * @param {url}
 * @return {Promise}
 */
export const loadAudio = function(url) {
    return new Promise(function(resolve, reject) {
        /* Create a new XHR object */
        let xhr = new XMLHttpRequest();

        /* Set the XHR responseType to arraybuffer */
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', url, true);
        xhr.onload = function() {
            /* The files arraybuffer is available at xhr.response */

            if (xhr.status === 200)
                resolve(xhr.response)
            else {
                reject(new Error(xhr.statusText))
            }
        };
        xhr.send();
    })
}
