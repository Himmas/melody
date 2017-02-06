import {loadAudio} from './loadAudio'
import {hasClass,removeClass,addClass,createElement} from './htmlDomApi'
import AudioProcessor from './audioProcessor'


var isSP, ctxs, xml, frequencyRatioTempered, keyboards;

window.AudioContext = window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.msAudioContext;


var keymap = [65,87,83,69,68,70,84,71,89,72,85,74,75];

var keyIsDown = [false,false,false,false,false,false,false,false,false,false,false];


var ctx = new AudioContext();
// ctxs = [new AudioContext(),new AudioContext(),new AudioContext(),new AudioContext(),new AudioContext()];
// 一个页面最多只能new6个AudioContext

var datas = Array(5);

for(let i = 2;i<7;i++){
	loadAudio(`media/C${i}.wav`).then(function(response){

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
		ctx.decodeAudioData(
				response,
				function(_data) {
						datas[i-2] = _data;
				},
				function(e) {
						throw(e.err);
				}
		);
	})

}

frequencyRatioTempered = 1.059463;

keyboards = Array.prototype.slice.call(
		document.getElementsByClassName('keyboard-li')
);

isSP = typeof window.ontouchstart !== 'undefined';

keyboards.map(function(keyboard, index) {

		var i, frequencyRatio;

		frequencyRatio = 1;

		for (i = 0; i < 11-(index%12); i++) {
				frequencyRatio *= frequencyRatioTempered;
		}

		var bufferSource = null;

		var n = 4-Math.floor(index/12);

		// var gainNode = ctxs[n].createGain();

		keyboard.addEventListener(isSP ? 'touchstart' : 'mousedown', function() {

				var thisProcessor = new AudioProcessor(ctx,datas[n],frequencyRatio)
				// bufferSource = ctxs[n].createBufferSource();
				// bufferSource.buffer = datas[n];
				//
				// bufferSource.playbackRate.value = frequencyRatio;
				// bufferSource.connect(ctxs[n].destination);
				// gainNode.connect(ctxs[n].destination);
				// bufferSource.start(0);
				thisProcessor.start(0);
		});

		keyboard.addEventListener(isSP ? 'touchend' : 'mouseup', function() {

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
document.addEventListener('keydown',function(event){

	var index = keymap.indexOf(event.keyCode)

	if(~index){
		if(!!keyIsDown[index])
		return;
		keyIsDown[index] = true;
		var bufferSource;

		var n = 2;

		var i, frequencyRatio;

		frequencyRatio = 1;

		for (i = 0; i < index; i++) {
				frequencyRatio *= frequencyRatioTempered;
		}
		// style
		var elm = keyboards[59-(n*12+index)]
		addClass(elm,'on')

		bufferSource = ctx.createBufferSource();
		bufferSource.buffer = datas[n];

		bufferSource.playbackRate.value = frequencyRatio;
		bufferSource.connect(ctx.destination);
		bufferSource.start(0);
	}
})
document.addEventListener('keyup',function(event){

	var index = keymap.indexOf(event.keyCode)

	var n = 2;
	if(~index){
		keyIsDown[index] = false;
	}
	var elm = keyboards[59-(n*12+index)]
	removeClass(elm,'on')
})
