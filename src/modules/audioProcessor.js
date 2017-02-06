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
		this.bufferSource && this.bufferSource.stop(time || (this.audioCtx.currentTime + 1));
	}

}
