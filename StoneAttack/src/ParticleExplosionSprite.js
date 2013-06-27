var ParticleExplosionSprite = {
	items: [],

	createWithPoint: function(fileName, point) {
		var obj = {
			fileName: '',
			vectorX: Math.floor(Math.random() *  100 - 50) / 50.0, 
			vectorY: Math.floor(Math.random() *  100 - 50) / 50.0,
			opacityTime: 150, deltaOpacity: 8,
			currentAngle: Math.floor(Math.random() * 360),
			sprite: null
		};

		var sprite = cc.Sprite.create(fileName);
		sprite.setPosition(point);
		sprite.setRotation(obj.currentAngle);
		// sprite.setVisible(false);
//		cc.log("aa " + sprite.getPositionX() + " " + sprite.getPositionY());
		
		if(fileName == s_shield_particle_png)
		{
			obj.deltaOpacity = 10;
		}
		
		obj.sprite = sprite;
		this.items.push(obj);

		this.start();		
		// return this;
	},

	updatePoint: function()
	{
		// cc.log(this.items.length);
		if(GameData.gameState == GameData.STATE_PAUSE)
		{
			return;
		}
		for(var i = 0; i < this.items.length; i++)
		{
			this.items[i].opacityTime -= this.items[i].deltaOpacity;
			if(this.items[i].opacityTime <= 0)
			{
				this.items[i].sprite./*removeFromParentAndCleanup*/removeFromParent(true);
				this.items[i] = null;
				continue;
			}

			// this.items[i].sprite.setOpacity(this.items[i].opacityTime);
			this.items[i].sprite.setPosition(cc.p(this.items[i].sprite.getPositionX() + this.items[i].vectorX,this.items[i].sprite.getPositionY() + this.items[i].vectorY));
			// this.items[i].sprite.setPosition(cc.p(450, 300));
			this.items[i].currentAngle += 5;
			if(this.items[i].currentAngle >= 360)
			{
				this.items[i].currentAngle -= 360;
			}
			this.items[i].sprite.setRotation(this.items[i].currentAngle);
		}
		
		this.items = this.items.filter(function(value)
		{
			return value == null ? false : true;
		});
	},

	start: function()
	{
		var i = this.items.length - 1;

		// this.items[i].sprite.setVisible(true);
		this.items[i].sprite.setOpacity(this.items[i].opacityTime);
	}
};