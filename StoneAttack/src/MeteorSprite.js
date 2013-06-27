var MeteorSprite = {
	items: [],

	properties: {
		minDropSpeed: 1,
		maxDropSpeed: 4
	},

	create: function(x) {
		var obj = {
			currentAngle: 0,
			isShield: false,
			isHp: false,

			dropSpeed: Math.floor(Math.random() * (this.maxDropSpeed - this.minDropSpeed)) + this.minDropSpeed,
			MeteorX: x,
			MeteorY: 680,
			// MeteorX: x ? x : Math.floor(Math.random() * 360),
			sprite: null
		};

		var randNum = Math.floor(Math.random() * 4);
		var img = (randNum == 0 ? s_metheo1_png : randNum == 1 ? s_metheo2_png : randNum == 2 ? s_metheo3_png : s_metheo4_png);
		var sprite = cc.Sprite.create(img);

		obj.sprite = sprite;

		this.items.push(obj);
	},

	createShield: function(x) {
		cc.log("shield");
		var obj = {
			currentAngle: 0,
			isShield: true,
			isHp: false,

			dropSpeed: 4,
			MeteorX: x ? x : Math.floor(Math.random() * 360),
			MeteorY: 680,
			sprite: null
		};

		var randNum = Math.floor(Math.random() * 4);
		var sprite = cc.Sprite.create(s_shield_png);

		obj.sprite = sprite;

		this.items.push(obj);
	},

	createHp: function(x) {
		cc.log("hp");
		var obj = {
			currentAngle: 0,
			isShield: false,
			isHp: true,

			dropSpeed: 4,
			MeteorX: x ? x : Math.floor(Math.random() * 360),
			MeteorY: 680,
			sprite: null
		};

		var randNum = Math.floor(Math.random() * 4);
		var sprite = cc.Sprite.create(s_life_png);

		obj.sprite = sprite;

		this.items.push(obj);
	},

	update: function() {
		for(var i = 0; i < this.items.length; i++) {
			this.items[i].currentAngle += 3;
			if(this.items[i].currentAngle >= 360)
				this.items[i].currentAngle -= 360;

			this.items[i].sprite.setRotation(this.items[i].currentAngle);

			this.items[i].MeteorY -= this.items[i].dropSpeed;
			var dx = this.items[i].MeteorX - GameData.playerX;
			var x  = GameData.planetCenterX + Math.cos(Math.PI / 180 * (dx < 0 ? dx + 360 : dx)) * this.items[i].MeteorY;
			var y  = GameData.planetCenterY + Math.sin(Math.PI / 180 * (dx < 0 ? dx + 360 : dx)) * this.items[i].MeteorY;

			console.debug(x, y);

			this.items[i].sprite.setPosition(cc.p(x, y));
			if(this.items[i].MeteorY < 163) {
				GameData.gameScene.collidePlanet(this);
			} else if(GameData.gameScene.isShield && Math.pow(GameData.shieldX - x, 2) + Math.pow(GameData.shieldY - y, 2) < 1600) {
				if(!(this.items[i].isShield || this.items[i].isHp)) {
					GameData.gameScene.collideShield(this);
				} else {
					GameData.gameScene.collideItem(this);
				}
			} else if(x > GameData.playerRectX1 && x < GameData.playerRectX2 &&
				y > GameData.playerRectY1 && y < GameData.playerRectY2) {
				if(!(this.items[i].isShield || this.items[i].isHp)) {
					GameData.gameScene.collidePlayer(this);
				} else {
					GameData.gameScene.collideItem(this);
				}
			}
		}
	}
};