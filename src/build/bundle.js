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

var keymap = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75];
var keyIsDown = [false, false, false, false, false, false, false, false, false, false, false];

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

		for (i = 0; i < 11 - index % 12; i++) {
				frequencyRatio *= frequencyRatioTempered;
		}

		console.log(keyboard);

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

document.addEventListener('keydown', function (event) {

		var index = keymap.indexOf(event.keyCode);

		if (~index) {
				if (!!keyIsDown[index]) return;
				keyIsDown[index] = true;
				var bufferSource;

				var n = 2;

				var i, frequencyRatio;

				frequencyRatio = 1;

				for (i = 0; i < index; i++) {
						frequencyRatio *= frequencyRatioTempered;
				}
				// style
				var elm = keyboards[59 - (n * 12 + index)];
				addClass(elm, 'on');

				bufferSource = ctxs[n].createBufferSource();
				bufferSource.buffer = datas[n];

				bufferSource.playbackRate.value = frequencyRatio;
				bufferSource.connect(ctxs[n].destination);
				bufferSource.start(0);
		}
});
document.addEventListener('keyup', function (event) {

		var index = keymap.indexOf(event.keyCode);

		var n = 2;
		if (~index) {
				keyIsDown[index] = false;
		}
		var elm = keyboards[59 - (n * 12 + index)];
		removeClass(elm, 'on');
});

function hasClass(elem, cls) {
		cls = cls || '';
		if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
		return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function addClass(ele, cls) {
		if (!hasClass(ele, cls)) {
				ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
		}
}

function removeClass(ele, cls) {
		if (hasClass(ele, cls)) {
				var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
				while (newClass.indexOf(' ' + cls + ' ') >= 0) {
						newClass = newClass.replace(' ' + cls + ' ', ' ');
				}
				ele.className = newClass.replace(/^\s+|\s+$/g, '');
		}
}

}());
