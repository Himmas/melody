window.AudioContext = window.AudioContext ||
		window.webkitAudioContext ||
		window.mozAudioContext ||
		window.msAudioContext;

let ctx = new AudioContext();

export default class AudioProcessor {
	constructor (data,frequencyRatio) {

    this.audioCtx = ctx;
		this.bufferSource = this.audioCtx.createBufferSource();
		this.bufferSource.buffer = data;

		this.bufferSource.playbackRate.value = frequencyRatio;
		// 播放速度初始化

		this.gainNode = this.audioCtx.createGain();

		this.bufferSource.connect(this.audioCtx.destination);
		this.gainNode.connect(this.audioCtx.destination);

  }

	start(time){
		this.bufferSource.start(time);
	}

	stop(time){
		// 按时间stop或当前时间淡出
		if(this.bufferSource && time)
			this.bufferSource.stop((this.audioCtx.currentTime + time));
		else if(this.bufferSource)
			this.bufferSource.stop();
	}

	getPeaks(length) {

        if (this.peaks) { return this.peaks; }

				var buffer = this.bufferSource.buffer
        var sampleSize = buffer.length / length;
        var sampleStep = ~~(sampleSize / 10) || 1;
        var channels = buffer.numberOfChannels;
        var splitPeaks = [];
        var mergedPeaks = [];

        for (var c = 0; c < channels; c++) {
            var peaks = splitPeaks[c] = [];
            var chan = buffer.getChannelData(c);

            for (var i = 0; i < length; i++) {
                var start = ~~(i * sampleSize);
                var end = ~~(start + sampleSize);
                var min = 0;
                var max = 0;

                for (var j = start; j < end; j += sampleStep) {
                    var value = chan[j];

                    if (value > max) {
                        max = value;
                    }

                    if (value < min) {
                        min = value;
                    }
                }

                peaks[2 * i] = max;
                peaks[2 * i + 1] = min;

                if (c == 0 || max > mergedPeaks[2 * i]) {
                    mergedPeaks[2 * i] = max;
                }

                if (c == 0 || min < mergedPeaks[2 * i + 1]) {
                    mergedPeaks[2 * i + 1] = min;
                }
            }
        }

        return (this.params && this.params.splitChannels) ? splitPeaks : mergedPeaks;
    }

}
