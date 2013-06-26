var MeteorSprite = cc.Sprite.extend({
	_currentAngle: 0,

	// static
	minDropSpeed: 1,
	maxDropSpeed: 4,

	// public
	isShield: false,
	isHp: false,

	dropSpeed: 0,
	MeteorX: Math.floor(Math.random() * 1000 % 360), MeteorY: 680,

	construct: function(x) {
		// this.dropSpeed = Math.floor(Math.random() * 1000) % (this.maxDropSpeed - this.minDropSpeed) + this.minDropSpeed;
		this.dropSpeed = Math.floor(Math.random() * (this.maxDropSpeed - this.minDropSpeed)) + this.minDropSpeed;		
		// if(x) {
			this.MeteorX = x;
		// }
	},

	create: function(x) {
		var pobSprite = new MeteorSprite();
		pobSprite.construct(x);
		var randNum = Math.floor(Math.random() * 4);
		if(pobSprite && pobSprite.initWithFile(randNum == 0 ? s_metheo1_png : randNum == 1 ? s_metheo2_png : randNum == 2 ? s_metheo3_png : s_metheo4_png)) {
			return pobSprite;
		}

		delete pobSprite;
		return null;
	},

	createShield: function(x) {
		var pobSprite = new MeteorSprite();
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
		var pobSprite = new MeteorSprite();
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

		this.MeteorY += this.dropSpeed;
		var dx = this.MeteorX - GameData.playerX,
			x  = GameData.planetCenterX + Math.cos(Math.PI / 180 * (dx < 0 ? dx + 360 : dx)) * this.MeteorY,
			y  = GameData.planetCenterY + Math.sin(Math.PI / 180 * (dx < 0 ? dx + 360 : dx)) * this.MeteorY;

		this.setPosition(cc.p(x, y));
		if(this.MeteorY < 163) {
			GameData.gameScene.collidePlanet(this);
		} else if(GameData.gameScene.isShield && Math.pow(GameData.shieldX - x, 2) + Math.pow(GameData.shieldY - y, 2) < 1600) {
			if(!(this.isShield || this.isHp)) {
				GameData.gameScene.collideShield(this);
			} else {
				GameData.gameScene.collideItem(this);
			}
		} else if(x > GameData.playerRectX1 && x < GameData.playerRectX2 &&
				  y > GameData.playerRectY1 && y < GameData.playerRectY2) {
			if(!(this.isShield || this.isHp)) {
				GameData.gameScene.collidePlayer(this);
			} else {
				GameData.gameScene.collideItem(this);
			}
		}
	}
});