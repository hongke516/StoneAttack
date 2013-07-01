(function() {
	"use strict";

	// 게임데이터를 담고있는 Object
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
		
		playerX: 0,
		gameScene: null,
		currentScore: 0,
	};

	// 상수
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

	// 초기값 설정 및 테이블 초기화
	GameData.gameState = GameData.STATE_INTRO;
	GameData.cosTable = [];
	GameData.sinTable = [];
	
	// sinTable, cosTable 입력.
	for(var i = 0; i < 360; i++)
	{
		var radian = i * Math.PI / 180.0;
		GameData.cosTable.push(Math.cos(radian));
		GameData.sinTable.push(Math.sin(radian));
	}	
	
	// 즉시실행 익명함수로 실행되기 때문에 외부에서 호출해주기 위해 window 최상위 객체에 바인딩한다.
	window.GameData = GameData;
	window.ccp = cc.p;
})();
