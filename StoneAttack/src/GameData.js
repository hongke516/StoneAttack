(function() {
	"use strict";

	var GameData =
	{
		// int
		gameState: 0,
		currentBgmNumber: 0,
		isHardCore: false,
		isMusicSound: true,

		HighScore:
		{
			Normal: 0,
			Hardcore: 0,

			SavedVersion: 1
		}
	};
/*	
	var cosTable = [], sinTable = [];
	for(var i = 0; i < 180; i++)
	{
		cosTable.push(Math.cos(i));
		sinTable.push(Math.sin(i));
	}
*/
	// ADD CONSTANTS
	Object.defineProperties(GameData, {
		'STATE_PLAYING': {
			value: 1,
			writable: false
		},
		'STATE_PAUSE': {
			value: 2,
			writable: false
		},
		'STATE_GAMEOVER': {
			value: 3,
			writable: false
		},
		'STATE_MENU': {
			value: 4,
			writable: false
		},
		'STATE_RECORD': {
			value: 5,
			writable: false
		},
		'STATE_INTRO': {
			value: 6,
			writable: false
		}
	})

	Object.defineProperty(GameData, 'SCORE_VERSION', { value : 1, writable: false });

	GameData.gameState = GameData.STATE_INTRO;
	GameData.cosTable = [];
	GameData.sinTable = [];
	
	for(var i = 0; i < 360; i++)
	{
		var radian = i * Math.PI / 180.0;
		GameData.cosTable.push(Math.cos(radian));
		GameData.sinTable.push(Math.sin(radian));
	}	
	
	window.GameData = GameData;
})();
