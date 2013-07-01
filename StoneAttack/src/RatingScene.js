var RatingLayer = cc.Layer.extend
({
    isMouseDown:false,

    init:function ()
    {
        var selfPointer = this;
        this._super();
        
        var size = cc.Director.getInstance().getWinSize();

		var layerColor = cc.LayerColor.create();
		layerColor.setColor(cc.c3b(255, 255, 255));
		this.addChild(layerColor);
		
		var labelText = cc.LabelTTF.create("이 게임물은 전체이용가 게임물입니다.", "Malgun Gothic", 40);
		labelText.setPosition(cc.p(size.width / 2, size.height / 2));
		labelText.setColor(cc.c3b(0, 0, 0));
		layerColor.addChild(labelText);

		var spriteRating = cc.Sprite.create(s_All_Rating_300_png);
		spriteRating.setPosition(cc.p(832, 520));
		spriteRating.setScale(0.5);
		layerColor.addChild(spriteRating);
        this.setTouchEnabled(true);
        
        this.schedule(this.nextScene, 0.0, false, 2.0);
        
        GameCache.load();

        // // if(navigator.userAgent == 'Microsoft Internet Explorer')
		// if(window.chrome != undefined)
		// {
			// // cc.log("Fasds");
			// document.alert("로딩이 되지 않는다면, 다른 브라우저를 사용해주십시요.");	
		// }
		// else if(navigator.appName == 'Microsoft Internet Explorer')
		// {
			// cc.log("Fds");
		// }
		
        
        size = null;
        layerColor = null;
        labelText = null;
        spriteRating = null;
        return true;
    },
    
    nextScene:function()
    {
		var scene = cc.TransitionFade.create(0.3, new MenuScene()); 		
		cc.Director.getInstance().replaceScene(scene);
    }
});

var RatingScene = cc.Scene.extend
({
    onEnter:function () {
        this._super();
        var layer = new RatingLayer();
        layer.init();
        this.addChild(layer);
    }
});

