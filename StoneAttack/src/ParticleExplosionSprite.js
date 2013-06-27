var ParticleExplosionSprite = {
	items: [],

	createWithPoint: function(fileName, point) {
		var obj = {
			fileName: '',
			vectorX: Math.round(Math.floor(Math.random() *  100) - 50 / 50), 
			vectorY: Math.round(Math.floor(Math.random() *  100) - 50 / 50),
			opacityTime: 150, deltaOpacity: 8,
			currentAngle: Math.floor(Math.random() * 360),
			sprite: null
		};

		var sprite = cc.Sprite.create(fileName);
		sprite.setPosition(point);
		sprite.setRotation(obj.currentAngle);
		sprite.setVisible(false);
	},

	updatePoint: function() {
		if(GameData.gameState == GameData.STATE_PAUSE) return;

		for(var i = 0; i < this.items.length; i++) {
			this.items[i].opacityTime -= this.items[i].deltaOpacity;
			if(this.items[i].opacityTime <= 0) {
				this.items[i].sprite.removeFromParentAndCleanup(true);
				return;
			}

			this.items[i].sprite.setOpacity(this.items[i].opacityTime);
			this.items[i].sprite.setPosition(cc.p(this.items[i].sprite.getPositionX() + this.items[i].vectorX, this.items[i].sprite.getPositionY() + this.items[i].vectorY));
			this.items[i].currentAngle += 5;
			if(this.items[i].currentAngle >= 360) this.items[i].currentAngle -= 360;
			this.items[i].sprite.setRotation(this.items[i].currentAngle);
		}
	},

	start: function() {
		var i = this.items.length - 1;

		this.items[i].sprite.setVisible(true);
		this.items[i].sprite.setOpacity(this.items[i].opacityTime);
	}
};