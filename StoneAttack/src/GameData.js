(function() {
	"use strict";

	var GameData =
	{
		// int
		gameState: 0,
		currentBgmNumber: 0,
		isHardCore: false,
		isMusicSound: true,
		isSoundEffect: true,

		HighScore:
		{
			Normal: 0,
			Hardcore: 0,

			SavedVersion: 1
		},
		
		// GameScene
		
		playerX: 0,
		gameScene: null,
		currentScore: 0,
	};

	// ADD CONSTANTS
	Object.defineProperties(GameData, {
		'STATE_PLAYING':
		{
			value: 1,
			writable: false
		},
		'STATE_PAUSE':
		{
			value: 2,
			writable: false
		},
		'STATE_GAMEOVER':
		{
			value: 3,
			writable: false
		},
		'STATE_MENU':
		{
			value: 4,
			writable: false
		},
		'STATE_RECORD':
		{
			value: 5,
			writable: false
		},
		'STATE_INTRO':
		{
			value: 6,
			writable: false
		},
		'planetCenterX':
		{
			value: 450,
			writable: false
		},
		'planetCenterY':
		{
			value: 100,
			writable: false
		},
		'playerRectX1':
		{
			value: 440,
			writable: false
		},
		'playerRectX2':
		{
			value: 460,
			writable: false
		},
		'playerRectY1':
		{
			value: 250,
			writable: false
		},
		'playerRectY2':
		{
			value: 305,
			writable: false
		},
		'shieldX':
		{
			value: 450,
			writable: false
		},
		'shieldY':
		{
			value: 280,
			writable: false
		},
		'HP_MAX':
		{
			value: 1500,
			writable: false
		},
		'remainHitCoolTimeMax':
		{
			value: 120, // 95
			writable: false
		},
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
	window.ccp = cc.p;
})();
