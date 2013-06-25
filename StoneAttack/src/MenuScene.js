var MenuLayer = cc.Layer.extend
({
    isMouseDown:false,
    
    currentAngle:0, // int
    runMode:0, // int
    
    currentRunAnimation:0, // int
    runReverse:false, // bool
    isOptionalPanel:false, // bool
    
    titleDeltaX1:0.0, // float
    titleDeltaX2:0.0, // float
    titleDeltaY1:0.0, // float
    titleDeltaY2:0.0, // float
    remainFrame:0, // int
    labelToStartPeriod:0, // int
    
    strVersion:'ver 1.7', // string
    labelTouchAnywhereToStart:null, // CCLabelBMFont -> CCLabelTTF
    labelVersion:null, // CCLabelBMFont
    
    menu1:null, // CCMenu
    menu2:null, // CCMenu
    menu3:null, // CCMenu
    menu4:null, // CCMenu            

	sprCharacter:null, // CCSprite
	sprPlanet:null, // CCSprite
	sprTitle1:null, // CCSprite
	sprTitle2:null, // CCSprite
	layerOptionBox:null, // CCLayerColor
	menuBtnSetting:null, // CCMenu
	layerBgmChoice:null, // CCLayer
	sprBgmNumber:null, // CCSprite
	labelBalloon:null, // CCLabelTTF
	
	layerMenu:null, // CCLayer
	layerRecord:null, // CCLayer	

    init:function ()
    {
        var selfPointer = this;
        //////////////////////////////
        // 1. super init first
        this._super();

		// FileIO::sharedInstance()->readFile();
		if(GameData.gameState == GameData.STATE_INTRO)
		{
			this.schedule(this.startBackgroundMusic, 0, false, 0.3);
			this.initLabelTouchAnywhere();
			this.schedule(this.updateLabelToStart);
		}
		else if(GameData.isHardCore)
		{
			this.currentAngle = 270;
		}
		else
		{
			this.currentAngle = 0;
		}
		
		// MeteorSprite::initSinCosTable();
		this.initSpriteBackground();
		this.initSpriteCharacter();
		this.initSpritePlanet();
		this.initSpriteTitle();
		this.initOptionBox();
		this.initMenu();
		this.initRecord();
		this.initBalloon();
		
        this.setTouchEnabled(true);        
        return true;
    },
    
    nextScene:function()
    {	
    	GameLayer.playerX = this.currentAngle;
		cc.Director.getInstance().replaceScene(new GameScene());
    },
    
    clickHardcoreMode:function()
    {
    	GameData.isHardCore = true;
    	this.enableMenu(false);
    	this.nextScene();
    },
    
    clickNormalMode:function()
    {
    	
    },
    
    clickInfo:function()
    {
    	
    },
    
    clickRecord:function()
    {
    	
    },
    
    clickBtnOption:function()
    {
    	
    },
    
    clickBtnOption:function()
    {
    	
    },
    
    clickOptionMusic:function()
    {
    	
    },
    
    clickOptionExit:function()
    {
    	
    },
    
	clickOptionBgmLeft:function()
	{
		
	},
	
	clickOptionBgmRight:function()
	{
		
	},
	
	enableMenu/*True*/:function(bool)
	{
		
	},
	/*
	enableMenuFalse:function()
	{
		
	},
	*/
	leftGesture:function()
	{
		
	},
	
	rightGesture:function()
	{
		
	},
	
	updateLabelToStart:function()
	{
		
	},
	
	updateBalloon:function()
	{
		
	},
	
	updateCharAnimation:function()
	{
		
	},
	
    updateTitleAnimation:function()
    {
    	
    },
    
    updateRecordAnimation:function()
    {
    	
    },
    
    recordToMenu:function()
    {
    	
    },
    
    menuToRecord:function()
    {
    	
    },
    
	    
    
    
    
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
    },
    
    initLabelTouchAnywhere:function()
    {
    	this.labelTouchAnywhereToStart = cc.LabelBMFont.create("PRESS ANY KEY TO START", s_bmfontCB_fnt);
//		this.labelTouchAnywhereToStart = cc.LabelTTF.create('PRESS ANY KEY TO START', '나눔고딕', 32);
		this.labelTouchAnywhereToStart.setPosition(cc.p(450, 50));
		this.labelTouchAnywhereToStart.setColor(cc.c3b(255, 255, 255));
		this.labelToStartPeriod = 0;
		this.addChild(this.labelTouchAnywhereToStart, 8);
    },
    
    initSpriteTitle:function()
    {
    	this.sprTitle1 = cc.Sprite.create("res/newtitle1.png");
    	this.sprTitle2 = cc.Sprite.create("res/newtitle2.png");
    	
    	switch(GameData.gameState)
    	{
    		case GameData.STATE_INTRO:
    			this.sprTitle1.setPosition(cc.p(230, 480));
    			this.sprTitle2.setPosition(cc.p(630, 420));
    			this.sprTitle1.setScale(0.6);
    			this.sprTitle2.setScale(0.6);
    			break;
   			case GameData.STATE_MENU:
    			this.sprTitle1.setPosition(cc.p(400, 160));
    			this.sprTitle2.setPosition(cc.p(500, 90));
    			this.sprTitle1.setScale(0.25);
    			this.sprTitle2.setScale(0.25);   			
    			break;
    	}
    	
    	this.sprTitle1.setRotation(-5);
    	this.sprTitle2.setRotation(-5);
    	this.addChild(this.sprTitle1);
    	this.addChild(this.sprTitle2);    	
    },
    
    initSpriteBackground:function()
    {
    	var sprBackground = cc.Sprite.create("res/GameScene_background.png");
    	sprBackground.setScale(1.5);
    	sprBackground.setPosition(cc.p(450, 300));
    	this.addChild(sprBackground);	
    },
    
    initSpritePlanet:function()
    {
    	this.sprPlanet = cc.Sprite.create("res/planet.png");
    	this.sprPlanet.setPosition(cc.p(450, 100));
    	this.sprPlanet.setRotation(this.currentAngle);
    	this.addChild(this.sprPlanet);
    },
    
    initSpriteCharacter:function()
    {
    	this.sprCharacter = cc.Sprite.create("res/player_stand.png");
    	this.sprCharacter.setScale(0.75);
    	this.sprCharacter.setPosition(cc.p(450, 277));
    	this.addChild(this.sprCharacter);
    },
    
    initMenu:function()
    {
	    this.layerMenu = cc.Layer.create();
	    
	    var menuItem1 = cc.MenuItemImage.create(s_menu1_on_png, s_menu1_off_png, this, this.clickNormalMode);
	    this.menu1 = cc.Menu.create(menuItem1, null);
	    
	    var menuItem2 = cc.MenuItemImage.create("res/menu2_on.png", "res/menu2_off.png", this, this.clickHardcoreMode);
	    this.menu2 = cc.Menu.create(menuItem2, null);
	    
	    var menuItem3 = cc.MenuItemImage.create("res/menu3_on.png", "res/menu3_off.png", this, this.clickRecord);
	    this.menu3 = cc.Menu.create(menuItem3, null);
	    
	    var menuItem4 = cc.MenuItemImage.create("res/menu_info_on.png", "res/menu_info_off.png", this, this.clickInfo);
	    this.menu4 = cc.Menu.create(menuItem4, null);

	    var angle = 360 - this.currentAngle;
	    if(angle == 360)
	    {
	        angle = 0;
	    }
	    
	    this.menu1.setPosition(cc.p(450 + 300 * GameData.cosTable[90 + angle >= 360 ? -270 + angle : 90 + angle],
	    	 100 + 300 * GameData.sinTable[90 + angle >= 360 ? -270 + angle : 90 + angle]));
	    this.menu2.setPosition(cc.p(450 + 300 * GameData.cosTable[angle],
	    	 100 + 300 * GameData.sinTable[angle]));
	    this.menu3.setPosition(cc.p(450 + 300 * GameData.cosTable[180 + angle >= 360 ? -180 + angle : 180 + angle],
	    	 100 + 300 * GameData.sinTable[180 + angle >= 360 ? -180 + angle : 180 + angle]));
	    this.menu4.setPosition(cc.p(450 + 300 * GameData.cosTable[270 + angle >= 360 ? -90 + angle : 270 + angle],
	    	 100 + 300 * GameData.sinTable[270 + angle >= 360 ? -90 + angle : 270 + angle]));
	    
//	    this.labelVersion = cc.LabelBMFont.create(this.strVersion/*"ver 1.7"*/, "res/bmfontCB.fnt");;
		this.labelVersion = cc.LabelTTF.create(this.strVersion, '나눔고딕', 32);
	    this.labelVersion.setPosition(cc.p(830, 570));
	    this.labelVersion.setColor(cc.c3b(255, 255, 255));
	    this.labelVersion.setVisible(false);
	    
	    this.menu1.setOpacity(100);
	    
	    if(GameData.gameState == GameData.STATE_INTRO)
	    {
	        this.menu1.setOpacity(0);
	        this.menu2.setOpacity(0);
	        this.menu3.setOpacity(0);
	        this.menu4.setOpacity(0);
	        
	        this.menu1.setEnabled(false);
	        this.menu2.setEnabled(false);
	        this.menu3.setEnabled(false);
	        this.menu4.setEnabled(false);
	    }
	    else
	    {
	        this.menu1.setOpacity(255);
	        this.menu2.setOpacity(255);
	        this.menu3.setOpacity(255);
	        this.menu4.setOpacity(255);
	    }
	    
	    this.layerMenu.addChild(this.menu1);
	    this.layerMenu.addChild(this.menu2);
	    this.layerMenu.addChild(this.menu3);
	    this.layerMenu.addChild(this.menu4);
	    
	    this.addChild(this.labelVersion);
	    this.addChild(this.layerMenu);   	
    },
    
    initOptionBox:function()
    {
	    this.layerOptionBox = cc.LayerColor.create();
	    this.layerOptionBox.setColor(cc.c4b(0, 0, 0, 100));
	    this.layerOptionBox.setVisible(false);
	    
	    var sprOptionBox = cc.Sprite.create(s_settingPanel_png);
	    sprOptionBox.setPosition(cc.p(450, 270));
	    this.layerOptionBox.addChild(sprOptionBox);
	    
	    var sprOptionTitle = cc.Sprite.create(s_settingTitle_png);
	    sprOptionTitle.setPosition(cc.p(600, 470));
	    this.layerOptionBox.addChild(sprOptionTitle);
	    
	    var menuItemOptionExit = cc.MenuItemImage.create(s_x_png, s_xpushed_png, this, this.clickOptionExit);
	    menuItemOptionExit.setScale(0.7);
	    var menuOptionExit = cc.Menu.create();
	    menuOptionExit.addChild(menuItemOptionExit);
	    menuOptionExit.setPosition(cc.p(220, 450));
	    this.layerOptionBox.addChild(menuOptionExit);
	    
	    var sprOptionBGM = cc.Sprite.create(s_bgm_png);
	    sprOptionBGM.setPosition(cc.p(340, 370));
	    sprOptionBGM.setScale(0.9);
	    this.layerOptionBox.addChild(sprOptionBGM);
	    
	    this.layerBgmChoice = cc.Layer.create();
	    var menuItemBgmChoiceLeft = cc.MenuItemImage.create(s_settingwindow_btn_left_on_png, s_settingwindow_btn_left_off_png, this, this.clickOptionBgmLeft);
	    var menuItemBgmChoiceRight = cc.MenuItemImage.create(s_settingwindow_btn_right_on_png, s_settingwindow_btn_right_off_png, this, this.clickOptionBgmRight);
	    var menuBgmChoiceLeft = cc.Menu.create(menuItemBgmChoiceLeft, null);
	    var menuBgmChoiceRight = cc.Menu.create(menuItemBgmChoiceRight, null);
	    menuItemBgmChoiceLeft.setScale(0.65);
	    menuItemBgmChoiceRight.setScale(0.65);
	    menuBgmChoiceLeft.setPosition(cc.p(320, /*255*/260));
	    menuBgmChoiceRight.setPosition(cc.p(580, /*255*/263));
	    
	    switch(GameData.currentBgmNumber)
	    {
	        case 0:
	            sprBgmNumber = cc.Sprite.create(s_bgm_random_png);
	            break;
	        case 1:
	            sprBgmNumber = cc.Sprite.create(s_bgm1_normal_png);
	            break;
	        case 2:
	            sprBgmNumber = cc.Sprite.create(s_bgm2_normal_png);
	            break;
	        case 3:
	            sprBgmNumber = cc.Sprite.create(s_bgm3_normal_png);
	            break;
	        case 4:
	            sprBgmNumber = cc.Sprite.create(s_bgm4_normal.png);
	            break;
	        case 5:
	            sprBgmNumber = cc.Sprite.create(s_bgm1_fast_png);
	            break;
	        case 6:
	            sprBgmNumber = cc.Sprite.create(s_bgm1_fast_png);
	            break;
	        case 7:
	            sprBgmNumber = cc.Sprite.create(s_bgm3_fast_png);
	            break;
	    }
	    sprBgmNumber.setPosition(cc.p(450, /*255*/260));
	    sprBgmNumber.setScale(0.7);
	    
	    this.layerBgmChoice.addChild(menuBgmChoiceLeft);
	    this.layerBgmChoice.addChild(menuBgmChoiceRight);
	    this.layerBgmChoice.addChild(sprBgmNumber);
	    
	    
	    var sprOptionSE = cc.Sprite.create(s_sound_effect_png);
	    sprOptionSE.setPosition(cc.p(340, /*255*/145));
	    sprOptionSE.setScale(0.9);
	    this.layerOptionBox.addChild(sprOptionSE);
	    
	    /*
	    CCSprite* sprOptionVibration = CCSprite::create("vibration.png");
	    sprOptionVibration->setPosition(ccp(340, 145));
	    sprOptionVibration->setScale(0.9f);
	    layerOptionBox->addChild(sprOptionVibration);
	    */
	   
	    var btn1_1;
	    var btn1_2;
	    var btn2_1;
	    var btn2_2;
//	    var btn3_1;
//	    var btn3_2;
	    
	    if(GameData.isMusicSound)
	    {
	        btn1_1 = cc.MenuItemImage.create(s_on_png, s_off_png);
	        btn1_2 = cc.MenuItemImage.create(s_off_png, s_on_png);
	    }
	    else
	    {
	        btn1_2 = cc.MenuItemImage.create(s_on_png, s_off_png);
	        btn1_1 = cc.MenuItemImage.create(s_off_png, s_on_png);
	        this.layerBgmChoice.setVisible(false);
	    }
	    
	    if(GameData.isEffectSound)
	    {
	        btn2_1 = cc.MenuItemImage.create(s_on_png, s_off_png);
	        btn2_2 = cc.MenuItemImage.create(s_off_png, s_on_png);
	    }
	    else
	    {
	        btn2_2 = cc.MenuItemImage.create(s_on_png, s_off_png);
	        btn2_1 = cc.MenuItemImage.create(s_off_png, s_on_png);
	    }
	    
	   /*
	    if(GameData::isVibrate)
	    {
	        btn3_1 = CCMenuItemImage::create("on.png", "off.png");
	        btn3_2 = CCMenuItemImage::create("off.png", "on.png");
	    }
	    else
	    {
	        btn3_2 = CCMenuItemImage::create("on.png", "off.png");
	        btn3_1 = CCMenuItemImage::create("off.png", "on.png");
	    }
	    */
	    btn1_1.setScale(0.5);
	    btn1_2.setScale(0.5);
	    btn2_1.setScale(0.5);
	    btn2_2.setScale(0.5);
	    // btn3_1.setScale(0.5);
	    // btn3_2.setScale(0.5);
	    
	    var toggle1 = cc.MenuItemToggle.create/*WithTarget*/(/*this, this.clickOptionMusic,*/ btn1_1, btn1_2, this.clickOptionMusic/*null*/, this);
	    var toggle2 = cc.MenuItemToggle.create/*WithTarget*/(/*this, this.clickOptionSE,*/ btn2_1, btn2_2, this.clickOptionSE/*null*/, this);
// //	    var toggle3 = CCMenuItemToggle::createWithTarget(this, menu_selector(MenuScene::clickOptionVibrate), btn3_1, btn3_2, NULL);

	    
	    var menuOptionSettingBGM = cc.Menu.create(toggle1, null);
	    var menuOptionSettingSE = cc.Menu.create(toggle2, null);
//	    var menuOptionSettingVibration =cc.Menu.create(toggle3, null);
	    menuOptionSettingBGM.setPosition(cc.p(530, 380));
	    menuOptionSettingSE.setPosition(cc.p(530, 150));
	    
	    this.layerOptionBox.addChild(menuOptionSettingBGM);
	    this.layerOptionBox.addChild(menuOptionSettingSE);
	    this.layerOptionBox.addChild(this.layerBgmChoice);
	
	    this.addChild(this.layerOptionBox, 10);
	    
	    var menuItemSetting = cc.MenuItemImage.create(s_setting_png, s_setting_pressed_png, this, this.clickBtnOption);
	    menuItemSetting.setScale(0.8);
	    this.menuBtnSetting = cc.Menu.create(menuItemSetting, null);
	    this.menuBtnSetting.setPosition(cc.p(830, 530));
	    if(GameData.gameState == GameData.STATE_INTRO)
	    {
	        this.menuBtnSetting.setOpacity(0);
	        this.menuBtnSetting.setEnabled(false);
	    }
	    this.addChild(this.menuBtnSetting);
    },//////asdf
    
    initRecord:function()
    {
    	
    },
    
    initBalloon:function()
    {
    	
    },
    
    initBalloonMessage:function()
    {
    	
    },
    
    changeBalloonMessage:function()
    {
    	
    },
    
    startSoundEffect:function()
    {
    	
    },
    
    startBackgroundMusic:function()
    {
    	
    },
    
    saveFile:function()
    {
    	
    }
    
    // keyBackClicked:function(){}
});

var MenuScene = cc.Scene.extend
({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});

