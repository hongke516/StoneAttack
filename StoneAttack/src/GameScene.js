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
        var selfPointer = this;
        // 1. super init first
        this._super();
		GameData.gameScene = this;
		
		
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
	
	initSpriteStateBar:function()
	{
	    this.sprHpBar = cc.Sprite.create(s_gauge_png);
	    this.sprHpBar.setPosition(ccp(420, planetCenterY + 115));
	    this.sprHpBar.setAnchorPoint(ccp(0, 0));
	    this.sprHpBar.setScale(0.33);
	    this.sprHpBar.setVisible(false);
	    this.addChild(sprHpBar, 8);
	    
	    sprHpFrame = CCSprite::create("gaugebar.png");
	    sprHpFrame.setPosition(ccp(395, planetCenterY + 115));
	    sprHpFrame.setAnchorPoint(ccp(0, 0));
	    sprHpFrame.setScale(0.33f);
	    sprHpFrame.setVisible(false);
	    this.addChild(sprHpFrame, 8);
	    /*
	     sprMpBar = CCSprite::create("MpGauge.png");
	     sprMpBar.setPosition(ccp(500, 320));
	     sprMpBar.setAnchorPoint(ccp(0, 0));
	     this.addChild(sprMpBar);
	     */
	    CCSize barSize = sprHpBar.getContentSize();
	    stateBarWidth = barSize.width;
	    stateBarHeight = barSize.height;
	},
	
	void GameScene::initBMFont()
	{
	    
	    layerCombo = CCLayer::create();
	    
	    labelCombo = CCLabelBMFont::create("Combo", "bmfontCB64.fnt");
	    labelCombo.setPosition(ccp(planetCenterX, planetCenterY + 75));
	    labelCombo.setColor(ccc3(255, 255, 0));
	    layerCombo.addChild(labelCombo);
	    
	    labelComboNum = CCLabelBMFont::create("", "bmfontCB64.fnt");
	    labelComboNum.setPosition(ccp(planetCenterX, planetCenterY));
	    labelComboNum.setColor(ccc3(255, 255, 0));
	    layerCombo.addChild(labelComboNum);
	    
	    labelComboMul = CCLabelBMFont::create("", "bmfontCB64.fnt");
	    labelComboMul.setPosition(ccp(843, 520));
	    labelComboMul.setVisible(false);
	    
	    layerCombo.addChild(labelComboMul);
	    layerCombo.setVisible(false);
	    
	    this.addChild(layerCombo, 8);	    
	    
	    labelScore = CCLabelBMFont::create("0", "bmfontCB64.fnt");;
	    labelScore.setPosition(ccp(765, 570));
	    labelScore.setColor(ccc3(255, 255, 255));
	    labelScore.setScale(0.7f);
	    labelScore.setAnchorPoint(ccp(1.0f, 0.5f));
	    this.addChild(labelScore, 8);
	    
	    labelScoreSpell = CCLabelBMFont::create("Score", "bmfontCB64.fnt");
	    labelScoreSpell.setPosition(ccp(880, 565));
	    labelScoreSpell.setColor(ccc3(255, 255, 255));
	    labelScoreSpell.setScale(0.55f);
	    labelScoreSpell.setAnchorPoint(ccp(1.0f, 0.5f));
	    this.addChild(labelScoreSpell, 8);
	}
	
	void GameScene::initLayerParticle()
	{
	    layerParticle = CCLayer::create();
	    layerParticle.setAnchorPoint(ccp(0.5, 1.0 / 600 * planetCenterY));
	    layerParticle.setRotation(playerX);
	    this.addChild(layerParticle, 5);
	}
	
	void GameScene::initLayerFlash()
	{
	    layerColorFlash = CCLayerColor::create();
	    this.addChild(layerColorFlash, 9);
	}
	
	void GameScene::initBtnPause()
	{
	    menuItemPause = CCMenuItemImage::create("pausebutton.png", "pausebuttonpressed.png", this, menu_selector(GameScene::clickBtnPause));
	    
	    menuBtnPause = CCMenu::create(menuItemPause, NULL);
	    
	    menuBtnPause.setPosition(ccp(70, 530));
	    this.addChild(menuBtnPause, 10);
	}
	
	void GameScene::initMenuItemBtnPause()
	{	    
	    CCMenuItem* menuItemResume = CCMenuItemImage::create("menu2_1.png", "menu2_1_off.png", this, menu_selector(GameScene::clickBtnResume));
	    CCMenuItem* menuItemRestart = CCMenuItemImage::create("menu2_2.png", "menu2_2_off.png", this, menu_selector(GameScene::clickBtnRestart));
	    CCMenuItem* menuItemExit = CCMenuItemImage::create("menu2_3.png", "menu2_3_off.png", this, menu_selector(GameScene::clickBtnExit));
	    
	    menuItemResume.setScale(0.7f);
	    menuItemExit.setScale(0.7f);
	    menuItemRestart.setScale(0.7f);
	    CCMenuItem* menuItemSetting = CCMenuItemImage::create("setting.png", "setting_pressed.png", this, menu_selector(GameScene::clickBtnOption));
	    menuItemSetting.setScale(0.8f);
	    menuBtnSetting = CCMenu::create(menuItemSetting, NULL);
	    menuBtnSetting.setPosition(ccp(/*820, 520*/830, 530));
	    	    
	    menuStatePause = CCMenu::create(menuItemResume, menuItemRestart, menuItemExit, NULL);
	    menuStatePause.alignItemsVerticallyWithPadding(7);
	    menuStatePause.setPosition(ccp(0, 0));
	    menuStatePause.setPosition(ccp(450, 155));
	    
	    sprPauseLabel = CCSprite::create("pause.png");
	    sprPauseLabel.setPosition(ccp(450, 400));
	    sprPauseLabel.setScale(0.9f);
	    
	    layerPauseMenu = CCLayerColor::create(ccc4(0, 0, 0, 100));
	    layerPauseMenu.addChild(sprPauseLabel);
	    layerPauseMenu.addChild(menuStatePause);
	    layerPauseMenu.addChild(menuBtnSetting);
	    
	    layerPauseMenu.setVisible(false);
	    this.addChild(layerPauseMenu, 10);
	}
	
	void GameScene::initSpriteShield()
	{
	    remainShieldCoolTimeMax = 360;
	    
	    sprShield = CCSprite::create("shieldcircle.png");
	    sprShield.setPosition(ccp(shieldX, shieldY));
	    sprShield.setOpacity(195);
	    sprShield.setScale(0);
	    this.addChild(sprShield, 5);
	    sprShield.setVisible(false);
	}
	
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

	void GameScene::initGameover()
	{
	    layerGameover = CCLayer::create();
	    
	    CCSprite* sprGameover = CCSprite::create("gameover.png");
	    sprGameover.setPosition(ccp(450, 355));
	    sprGameover.setScale(1.2f);
	    layerGameover.addChild(sprGameover);
	    layerGameover.setVisible(false);
	    
	    this.addChild(layerGameover, 9);
	}
	
	void GameScene::initEtc()
	{
	    deltaComboNum = 1;
	    realMeteorScore = 0;
	    preLevelUpNeed = 1;
	    preLevelScore = 0;
	    isHighestScore = false;
	    touchCount = 0;
	    remainGameOverCoolTime = 60;
	    time = 0;
	    
	    currentCombo = 0;
	    
	    sprHighestScore = CCSprite::create(GameData::isHardCore ? "highscore_hard.png" : "highscore.png");
	    sprHighestScore.setPosition(ccp(450, 170));
	    sprHighestScore.setScale(0.45f);
	    sprHighestScore.setVisible(false);
	    this.addChild(sprHighestScore, 9);
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

