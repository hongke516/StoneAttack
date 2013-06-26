var GameLayer = cc.Layer.extend
({
    isMouseDown:false,

	isShield:false,
	time:0,
	currentCombo:0,
	deltaComboNum:0,
	realMeteorScore:0,
	currentHP:0,
	preLevelScore:0,
	preLevelUpNeed:0,

    runMode:0, // int    
    currentRunAnimation:0, // int
    runReverse:false, // bool
    remainGameOverCoolTime:0,
    
    stateBarWidth:0.0,
    stateBarHeight:0.0,
    remainShieldHp:0,
    remainShieldCoolTime:0,
    remainShieldCoolTimeMax:0,
    remainShieldHpMax:0,
    remainHitCoolTime:0,
    
    bgmSettingChanged:false,
    isHighestScore:false,

	arrayMeteorites:[],
	arrayMeteorMaker:[],

	sprCharacter:null, // CCSprite
	sprPlanet:null, // CCSprite			
	sprBgmNumber:null, // CCSprite
	sprBackground:null,
	sprHpBar:null,
	sprHpFrame:null,
	
	layerParticle:null,
	labelCombo:null,
	labelComboNum:null,
	labelComboMul:null,
	labelScore:null,
	layerCombo:null,
	layerColorFlash:null,
	labelScoreSpell:null,
	menuBtnPause:null,
	menuItemPause:null,
	menuStatePause:null,
	layerPauseMenu:null,
	sprPauseLabel:null,
	
	sprShield:null,
	layerOptionBox:null, // CCLayerColor
	menuBtnSetting:null, // CCMenu
	layerBgmChoice:null, // CCLayer
	// sprLeftController:null,
	// sprRightController:null,
	layerGameOver:null,
	sprHighestScore:null,
//array.splice(2,1) array.length, array.push, array[0]
    init:function ()
    {
//        var selfPointer = this;
        // 1. super init first
        this._super();
		GameData.gameScene = this;
		
	    GameData.gameState = GameData.STATE_PLAYING;
	    	    
	    this.initEtc();
	    this.initPlayerState();
	    //    this.initLayerRotate();
	    this.initSpriteBackground();
	    this.initBtnPause();
	    this.initMenuItemBtnPause();
	    this.initSpritePlanet();
	    this.initSpriteCharacter();
	    this.initSpriteShield();
	    
	    this.initSpriteStateBar();
	    this.initBMFont();
	    this.initLayerParticle();
//	    this.initLayerFlash();
	    this.initOptionBox();
	    this.initGameover();

//	    this.schedule(this.update);
	    
	    if(GameData.isHardCore)
	    {
	        MeteorMaker.makeCoolTime = 15;
	        MeteorSprite.minDropSpeed = 8;
	        MeteorSprite.maxDropSpeed = 9;
	    }
	    else
	    {
	        MeteorMaker.makeCoolTime = 25;
	        MeteorSprite.minDropSpeed = 2;
	        MeteorSprite.maxDropSpeed = 4;
	    }
	    
//	    this.startGame();		
		
		this.setKeyboardEnabled(true);
        this.setTouchEnabled(true);
        return true;
    },

    /*
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
   
    initSpriteBackground:function()
    {
    	var sprBackground = cc.Sprite.create(s_GameScene_background_png);
    	sprBackground.setScale(1.5);
    	sprBackground.setPosition(cc.p(GameData.planetCenterX, 300));
    	this.addChild(sprBackground, 1);	
    },
	
    initSpritePlanet:function()
    {
    	this.sprPlanet = cc.Sprite.create(s_planet_png);
    	this.sprPlanet.setPosition(cc.p(GameData.planetCenterX, GameData.playerCenterY));
    	this.sprPlanet.setRotation(GameData.playerX);
    	this.addChild(this.sprPlanet, 8);
    },
	
    initSpriteCharacter:function()
    {
    	this.sprCharacter = cc.Sprite.create(s_player_stand_png);
    	this.sprCharacter.setScale(0.75);
    	this.sprCharacter.setPosition(cc.p(GameData.planetCenterX, GameData.planetCenterY + 177));
    	this.addChild(this.sprCharacter, 4);
    },
	
	initSpriteStateBar:function()
	{
	    this.sprHpBar = cc.Sprite.create(s_gauge_png);
	    this.sprHpBar.setPosition(ccp(420, GameData.planetCenterY + 115));
	    this.sprHpBar.setAnchorPoint(ccp(0, 0));
	    this.sprHpBar.setScale(0.33);
	    this.sprHpBar.setVisible(false);
	    this.addChild(this.sprHpBar, 8);
	    
	    this.sprHpFrame = cc.Sprite.create(s_gaugebar_png);
	    this.sprHpFrame.setPosition(ccp(395, GameData.planetCenterY + 115));
	    this.sprHpFrame.setAnchorPoint(ccp(0, 0));
	    this.sprHpFrame.setScale(0.33);
	    this.sprHpFrame.setVisible(false);
	    this.addChild(this.sprHpFrame, 8);
	    /*
	     sprMpBar = CCSprite::create("MpGauge.png");
	     sprMpBar.setPosition(ccp(500, 320));
	     sprMpBar.setAnchorPoint(ccp(0, 0));
	     this.addChild(sprMpBar);
	     */
	    var barSize = this.sprHpBar.getContentSize();
	    this.stateBarWidth = barSize.width;
	    this.stateBarHeight = barSize.height;
	},
	
	initBMFont:function()
	{
	    this.layerCombo = cc.Layer.create();
	    
	    this.labelCombo = cc.LabelBMFont.create("Combo", s_bmfontCB64_fnt);
	    this.labelCombo.setPosition(ccp(GameData.planetCenterX, GameData.planetCenterY + 75));
	    this.labelCombo.setColor(cc.c3b(255, 255, 0));
	    this.layerCombo.addChild(this.labelCombo);
	    
	    this.labelComboNum = cc.LabelBMFont.create("", s_bmfontCB64_fnt);
	    this.labelComboNum.setPosition(ccp(GameData.planetCenterX, GameData.planetCenterY));
	    this.labelComboNum.setColor(cc.c3b(255, 255, 0));
	    this.layerCombo.addChild(this.labelComboNum);
	    
	    this.labelComboMul = cc.LabelBMFont.create("", s_bmfontCB64_fnt);
	    this.labelComboMul.setPosition(ccp(843, 520));
	    this.labelComboMul.setVisible(false);
	    
	    this.layerCombo.addChild(this.labelComboMul);
	    this.layerCombo.setVisible(false);
	    
	    this.addChild(this.layerCombo, 8);	    
	    
	    this.labelScore = cc.LabelBMFont.create("0", s_bmfontCB64_fnt);
	    this.labelScore.setPosition(ccp(765, 570));
	    this.labelScore.setColor(cc.c3b(255, 255, 255));
	    this.labelScore.setScale(0.7);
	    this.labelScore.setAnchorPoint(ccp(1.0, 0.5));
	    this.addChild(this.labelScore, 8);
	    
	    this.labelScoreSpell = cc.LabelBMFont.create("Score", s_bmfontCB64_fnt);
	    this.labelScoreSpell.setPosition(ccp(880, 565));
	    this.labelScoreSpell.setColor(cc.c3b(255, 255, 255));
	    this.labelScoreSpell.setScale(0.55);
	    this.labelScoreSpell.setAnchorPoint(ccp(1.0, 0.5));
	    this.addChild(this.labelScoreSpell, 8);
	},
	
	initLayerParticle:function()
	{
	    this.layerParticle = cc.Layer.create();
	    this.layerParticle.setAnchorPoint(ccp(0.5, 1.0 / 600 * GameData.planetCenterY));
	    this.layerParticle.setRotation(GameData.playerX);
	    this.addChild(this.layerParticle, 5);
	},
	
	initLayerFlash:function()
	{
	    this.layerColorFlash = cc.LayerColor.create();
	    this.addChild(this.layerColorFlash, 9);
	},
	
	initBtnPause:function()
	{
	    this.menuItemPause = cc.MenuItemImage.create(s_pausebutton_png, s_pausebuttonpressed_png, this.clickBtnPause, this);
	    
	    this.menuBtnPause = cc.Menu.create(this.menuItemPause, null);
	    
	    this.menuBtnPause.setPosition(ccp(70, 530));
	    this.addChild(this.menuBtnPause, 10);
	},
	
	initMenuItemBtnPause:function()
	{	    
	    var menuItemResume = cc.MenuItemImage.create(s_menu2_1_png, s_menu2_1_off_png, this.clickBtnResume, this);
	    var menuItemRestart = cc.MenuItemImage.create(s_menu2_2_png, s_menu2_2_off_png, this.clickBtnRestart, this);
	    var menuItemExit = cc.MenuItemImage.create(s_menu2_3_png, s_menu2_3_off_png, this.clickBtnExit, this);
	    
	    
	    
	    menuItemResume.setScale(0.7);
	    menuItemExit.setScale(0.7);
	    menuItemRestart.setScale(0.7);
	    var menuItemSetting = cc.MenuItemImage.create(s_setting_png, s_setting_pressed_png, this.clickBtnOption, this);
	    menuItemSetting.setScale(0.8);
	    this.menuBtnSetting = cc.Menu.create(menuItemSetting, null);
	    this.menuBtnSetting.setPosition(ccp(830, 530));
	    	    
	    this.menuStatePause = cc.Menu.create(menuItemResume, menuItemRestart, menuItemExit, null);
	    this.menuStatePause.alignItemsVerticallyWithPadding(7);
	    this.menuStatePause.setPosition(ccp(0, 0));
	    this.menuStatePause.setPosition(ccp(450, 155));
	    
	    this.sprPauseLabel = cc.Sprite.create(s_pause_png);
	    this.sprPauseLabel.setPosition(ccp(450, 400));
	    this.sprPauseLabel.setScale(0.9);
	    
	    this.layerPauseMenu = cc.LayerColor.create(cc.c3b(0, 0, 0));
	    this.layerPauseMenu.setOpacity(100);
	    this.layerPauseMenu.addChild(this.sprPauseLabel);
	    this.layerPauseMenu.addChild(this.menuStatePause);
	    this.layerPauseMenu.addChild(this.menuBtnSetting);
	    
	    this.layerPauseMenu.setVisible(false);
	    this.addChild(this.layerPauseMenu, 10);
	},
	
	initSpriteShield:function()
	{
	    this.remainShieldCoolTimeMax = 360;	    
	    this.sprShield = cc.Sprite.create(s_shieldcircle_png);
	    this.sprShield.setPosition(ccp(GameData.shieldX, GameData.shieldY));
	    this.sprShield.setOpacity(195);
	    this.sprShield.setScale(0);
	    this.addChild(this.sprShield, 5);
	    this.sprShield.setVisible(false);
	},
	
    initOptionBox:function()
    {
	    this.layerOptionBox = cc.LayerColor.create();
	    this.layerOptionBox.setColor(cc.c3b(0, 0, 0));
	    this.layerOptionBox.setOpacity(100);
	    this.layerOptionBox.setVisible(false);
	    
	    var sprOptionBox = cc.Sprite.create(s_settingPanel_png);
	    sprOptionBox.setPosition(cc.p(450, 270));
	    this.layerOptionBox.addChild(sprOptionBox);
	    
	    var sprOptionTitle = cc.Sprite.create(s_settingTitle_png);
	    sprOptionTitle.setPosition(cc.p(600, 470));
	    this.layerOptionBox.addChild(sprOptionTitle);
	    
	    var menuItemOptionExit = cc.MenuItemImage.create(s_x_png, s_xpushed_png, this.clickOptionExit, this);
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
	    var menuItemBgmChoiceLeft = cc.MenuItemImage.create(s_settingwindow_btn_left_on_png, s_settingwindow_btn_left_off_png, this.clickOptionBgmLeft, this);
	    var menuItemBgmChoiceRight = cc.MenuItemImage.create(s_settingwindow_btn_right_on_png, s_settingwindow_btn_right_off_png, this.clickOptionBgmRight, this);
	    var menuBgmChoiceLeft = cc.Menu.create(menuItemBgmChoiceLeft, null);
	    var menuBgmChoiceRight = cc.Menu.create(menuItemBgmChoiceRight, null);
	    
	    menuItemBgmChoiceLeft.setScale(0.65);
	    menuItemBgmChoiceRight.setScale(0.65);
	    menuBgmChoiceLeft.setPosition(cc.p(320, /*255*/260));
	    menuBgmChoiceRight.setPosition(cc.p(580, /*255*/263));
	    
	    switch(GameData.currentBgmNumber)
	    {
	        case 0:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm_random_png);
	            break;
	        case 1:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm1_normal_png);
	            break;
	        case 2:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm2_normal_png);
	            break;
	        case 3:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm3_normal_png);
	            break;
	        case 4:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm4_normal.png);
	            break;
	        case 5:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm1_fast_png);
	            break;
	        case 6:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm1_fast_png);
	            break;
	        case 7:
	            this.sprBgmNumber = cc.Sprite.create(s_bgm3_fast_png);
	            break;
	    }
	    this.sprBgmNumber.setPosition(cc.p(450, /*255*/260));
	    this.sprBgmNumber.setScale(0.7);
	    
	    this.layerBgmChoice.addChild(menuBgmChoiceLeft);
	    this.layerBgmChoice.addChild(menuBgmChoiceRight);
	    this.layerBgmChoice.addChild(this.sprBgmNumber);
	    
	    
	    var sprOptionSE = cc.Sprite.create(s_sound_effect_png);
	    sprOptionSE.setPosition(cc.p(340, /*255*/145));
	    sprOptionSE.setScale(0.9);
	    this.layerOptionBox.addChild(sprOptionSE);
	    
	    /*
	    CCSprite* sprOptionVibration = CCSprite::create("vibration.png");
	    sprOptionVibration.setPosition(ccp(340, 145));
	    sprOptionVibration.setScale(0.9f);
	    layerOptionBox.addChild(sprOptionVibration);
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
	    
	    if(GameData.isSoundEffect)
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
	    
	    var toggle1 = cc.MenuItemToggle.create(/*this, this.clickOptionMusic,*/ btn1_1, btn1_2, this.clickOptionMusic/*null*/, this);
	    var toggle2 = cc.MenuItemToggle.create(/*this, this.clickOptionSE,*/ btn2_1, btn2_2, this.clickOptionSE/*null*/, this);
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
	    
	    var menuItemSetting = cc.MenuItemImage.create(s_setting_png, s_setting_pressed_png, this.clickBtnOption, this);
	    menuItemSetting.setScale(0.8);
	    this.menuBtnSetting = cc.Menu.create(menuItemSetting, null);
	    this.menuBtnSetting.setPosition(cc.p(830, 530));
	    if(GameData.gameState == GameData.STATE_INTRO)
	    {
	        this.menuBtnSetting.setOpacity(0);
	        this.menuBtnSetting.setEnabled(false);
	    }
	    this.addChild(this.menuBtnSetting);
    },

	initGameover:function()
	{
	    this.layerGameover = cc.Layer.create();
	    
	    var sprGameover = cc.Sprite.create(s_gameover_png);
	    sprGameover.setPosition(ccp(450, 355));
	    sprGameover.setScale(1.2);
	    this.layerGameover.addChild(sprGameover);
	    this.layerGameover.setVisible(false);
	    
	    this.addChild(this.layerGameover, 9);
	},
	
	initEtc:function()
	{
	    this.deltaComboNum = 1;
	    this.realMeteorScore = 0;
	    this.preLevelUpNeed = 1;
	    this.preLevelScore = 0;
	    this.isHighestScore = false;
	    this.touchCount = 0;
	    this.remainGameOverCoolTime = 60;
	    this.time = 0;
	    
	    this.currentCombo = 0;
	    
	    this.sprHighestScore = cc.Sprite.create(GameData.isHardCore ? s_highscore_hard_png : s_highscore_png);
	    this.sprHighestScore.setPosition(ccp(450, 170));
	    this.sprHighestScore.setScale(0.45);
	    this.sprHighestScore.setVisible(false);
	    this.addChild(this.sprHighestScore, 9);
	},
	
	initPlayerState:function()
	{
	    this.currentHP = GameData.HP_MAX;
	    this.runMode = 0;
	    this.currentRunAnimation = 0;
	    this.runReverse = false;
	    //    isMagnet = true;
	}	
});

var GameScene = cc.Scene.extend
({
    onEnter:function ()
    {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
    }
});

