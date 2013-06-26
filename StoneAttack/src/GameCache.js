(function() {
	"use strict";

	if(localStorage === undefined) {
		console.error('localStorage is undefined.');
		return;
	}

	var Cache = {
		_get: function(key) {
			if(!localStorage.hasOwnProperty(key)) return null;
			return localStorage.getItem(key);
		},

		_set: function(key, value) {
			localStorage.setItem(key, value);
		},

		_remove: function(key) {
			if(!localStorage.hasOwnProperty(key)) return null;
			localStorage.removeItem(key);
		},

		save: function() {
			var arr = [];
			arr.push( GameData.isMusicSound ? 1 : 0 );
			arr.push( GameData.isSoundEffect ? 1 : 0 );
			arr.push( GameData.HighScore.Normal );
			arr.push( GameData.HighScore.Hardcore );
			arr.push( GameData.HighScore.SavedVersion );
			arr.push( GameData.currentBgmNumber );

			this._set('__STONEATTACK_DATA', arr.join(','));
		},

		load: function() {
			if(this._get('__STONEATTACK_DATA') == null) return;
			var arr = this._get('__STONEATTACK_DATA').split(',');

			GameData.isMusicSound = arr[0] == 1 ? true : false;
			GameData.isSoundEffect = arr[1] == 1 ? true : false;
			GameData.HighScore.Normal = Number(arr[2]);
			GameData.HighScore.HardCore = Number(arr[3]);
			GameData.HighScore.SavedVersion = Number(arr[4]);
			GameData.currentBgmNumber = Number(arr[5]);
		}
	};

	window.GameCache = Cache;
})();