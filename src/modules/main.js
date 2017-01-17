import {loadAudio} from './loadAudio'

var isSP, ctx, xml, data, frequencyRatioTempered, keyboards;

window.AudioContext = window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.msAudioContext;

ctx = new AudioContext();

loadAudio('media/piano.wav').then(function(response){

	// use the decodeAudioData to convert arraybuffer into an AudioBuffer
	ctx.decodeAudioData(
			response,
			function(_data) {
					data = _data;
					console.log(data);
			},
			function(e) {
					throw(e.err);
			}
	);
})

frequencyRatioTempered = 1.059463;

keyboards = Array.prototype.slice.call(
		document.getElementsByClassName('keyboard-li')
);

isSP = typeof window.ontouchstart !== 'undefined';

keyboards.map(function(keyboard, index) {

		var i, frequencyRatio;

		frequencyRatio = 1;
		for(var n = 0; n<36 ;n++){
			frequencyRatio *= frequencyRatioTempered;
		}

		for (i = 0; i < index; i++) {
				frequencyRatio /= frequencyRatioTempered;
		}
		keyboard.addEventListener(isSP ? 'touchstart' : 'click', function() {
				var bufferSource;
				bufferSource = ctx.createBufferSource();
				bufferSource.buffer = data;

				bufferSource.playbackRate.value = frequencyRatio;
				bufferSource.connect(ctx.destination);
				bufferSource.start(0);
		});
});
