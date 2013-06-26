var ParticleExplosionSprite = cc.Sprite.extend({
	// private
	fileName: '',
	vectorX: 0, vectorY: 0,
	opacityTime: 0, deltaOpacity: 0,
	currentAngle: 0,

	// Constructor
	construct: function(point) { // point = cc.Point (cc.p)
		this.vectorX = Math.round(Math.floor(Math.random() * 1000 % 100) - 50 / 50);
		this.vectorY = Math.round(Math.floor(Math.random() * 1000 % 100) - 50 / 50);
		this.currentAngle = Math.floor(Math.random() * 1000 % 360);
		this.opacityTime = 150;
		this.deltaOpacity = 8;

		this.setPosition(point);
		this.setRotation(this.currentAngle);
		this.setVisible(false);
	},

	createWithPoint: function(fileName, point) {
		var pSprite = new ParticleExplosionSprite();
		pSprite.construct();
		if(pSprite && pSprite.initWithFile(fileName)) {
			return pSprite;
		}

		delete pSprite;
		return null;
	},

	updatePoint: function() {
		if(GameData.gameState == GameData.STATE_PAUSE) return;
		
		this.opacityTime -= this.deltaOpacity;
		if(this.opacityTime <= 0) {
        	//unschedule(schedule_selector(ParticleExplosionSprite::updatePoint));
			this.unschedule(this.updatePoint);
			this.removeFromParentAndCleanup(true);
			return;
		}

		this.setOpacity(this.opacityTime);
		this.setPosition(cc.p(this.getPositionX() + this.vectorX, this.getPositionY() + this.vectorY));
		this.currentAngle += 5;
		if(this.currentAngle >= 360) this.currentAngle -= 360;
		this.setRotation(this.currentAngle);
	},

	setDeltaOpacity: function(deltaOpacity) {
		this.deltaOpacity = deltaOpacity;
	},

	start: function() {
		this.setVisible(true);
		this.setOpacity(this.opacityTime);
		this.schedule(this.updatePoint);
	}
});