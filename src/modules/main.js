import {loadAudio} from './loadAudio'

var isSP, ctxs, xml, frequencyRatioTempered, keyboards;

window.AudioContext = window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.msAudioContext;


ctxs = [new AudioContext(),new AudioContext(),new AudioContext(),new AudioContext(),new AudioContext()];

var datas = Array(5);

for(let i = 2;i<7;i++){
	loadAudio(`media/C${i}.wav`).then(function(response){

		// use the decodeAudioData to convert arraybuffer into an AudioBuffer
		ctxs[i-2].decodeAudioData(
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

		for (i = 0; i < (index%12); i++) {
				frequencyRatio /= frequencyRatioTempered;
		}
		keyboard.addEventListener(isSP ? 'touchstart' : 'click', function() {
				var bufferSource;

				var n = 4-Math.floor(index/12);

				bufferSource = ctxs[n].createBufferSource();
				bufferSource.buffer = datas[n];

				bufferSource.playbackRate.value = frequencyRatio;
				bufferSource.connect(ctxs[n].destination);
				bufferSource.start(0);
		});
});
