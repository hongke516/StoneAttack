(function() {
	"use strict";

	// var js = document.createElement('script'); js.type = 'text/javascript'; js.async = true;
	// js.src = 'soundManager2/js/soundmanager2.js';
	// var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(js, s);

	var SoundControl = {
		SoundList: [
			s_BGM1_fast_mp3,
			s_BGM1_normal_mp3,
			s_BGM2_fast_mp3,
			s_BGM2_normal_mp3,
			s_BGM3_fast_mp3,
			s_BGM3_normal_mp3,
			s_BGM4_fast_mp3,
			s_itemgot_mp3,
			s_pong_mp3,
			s_puck_mp3
		],

		Sound: {
		},

		Load: function() {
			soundManager.setup({
				url: './soundmanager2/swf/',
				preferFlash: false,
				debugMode: false,
				useHighPerformance: true,
				onready: function() {
					for(var i = 0; i < SoundControl.SoundList.length; i++) {
						SoundControl.Sound[SoundControl.SoundList[i]] = soundManager.createSound({
							url: SoundControl.SoundList[i],
							autoLoad: true
						});
					}
				}
			});
		},

		Play: function(soundName) {
			if(!this.Sound.hasOwnProperty(soundName)) {
				console.warn('soundFile', soundName, 'not found.');
				return;
			}

			if(this.Sound[soundName].playState != 0) {
				console.warn('soundFile', soundName, 'is playing.');
				return;
			}

			this.Sound[soundName].play();
		},

		Pause: function(soundName) {
			if(!this.Sound.hasOwnProperty(soundName)) {
				console.warn('soundFile', soundName, 'not found.');
				return;
			}

			if(this.Sound[soundName].playState != 1) {
				console.warn('soundFile', soundName, 'is not playing.');
				return;
			}

			this.Sound[soundName].pause();
		},

		Stop: function() {
			if(!this.Sound.hasOwnProperty(soundName)) {
				console.warn('soundFile', soundName, 'not found.');
				return;
			}

			if(this.Sound[soundName].playState != 1) {
				console.warn('soundFile', soundName, 'is not playing.');
				return;
			}

			this.Sound[soundName].pause();
		}
	};

	window.SoundControl = SoundControl;
})();