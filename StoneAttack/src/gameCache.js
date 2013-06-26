(function() {
	"use strict";

	if(localStorage === undefined) {
		console.error('localStorage is undefined.');
		return;
	}

	var Cache = {
		get: function(key) {
			if(!localStorage.hasOwnProperty(key)) return null;
			return localStorage.getItem(key);
		},

		set: function(key, value) {
			localStorage.setItem(key, value);
		},

		remove: function(key) {
			if(!localStorage.hasOwnProperty(key)) return null;
			localStorage.removeItem(key);
		}
	};

	window.gameCache = Cache;
})();