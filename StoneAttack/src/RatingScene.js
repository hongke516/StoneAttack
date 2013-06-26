var RatingLayer = cc.Layer.extend
({
    isMouseDown:false,

    init:function ()
    {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.Director.getInstance().getWinSize();

		var layerColor = cc.LayerColor.create();
		layerColor.setColor(cc.c3b(255, 255, 255));
		this.addChild(layerColor);
		
		var labelText = cc.LabelTTF.create("이 게임물은 전체이용가 게임물입니다.", "맑은 고딕", 40);
		labelText.setPosition(cc.p(size.width / 2, size.height / 2));
		labelText.setColor(cc.c3b(0, 0, 0));
		layerColor.addChild(labelText);

		var spriteRating = cc.Sprite.create("res/All_Rating_300.png");
		spriteRating.setPosition(cc.p(832, 520));
		spriteRating.setScale(0.5);
//		spriteRating.setOpacity(50); // cc.FadeTo.create(0.01,0)
		layerColor.addChild(spriteRating);
        this.setTouchEnabled(true);
        
        this.schedule(this.nextScene, 0.0, false, 2.0);
        
        GameCache.load();
        
        return true;
    },
    
    nextScene:function()
    {
		var scene = cc.TransitionFade.create(0.3, new MenuScene()); 		
		cc.Director.getInstance().replaceScene(scene);
    }/*,
    
    // a selector callback
    menuCloseCallback:function (sender)
    {
        cc.Director.getInstance().end();
    },
    onTouchesBegan:function (touches, event)
    {
        this.isMouseDown = true;
    },
    onTouchesMoved:function (touches, event)
    {
        if (this.isMouseDown)
        {
            if (touches)
            {
                //this.circle.setPosition(cc.p(touches[0].getLocation().x, touches[0].getLocation().y));
            }
        }
    },
    onTouchesEnded:function (touches, event)
    {
        this.isMouseDown = false;
    },
    onTouchesCancelled:function (touches, event)
    {
        console.log("onTouchesCancelled");
    }
    */
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

