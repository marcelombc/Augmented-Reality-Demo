(function(glob) {

	// constructor
	function Audio(srcs) {
		this.sources = srcs;
		this.isPlaying = false;
		__createAudio.call(this);
	}

	Audio.prototype.play = function() {
		__play.call(this);
	}

	Audio.prototype.pause = function() {
		__pause.call(this);
	}

	function __createAudio() {
		this.audio = document.createElement("audio");
		this.loop = true;
		document.body.appendChild(this.audio);
		for (var i = 0; i < this.sources.length; i++) {
			var source = document.createElement("source");
			source.src = this.sources[i];
			this.audio.appendChild(source);
		}
	}

	function __play() {
		if (this.isPlaying) return;
		this.isPlaying = true;
		this.audio.play();
	}

	function __pause() {
		if (!this.isPlaying) return;
		this.isPlaying = false;
		this.audio.pause();
	}

	if (typeof define == "function" && define.amd) {
		define(function() {
			return Audio;
		});
	} else {
	    glob.Audio = Audio;
	}

}(window));