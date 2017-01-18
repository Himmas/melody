(function () {
'use strict';

/**
 * @param {url}
 * @return {Promise}
 */
var loadAudio = function loadAudio(url) {
    return new Promise(function (resolve, reject) {
        /* Create a new XHR object */
        var xhr = new XMLHttpRequest();

        /* Set the XHR responseType to arraybuffer */
        xhr.responseType = 'arraybuffer';
        xhr.open('GET', url, true);
        xhr.onload = function () {
            /* The files arraybuffer is available at xhr.response */

            if (xhr.status === 200) resolve(xhr.response);else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.send();
    });
};

var isSP;
var ctxs;
var frequencyRatioTempered;
var keyboards;

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

ctxs = [new AudioContext(), new AudioContext(), new AudioContext(), new AudioContext(), new AudioContext()];

var datas = Array(5);

var _loop = function _loop(i) {
		loadAudio('media/C' + i + '.wav').then(function (response) {

				// use the decodeAudioData to convert arraybuffer into an AudioBuffer
				ctxs[i - 2].decodeAudioData(response, function (_data) {
						datas[i - 2] = _data;
				}, function (e) {
						throw e.err;
				});
		});
};

for (var i = 2; i < 7; i++) {
		_loop(i);
}

frequencyRatioTempered = 1.059463;

keyboards = Array.prototype.slice.call(document.getElementsByClassName('keyboard-li'));

isSP = typeof window.ontouchstart !== 'undefined';

keyboards.map(function (keyboard, index) {

		var i, frequencyRatio;

		frequencyRatio = 1;

		for (i = 0; i < index % 12; i++) {
				frequencyRatio /= frequencyRatioTempered;
		}
		keyboard.addEventListener(isSP ? 'touchstart' : 'click', function () {
				var bufferSource;

				var n = 4 - Math.floor(index / 12);

				bufferSource = ctxs[n].createBufferSource();
				bufferSource.buffer = datas[n];

				bufferSource.playbackRate.value = frequencyRatio;
				bufferSource.connect(ctxs[n].destination);
				bufferSource.start(0);
		});
});

}());
