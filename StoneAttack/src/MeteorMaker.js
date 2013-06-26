var MeteorMaker = cc.Class.extend({
	// public
	currentX: 0,
	isRightDirection: true,
	makeCoolTime: 25,

	// private
	_currentCoolTime: 0,

	update: function() {
		this.isRightDirection = Math.floor(Math.random() * 100 % 5) == 0 ? !this.isRightDirection : isRightDirection;

		this.currentX += this.isRightDirection ? 10 : -10;
		this.currentX += this.currentX >= 360 ? -360 : ( this.currentX < 0 ? 360 : 0 );

		this._currentCoolTime++;
		if(this.makeCoolTime <= this._currentCoolTime) {
			this._currentCoolTime = 0;
			this.newInstance(this.currentX);
		}
	},

	newInstance: function(currentX) {
		gameData.gameScene.makeMeteor(currentX);
	},

	create: function(x) {
		var pobInstance = new MeteorMaker(x ? x : Math.floor(Math.random() * 1000 % 360));
		if(pobInstance) {
			return pobInstance;
		}

		delete pobInstance;
		return null;
	}
});
