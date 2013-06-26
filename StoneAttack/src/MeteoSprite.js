var MeteoSprite = cc.Sprite.extend({
	_currentAngle: 0,

	// static
	minDropSpeed: 1,
	maxDropSpeed: 4,

	// public
	isShield: false,
	isHp: false,

	dropSpeed: 0,
	meteoX: Math.floor(Math.random() * 1000 % 360), meteoY: 680,

	construct: function(x) {
		this.dropSpeed = Math.floor(Math.random() * 1000) % (this.maxDropSpeed - this.minDropSpeed) + this.minDropSpeed;
		if(x) {
			this.meteoX = x;
		}
	},

	create: function() {
		var pobSprite = new MeteoSprite();
		pobSprite.construct();
		var randNum = Math.floor(Math.random() * 10 % 4);
		if(pobSprite && pobSprite.initWithFile(randNum == 0 ? s_metheo1_png : randNum == 1 ? s_metheo2_png : randNum == 3 ? s_metheo3_png : s_metheo4_png)) {
			return pobSprite;
		}

		delete pobSprite;
		return null;
	},

	createShield: function(x) {
		var pobSprite = new MeteoSprite();
		pobSprite.construct(x);
		if(pobSprite && pobSprite.initWithFile(s_shield_png)) {
			pobSprite.isShield = true;
			pobSprite.dropSpeed = 4;
			return pobSprite;
		}

		delete pobSprite;
		return null;
	},

	createHp: function() {
		var pobSprite = new MeteoSprite();
		pobSprite.construct();
		if(pobSprite && pobSprite.initWithFile(s_life_png)) {
			pobSprite.isHp = true;
			pobSprite.dropSpeed = 4;
			return pobSprite;
		}

		delete pobSprite;
		console.log('FD');
		return null;
	},

	update: function() {
		this.currentAngle += 3;
		if(this.currentAngle >= 360)
			this.currentAngle -= 360;

		this.setRotation(this.currentAngle);

		this.meteoY += this.dropSpeed;
		var dx = this.meteoX - gameData.playerX,
			x  = gameData.planetCenterX + Math.cos(Math.PI / 180 * (dx < 0 ? dx + 360 : dx)) * this.meteoY,
			y  = gameData.planetCenterY + Math.sin(Math.PI / 180 * (dx < 0 ? dx + 360 : dx)) * this.meteoY;

		this.setPosition(cc.p(x, y));
		if(this.meteoY < 163) {
			gameData.gameScene.collidePlanet(this);
		} else if(gameData.gameScene.isShield && Math.pow(gameData.shieldX - x, 2) + Math.pow(gameData.shieldY - y, 2) < 1600) {
			if(!(this.isShield || this.isHp)) {
				gameData.gameScene.collideShield(this);
			} else {
				gameData.gameScene.collideItem(this);
			}
		} else if(x > gameData.playerRectX1 && x < gameData.playerRectX2 &&
				  y > gameData.playerRectY1 && y < gameData.playerRectY2) {
			if(!(this.isShield || this.isHp)) {
				gameData.gameScene.collidePlayer(this);
			} else {
				gameData.gameScene.collideItem(this);
			}
		}
	}
});