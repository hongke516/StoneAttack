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
    
    strVersion:'ver 1.8', // string
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
		
		this.setKeyboardEnabled(true);
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
    	GameData.isHardCore = false;
    	this.enableMenu(false);
    	this.nextScene();
    },
    
    clickInfo:function()
    {
    	
    },
    
    clickRecord:function()
    {
    	this.startSoundEffect(s_pong_mp3);
    	this.menuBtnSetting.setVisible(false);
    	
    	GameData.gameState = GameData.STATE_RECORD;
    	this.schedule(this.updateRecordAnimation);
    	
    	this.unschedule(this.updateBalloon);
    	this.sprBalloon.setVisible(false);
    	this.layerMenu.setVisible(false);
    },
    
    clickBtnOption:function()
    {
    	this.startSoundEffect(s_pong_mp3);
    	this.layerOptionBox.setVisible(true);
    	this.menuBtnSetting.setVisible(false);
    	this.menu1.setEnabled(false);
    	this.menu2.setEnabled(false);
    	this.menu3.setEnabled(false);
    	this.menu4.setEnabled(false);
    	this.isOptionPanel = true;
    	
    	this.unschedule(this.updateBalloon);
    	this.sprBalloon.setVisible(false);
    	this.changeBalloonMessage();
    },
    
    clickOptionMusic:function()
    {
	    GameData.isMusicSound = !GameData.isMusicSound;    
	    this.startSoundEffect(s_pong_mp3);
	    this.saveFile();
	    
	    if(GameData.isMusicSound)
	    {
	        this.layerBgmChoice.setVisible(true);
	    }
	    else
	    {
	        this.layerBgmChoice.setVisible(false);
	        cc.AudioEngine.getInstance().stopMusic();
	        // CocosDenshion::SimpleAudioEngine* instance = CocosDenshion::SimpleAudioEngine::sharedEngine();
	        // instance->stopBackgroundMusic();
	    }    	
    },
    
    clickOptionSE:function()
    {
    	GameData.isSoundEffect = !GameData.isSoundEffect;
    	this.startSoundEffect(s_pong_mp3);
    	this.saveFile();
    },
    
    clickOptionExit:function()
    {
	    this.startSoundEffect(s_pong_mp3);
	    this.isOptionPanel = false;
	    this.menu1.setEnabled(true);
	    this.menu2.setEnabled(true);
	    this.menu3.setEnabled(true);
	    this.menu4.setEnabled(true);
	    this.layerOptionBox.setVisible(false);
	    this.menuBtnSetting.setVisible(true);
	    
	    // CocosDenshion::SimpleAudioEngine* instance = CocosDenshion::SimpleAudioEngine::sharedEngine();
	    // instance->stopBackgroundMusic();
	    cc.AudioEngine.getInstance().stopMusic();
	
	    if(GameData.gameState != GameData.STATE_RECORD)
	    {
	        this.schedule(this.updateBalloon);
	        this.labelToStartPeriod = 120;
	    }    		
    },
    
	clickOptionBgmLeft:function()
	{
	    this.startSoundEffect(s_pong_mp3);
	    switch(GameData.currentBgmNumber)
	    {
	        case 0:
	            GameData.currentBgmNumber = 7;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm3_fast_png));
                this.startBackgroundMusic();
	            break;
	        case 1:
	            GameData.currentBgmNumber = 0;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm_random_png));
	            this.startBackgroundMusic();
	            break;
	        case 2:
	            GameData.currentBgmNumber = 1;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm1_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 3:
	            GameData.currentBgmNumber = 2;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm2_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 4:
	            GameData.currentBgmNumber = 3;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm3_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 5:
	            GameData.currentBgmNumber = 4;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm4_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 6:
	            GameData.currentBgmNumber = 5;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm1_fast_png));
	            this.startBackgroundMusic();
	            break;
	        case 7:
	            GameData.currentBgmNumber = 6;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm2_fast_png));
	            this.startBackgroundMusic();
	            break;
	    }
	    this.saveFile();		
	},
	
	clickOptionBgmRight:function()
	{
	    this.startSoundEffect(s_pong_mp3);
	    switch(GameData.currentBgmNumber)
	    {
	        case 0:
	            GameData.currentBgmNumber = 1;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm1_normal_png));
                this.startBackgroundMusic();
	            break;
	        case 1:
	            GameData.currentBgmNumber = 2;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm2_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 2:
	            GameData.currentBgmNumber = 3;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm3_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 3:
	            GameData.currentBgmNumber = 4;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm4_normal_png));
	            this.startBackgroundMusic();
	            break;
	        case 4:
	            GameData.currentBgmNumber = 5;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm1_fast_png));
	            this.startBackgroundMusic();
	            break;
	        case 5:
	            GameData.currentBgmNumber = 6;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm2_fast_png));
	            this.startBackgroundMusic();
	            break;
	        case 6:
	            GameData.currentBgmNumber = 7;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm3_fast_png));
	            this.startBackgroundMusic();
	            break;
	        case 7:
	            GameData.currentBgmNumber = 0;
	            this.sprBgmNumber.setTexture(cc.TextureCache.getInstance().addImage(s_bgm_random_png));
	            this.startBackgroundMusic();
	            break;
	    }
	    this.saveFile();		
	},
	
	enableMenu/*True*/:function(bool)
	{
		this.menu1.setEnabled(bool);
		this.menu2.setEnabled(bool);
		this.menu3.setEnabled(bool);
		this.menu4.setEnabled(bool);
		this.menuBtnSetting.setEnabled(bool);
	},
	/*
	enableMenuFalse:function()
	{
		
	},
	*/
	leftGesture:function()
	{
	    this.currentAngle -= 5;
	    if(this.currentAngle < 0)
	    {
	        this.currentAngle += 360;
	    }
	    
	    if(this.currentAngle % 90 == 0)
	    {
	        this.runMode = 0;
	        this.unschedule(this.leftGesture);
	        this.menu1.setEnabled(true);
	        this.menu2.setEnabled(true);
	        this.menu3.setEnabled(true);
	        this.menu4.setEnabled(true);
	        
	        this.schedule(this.updateBalloon);
	        this.changeBalloonMessage();
	        this.labelToStartPeriod = 120;
	        this.changeBalloonMessage();
	    }
	    
	    this.updateCharAnimation();
	    this.sprPlanet.setRotation(this.currentAngle);
	    
	    var angle = 360 - this.currentAngle;
	    if(angle == 360)
	    {
	        angle = 0;
	    }
	    
	    this.menu1.setPosition(cc.p(450 + 300 * GameData.cosTable[90 + angle >= 360 ? -270 + angle : 90 + angle], 100 + 300 * GameData.sinTable[90 + angle >= 360 ? -270 + angle : 90 + angle]));
	    this.menu2.setPosition(cc.p(450 + 300 * GameData.cosTable[angle], 100 + 300 * GameData.sinTable[angle]));
	    this.menu3.setPosition(cc.p(450 + 300 * GameData.cosTable[180 + angle >= 360 ? -180 + angle : 180 + angle], 100 + 300 * GameData.sinTable[180 + angle >= 360 ? -180 + angle : 180 + angle]));
	    this.menu4.setPosition(cc.p(450 + 300 * GameData.cosTable[270 + angle >= 360 ? -90 + angle : 270 + angle], 100 + 300 * GameData.sinTable[270 + angle >= 360 ? -90 + angle : 270 + angle]));		
	},
	
	rightGesture:function()
	{
	    this.currentAngle += 5;
	    if(this.currentAngle >= 360)
	    {
	        this.currentAngle -= 360;
	    }
	    if(this.currentAngle % 90 == 0)
	    {
	        this.runMode = 0;
	        this.unschedule(this.rightGesture);
	        this.menu1.setEnabled(true);
	        this.menu2.setEnabled(true);
	        this.menu3.setEnabled(true);
	        this.menu4.setEnabled(true);
	        
	        this.schedule(this.updateBalloon);
	        this.changeBalloonMessage();
	        this.labelToStartPeriod = 120;
	        this.changeBalloonMessage();
	    }
	    this.updateCharAnimation();
	    this.sprPlanet.setRotation(this.currentAngle);
	    
	    var angle = 360 - this.currentAngle;
	    if(angle == 360)
	    {
	        angle = 0;
	    }
	    
	    this.menu1.setPosition(cc.p(450 + 300 * GameData.cosTable[90 + angle >= 360 ? -270 + angle : 90 + angle], 100 + 300 * GameData.sinTable[90 + angle >= 360 ? -270 + angle : 90 + angle]));
	    this.menu2.setPosition(cc.p(450 + 300 * GameData.cosTable[angle], 100 + 300 * GameData.sinTable[angle]));
	    this.menu3.setPosition(cc.p(450 + 300 * GameData.cosTable[180 + angle >= 360 ? -180 + angle : 180 + angle], 100 + 300 * GameData.sinTable[180 + angle >= 360 ? -180 + angle : 180 + angle]));
	    this.menu4.setPosition(cc.p(450 + 300 * GameData.cosTable[270 + angle >= 360 ? -90 + angle : 270 + angle], 100 + 300 * GameData.sinTable[270 + angle >= 360 ? -90 + angle : 270 + angle]));		
	},
	
	updateLabelToStart:function()
	{
	    this.labelToStartPeriod++;
	    if(this.labelToStartPeriod == 60)
	    {
	        this.labelToStartPeriod = 0;
	    }
	    this.labelTouchAnywhereToStart.setVisible(this.labelToStartPeriod < 45 ? true : false);		
	},
	
	updateBalloon:function()
	{
	    this.labelToStartPeriod++;
	    if(this.labelToStartPeriod == 120 || this.labelToStartPeriod == 150)
	    {
	        this.labelToStartPeriod = 0;
	    }
	    
	    this.sprBalloon.setVisible(this.labelToStartPeriod < 90 ? true : false);		
	},
	
	updateCharAnimation:function()
	{
	    if((this.runMode > 0 && this.currentRunAnimation < 0) || (this.runMode < 0 && this.currentRunAnimation >= 0) || this.runMode == 0)
	    {
	        this.currentRunAnimation = 0;
	        this.runReverse = false;
	    }
	    this.currentRunAnimation += this.runReverse ? -this.runMode : this.runMode;
	    
	    var absRunNum = Math.abs(this.currentRunAnimation);
	    if(absRunNum == 0 && this.runMode != 0)
	    {
	        absRunNum = 1;
	    }
	    else if(absRunNum == 19)
	    {
	        absRunNum = 18;
	    }
	    
	    switch(absRunNum)
	    {
	        case 0:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_stand_png));
	            break;
	        case 1:
	            if(this.runReverse)
	            {
	                this.runReverse = false;
	            }
	        case 2:
	        case 3:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_run1_png));
	            break;
	        case 4:
	        case 5:
	        case 6:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_run2_png));
	            break;
	        case 7:
	        case 8:
	        case 9:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_run3_png));
	            break;
	        case 10:
	        case 11:
	        case 12:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_run4_png));
	            break;
	        case 13:
	        case 14:
	        case 15:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_run5_png));
	            break;
	        case 16:
	        case 17:
	        case 18:
	            this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_run6_png));
	            this.runReverse = true;
	            break;
	    }
	    this.sprCharacter.setFlipX(this.runMode < 0);		
	},
	
    updateTitleAnimation:function()
    {
	    if(this.menu1.getOpacity() == 0)
	    {
	        this.sprTitle1.setPosition(cc.p(this.sprTitle1.getPositionX() + this.titleDeltaX1, this.sprTitle1.getPositionY() + this.titleDeltaY1));
	        this.sprTitle2.setPosition(cc.p(this.sprTitle2.getPositionX() + this.titleDeltaX2, this.sprTitle2.getPositionY() + this.titleDeltaY2));
	        this.sprTitle1.setScale(this.sprTitle1.getScale() - 0.35 / 30);
	        this.sprTitle2.setScale(this.sprTitle2.getScale() - 0.35 / 30);
	        
	        this.remainFrame--;
	        if(this.remainFrame == 0)
	        {
	        	cc.AudioEngine.getInstance().stopMusic();
//	            CocosDenshion::SimpleAudioEngine::sharedEngine()->stopBackgroundMusic();
	            this.menu1.setOpacity(15);
	            this.menu2.setOpacity(15);
	           	this.menu3.setOpacity(15);
	            this.menu4.setOpacity(15);
	            this.menuBtnSetting.setOpacity(15);
	        }
	        return;
	    }
	
	    this.menu1.setOpacity(this.menu1.getOpacity() + 8);
	    this.menu2.setOpacity(this.menu2.getOpacity() + 8);
	    this.menu3.setOpacity(this.menu3.getOpacity() + 8);
	    this.menu4.setOpacity(this.menu4.getOpacity() + 8);
	    this.menuBtnSetting.setOpacity(this.menuBtnSetting.getOpacity() + 8);
	    
	    if(this.menu1.getOpacity() == 255)
	    {
	        this.enableMenu(true);
	        this.unschedule(this.updateTitleAnimation);
	        
	        this.schedule(this.updateBalloon);
	        this.changeBalloonMessage();
	        this.labelToStartPeriod = 120;
	    }    	
    },
    
    updateRecordAnimation:function()
    {
	    if(GameData.gameState == GameData.STATE_RECORD) // 왼쪽으로
	    {
	        this.sprCharacter.setPositionX(this.sprCharacter.getPositionX() - 12.5);
	        this.sprPlanet.setPositionX(this.sprPlanet.getPositionX() - 12.5);
	        this.sprTitle1.setPositionX(this.sprTitle1.getPositionX() - 12.5);
	        this.sprTitle2.setPositionX(this.sprTitle2.getPositionX() - 12.5);
	        if(this.sprPlanet.getPositionX() == 200)
	        {
	            this.unschedule(this.updateRecordAnimation);
	            this.menuToRecord();
	        }
	    }
	    else
	    {
	        this.sprCharacter.setPositionX(this.sprCharacter.getPositionX() + 12.5);
	        this.sprPlanet.setPositionX(this.sprPlanet.getPositionX() + 12.5);
	        this.sprTitle1.setPositionX(this.sprTitle1.getPositionX() + 12.5);
	        this.sprTitle2.setPositionX(this.sprTitle2.getPositionX() + 12.5);
	        if(this.sprPlanet.getPositionX() == 450)
	        {
	            this.unschedule(this.updateRecordAnimation);
	            this.recordToMenu();
	        }
	    }    	
    },
    
    recordToMenu:function()
    {
	    this.menuBtnSetting.setVisible(true);
	    this.layerMenu.setVisible(true);
	    
	    this.schedule(this.updateBalloon);
	    this.changeBalloonMessage();
	    this.labelToStartPeriod = 120;    	
    },
    
    menuToRecord:function()
    {
	    this.layerRecord.setVisible(true);
	    this.labelVersion.setVisible(true);    	
    },
    
    onKeyDown:function(e)
    {
    	if(GameData.gameState == GameData.STATE_INTRO)
    	{
	        this.remainFrame = 30;
	        this.titleDeltaX1 = 170.0 / this.remainFrame;
	        this.titleDeltaY1 = -320.0 / this.remainFrame;
	        this.titleDeltaX2 = -130.0 / this.remainFrame;
	        this.titleDeltaY2 = -330.0 / this.remainFrame;
	        
	        this.schedule(this.updateTitleAnimation);
	        this.unschedule(this.updateLabelToStart);
	        this.labelTouchAnywhereToStart.setVisible(false);
	        
	        GameData.gameState = GameData.STATE_MENU;
	        return;
    	}
    	else
    	{
	        if(this.runMode != 0)
	        {
	            return;
	        }
	        if(this.isOptionPanel)
	        {
	        	if(e == cc.KEY.escape)
	        	{
	        		this.clickOptionExit();
	        	}
	            return;
	        }
	        
	        if(GameData.gameState == GameData.STATE_RECORD)
	        {
	            if(this.sprPlanet.getPositionX() != 200)
	            {
	                return;
	            }
	            this.startSoundEffect(s_pong_mp3);
	            this.schedule(this.updateRecordAnimation);
	            this.layerRecord.setVisible(false);
	            this.labelVersion.setVisible(false);
	            GameData.gameState = GameData.STATE_MENU;
	            return;
	        }
	        
	        if(this.menu1.getOpacity() != 255 || this.sprPlanet.getPositionX() != 450)
	        {
	            return;
	        }
	
	        /*
	        int x = (CCDirector::sharedDirector()->convertToGL(pTouch->getLocationInView())).x;
	        if(x>450)
	        {
	            runMode = -2;
	            this->schedule(schedule_selector(MenuScene::leftGesture));
	        }
	        else
	        {
	            runMode = 2;
	            this->schedule(schedule_selector(MenuScene::rightGesture));
	        }
	        */
	       
    		if(e != cc.KEY.left && e != cc.KEY.right && e != cc.KEY.space && e != cc.KEY.enter && e != cc.KEY.escape)
    		{
    			return;
    		}    		
    			       
	    	switch(e)
	    	{
	    		case cc.KEY.left:
	    			this.runMode = 2;
	    			this.schedule(this.rightGesture);
	    			this.startSoundEffect(s_pong_mp3);
	    		    this.unschedule(this.updateBalloon);
	    		    this.sprBalloon.setVisible(false);
			        this.menu1.setEnabled(false);
			        this.menu2.setEnabled(false);
			        this.menu3.setEnabled(false);
			        this.menu4.setEnabled(false);		    		    			
	    			break;	
	    		case cc.KEY.right:
	    			this.runMode = -2;
	    			this.schedule(this.leftGesture);
	    			this.startSoundEffect(s_pong_mp3);
			        this.unschedule(this.updateBalloon);
		    	    this.sprBalloon.setVisible(false);
			        this.menu1.setEnabled(false);
			        this.menu2.setEnabled(false);
			        this.menu3.setEnabled(false);
			        this.menu4.setEnabled(false);		    	        		    			
	    			break;
	    		case cc.KEY.escape:
	    			this.clickBtnOption();
	    			break;
	    		case cc.KEY.space:
	    		case cc.KEY.enter:
	    			switch(this.currentAngle)
	    			{
	    				case 0:
	    					this.clickNormalMode();
	   	    				break;
	    				case 90:
	    					this.clickRecord();
		    				break;
	    				case 180:
	    					this.clickInfo();
	    					break;
	    				case 270:
	    					this.clickHardcoreMode();
	    					break;	
	    			}
		    		break;
	    	}      
		}
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
    },
    */
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
    	this.sprTitle1 = cc.Sprite.create(s_newtitle1_png);
    	this.sprTitle2 = cc.Sprite.create(s_newtitle2_png);
    	
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
    	var sprBackground = cc.Sprite.create(s_GameScene_background_png);
    	sprBackground.setScale(1.5);
    	sprBackground.setPosition(cc.p(450, 300));
    	this.addChild(sprBackground);	
    },
    
    initSpritePlanet:function()
    {
    	this.sprPlanet = cc.Sprite.create(s_planet_png);
    	this.sprPlanet.setPosition(cc.p(450, 100));
    	this.sprPlanet.setRotation(this.currentAngle);
    	this.addChild(this.sprPlanet);
    },
    
    initSpriteCharacter:function()
    {
    	this.sprCharacter = cc.Sprite.create(s_player_stand_png);
    	this.sprCharacter.setScale(0.75);
    	this.sprCharacter.setPosition(cc.p(450, 277));
    	this.addChild(this.sprCharacter);
    },
    
    initMenu:function()
    {
	    this.layerMenu = cc.Layer.create();
	    
	    var menuItem1 = cc.MenuItemImage.create(s_menu1_on_png, s_menu1_off_png, this.clickNormalMode, this);
	    this.menu1 = cc.Menu.create(menuItem1, null);
	    
	    var menuItem2 = cc.MenuItemImage.create(s_menu2_on_png, s_menu2_off_png, this.clickHardcoreMode, this);
	    this.menu2 = cc.Menu.create(menuItem2, null);
	    
	    var menuItem3 = cc.MenuItemImage.create(s_menu3_on_png, s_menu3_off_png, this.clickRecord, this);
	    this.menu3 = cc.Menu.create(menuItem3, null);
	    
	    var menuItem4 = cc.MenuItemImage.create(s_menu_info_on_png, s_menu_info_off_png, this.clickInfo, this);
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
//		this.labelVersion = cc.LabelTTF.create(this.strVersion, '나눔고딕', 32);
		this.labelVersion = cc.LabelBMFont.create(this.strVersion, s_bmfontCB_fnt);
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
    
    initRecord:function()
    {
	    this.layerRecord = cc.Layer.create();
	    
	    var sprRecord = cc.Sprite.create(s_record_png);
	    sprRecord.setPosition(cc.p(450, 300));
	    this.layerRecord.addChild(sprRecord);
	    
	    var sprNormalHighest = cc.Sprite.create(s_highscore_png);
	    var sprHardcordHighest = cc.Sprite.create(s_highscore_hard_png);

	    sprNormalHighest.setPosition(cc.p(500, 200));
	    sprHardcordHighest.setPosition(cc.p(750, 200));
	    
	    sprNormalHighest.setScale(0.6);
	    sprHardcordHighest.setScale(0.6);
	    
	    this.layerRecord.addChild(sprNormalHighest);
	    this.layerRecord.addChild(sprHardcordHighest);
	    
	    // char buf[] = {0};
	    // sprintf(buf, "%d", GameData::highestNormalScore);
	    
	    var labelNormalScore = cc.LabelBMFont.create(/*buf*//*GameData.highestNormalScore*/"" + GameData.HighScore.Normal, s_bmfontCB64_fnt);
	    labelNormalScore.setPosition(cc.p(500, 120));
	    labelNormalScore.setColor(cc.c3b(255, /*233*/255, 0));
	    this.layerRecord.addChild(labelNormalScore);

//	    sprintf(buf, "%d", GameData::highestHardcoreScore);
	    var labelHardcoreScore = cc.LabelBMFont.create(/*buf*//*GameData.highestHardcoreScore*/"" + GameData.HighScore.Hardcore, s_bmfontCB64_fnt);
	    labelHardcoreScore.setPosition(cc.p(750, 120));
	    labelHardcoreScore.setColor(cc.c3b(255, /*25*/0, 0));
	    this.layerRecord.addChild(labelHardcoreScore);
	    
	    this.layerRecord.setVisible(false);
	    this.addChild(this.layerRecord); 	
    },
    
    initBalloon:function()
    {
	    this.sprBalloon = cc.Sprite.create(s_balloon_png);
	    this.sprBalloon.setPosition(cc.p(240, 315));
	    this.sprBalloon.setScale(0.9);
	    this.sprBalloon.setFlipX(true);
	    this.addChild(this.sprBalloon);
	    
	    this.labelBalloon = cc.LabelTTF.create("", "나눔고딕", 30);
	//    labelBalloon->setPosition(ccp(190, 315));
	    this.labelBalloon.setPosition(cc.p(140, 130));
	    this.labelBalloon.setColor(cc.c3b(0, 0, 0));
	    this.sprBalloon.addChild(this.labelBalloon);
	    this.sprBalloon.setVisible(false);
	    
	    this.changeBalloonMessage();
	    
	    if(!(GameData.gameState == GameData.STATE_INTRO))
	    {
	        this.schedule(this.updateBalloon);
	        sprBalloon.setVisible(false);
	        labelToStartPeriod = 120;
	    }   	
    },
    
    changeBalloonMessage:function()
    {
	    switch(/*rand() % 7*/Math.floor(Math.random()*5))
	    {
	        case 0:
	        	this.labelBalloon.setString("안드로이드랑 iOS\n버전도 있어요 ㅎㅎ");
	        	break;
	        case 1:
	            if(GameData.HighScore.Hardcore == 0 && GameData.HighScore.Normal != 0)
	            {
	                this.labelBalloon.setString("하드코어 모드에\n도전해보세요!\n_(≥▽≤)/");
	            }
	            else
	            {
//	                this.changeBalloonMessage();
	                this.labelBalloon.setString("합산 " + (GameData.HighScore.Normal + GameData.HighScore.Hardcore) + "점?\n실망이에요 ㅜ_ㅜ");
	                /*
	                char buf[256] = {0};
	                sprintf(buf, "합산 %d점?\n실망이에요 ㅜ_ㅜ", GameData::highestHardcoreScore + GameData::highestNormalScore);
	                labelBalloon->setString(buf);
	                 */
	            }
	            break;
	        case 2:
	            this.labelBalloon.setString("노래는 설정에서\n바꿀 수 있어요~♬");
	            break;
	        case 3:
	            this.labelBalloon.setString("Info 메뉴를\n선택해보세요!\n(^ㅡ^)");
	            break;
	        case 4:
	            this.labelBalloon.setString("방향키를 누르면\n지구가 돌아가요!\n나만 몰랐나?^^");
	            break;
	    }   	
    },
    
    startSoundEffect:function(fileName)
    {
    	if(GameData.isSoundEffect)
    	{
    		SoundControl.Sound[fileName].play();
    	}
    },
    
    startBackgroundMusic:function()
    {
	    SoundControl.Sound[s_BGM1_normal_mp3].play();	
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

