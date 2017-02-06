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

var hasClass = function hasClass(elem, cls) {
  cls = cls || '';
  if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
};

var addClass = function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
  }
};

var removeClass = function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ');
    }
    ele.className = newClass.replace(/^\s+|\s+$/g, '');
  }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

var ctx$1 = new AudioContext();

var AudioProcessor = function () {
	function AudioProcessor(data, frequencyRatio) {
		classCallCheck(this, AudioProcessor);


		this.audioCtx = ctx$1;
		this.bufferSource = this.audioCtx.createBufferSource();
		this.bufferSource.buffer = data;

		this.bufferSource.playbackRate.value = frequencyRatio;
		// 播放速度初始化

		this.gainNode = this.audioCtx.createGain();

		this.bufferSource.connect(this.audioCtx.destination);
		this.gainNode.connect(this.audioCtx.destination);
	}

	createClass(AudioProcessor, [{
		key: "start",
		value: function start(time) {
			this.bufferSource.start(time);
		}
	}, {
		key: "stop",
		value: function stop(time) {
			// 按时间stop或当前时间淡出
			this.bufferSource && this.bufferSource.stop(time || this.audioCtx.currentTime + 1);
		}
	}]);
	return AudioProcessor;
}();

var isSP;
var frequencyRatioTempered;
var keyboards;

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

var keymap = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75];

var keyIsDown = [false, false, false, false, false, false, false, false, false, false, false];

var ctx = new AudioContext();
// ctxs = [new AudioContext(),new AudioContext(),new AudioContext(),new AudioContext(),new AudioContext()];
// 一个页面最多只能new6个AudioContext

var datas = Array(5);

var _loop = function _loop(i) {
		loadAudio('media/C' + i + '.wav').then(function (response) {

				// use the decodeAudioData to convert arraybuffer into an AudioBuffer
				// ctxs[i-2].decodeAudioData(
				// 		response,
				// 		function(_data) {
				// 				datas[i-2] = _data;
				// 		},
				// 		function(e) {
				// 				throw(e.err);
				// 		}
				// );
				ctx.decodeAudioData(response, function (_data) {
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

		var bufferSource = null;

		var n = 4 - Math.floor(index / 12);

		// var gainNode = ctxs[n].createGain();

		keyboard.addEventListener(isSP ? 'touchstart' : 'mousedown', function () {

				var thisProcessor = new AudioProcessor(datas[n], frequencyRatio);
				// bufferSource = ctxs[n].createBufferSource();
				// bufferSource.buffer = datas[n];
				//
				// bufferSource.playbackRate.value = frequencyRatio;
				// bufferSource.connect(ctxs[n].destination);
				// gainNode.connect(ctxs[n].destination);
				// bufferSource.start(0);
				thisProcessor.start(0);
		});

		keyboard.addEventListener(isSP ? 'touchend' : 'mouseup', function () {

				// bufferSource && bufferSource.stop(ctxs[n].currentTime + 1);
				// gainNode.gain.linearRampToValueAtTime(0, ctxs[n].currentTime + 1);
				//stop the playback after a 1s
		});
});

// document.addEventListener('keydown',function(event){
//
// 	var index = keymap.indexOf(event.keyCode)
//
// 	if(~index){
// 		if(!!keyIsDown[index])
// 		return;
// 		keyIsDown[index] = true;
// 		var bufferSource;
//
// 		var n = 2;
//
// 		var i, frequencyRatio;
//
// 		frequencyRatio = 1;
//
// 		for (i = 0; i < index; i++) {
// 				frequencyRatio *= frequencyRatioTempered;
// 		}
// 		// style
// 		var elm = keyboards[59-(n*12+index)]
// 		addClass(elm,'on')
//
// 		bufferSource = ctxs[n].createBufferSource();
// 		bufferSource.buffer = datas[n];
//
// 		bufferSource.playbackRate.value = frequencyRatio;
// 		bufferSource.connect(ctxs[n].destination);
// 		bufferSource.start(0);
// 	}
// })
// document.addEventListener('keyup',function(event){
//
// 	var index = keymap.indexOf(event.keyCode)
//
// 	var n = 2;
// 	if(~index){
// 		keyIsDown[index] = false;
// 	}
// 	var elm = keyboards[59-(n*12+index)]
// 	removeClass(elm,'on')
// })
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

				bufferSource = ctx.createBufferSource();
				bufferSource.buffer = datas[n];

				bufferSource.playbackRate.value = frequencyRatio;
				bufferSource.connect(ctx.destination);
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

}());
