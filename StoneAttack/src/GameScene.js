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
	    this.initLayerFlash();
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

	startGame:function()
	{
	    this.removeMakerAndMeteorites();
	    this.makeMeteorMaker();
	    
	    this.stopShield();
	    this.time = 0;
	    this.deltaComboNum = 1;
	    this.currentCombo = 0;
	    this.realMeteorScore = 0;
	    
	    this.preLevelScore = 0;
	    this.preLevelUpNeed = 1;
	    this.runReverse = false;
	    this.runMode = 0;
	    this.currentHP = HP_MAX;
	    this.currentScore = 0;
	    
	    this.currentRunAnimation = 0;
	    this.remainHitCoolTime = 0;
	    this.remainShieldCoolTime = 0;
	    this.isHighestScore = false;
	    
	    this.sprCharacter.setVisible(true);
	    this.sprHpBar.setVisible(false);
	    this.sprHpFrame.setVisible(false);
	    this.labelScore.setString("0");
	    this.layerColorFlash.setOpacity(0);
	    this.layerColorFlash.setVisible(false);
	    this.labelScore.setColor(cc.c3b(255, 255, 255));
	    this.labelScoreSpell.setColor(cc.c3b(255, 255, 255));
	    this.labelScore.setPosition(ccp(765, 570));
	    this.labelScoreSpell.setString("Score");
	    this.labelComboMul.setVisible(false);
	    
	    this.unschedule(this.updateShield);
	    this.unschedule(this.updateHitCoolTime);
	    this.unschedule(this.updateFlash);
	    this.unschedule(this.updateStateBar);

	    this.startBackgroundMusic();
	    
	},

	saveHighScore:function()
	{
	    if(GameData.isHardCore)
	    {
	        if(GameData.currentScore > GameData.HighScore.Hardcore)
	        {
	            GameData.HighScore.Hardcore = GameData.currentScore;
	        }
	    }
	    else
	    {
	        if(GameData.currentScore > GameData.HighScore.Normal)
	        {
	            GameData.HighScore.Normal = GameData.currentScore;
	        }
	    }
	    saveFile();
	},
	
	makeShieldParticle:function(meteor)
	{
	    var tempParticle = ParticleExplosionSprite.createWithPoint(s_shield_particle_png, meteor.getPosition());
	    this.addChild(tempParticle, 5);
	    tempParticle.setDeltaOpacity(10);
	    tempParticle.start();
	},
	
	makeRotationParticle(position)
	{
	    var tempParticle = ParticleExplosionSprite.createWithPoint(s_star_particle_png, position);
	    this.layerParticle.addChild(tempParticle);
	    tempParticle.start();
	},
	/*
	makeMeteor:function()
	{
	    var buf = MeteorSprite.create();
	    this.addChild(buf, 6);
	    arrayMeteorites.addObject(buf);
	}
	*/
	makeMeteor:function(x)
	{
	    var buf = MeteorSprite.create(x);
	    this.addChild(buf, 6);
	    this.arrayMeteorites.push(buf);
	},
	
	makeMeteorItemHp:function()
	{
	    var buf = MeteorSprite.createHp();
	    this.addChild(buf, 6);
	    this.arrayMeteorites.push(buf);
	},
	
	makeMeteorItemShield:function()
	{
	    var randNum = Math.floor(Math.random() * 180) + GameData.GameData.playerX;
	    
	    var rangeX = this.randNum >= 360 ? this.randNum - 360 : this.randNum;
	    var buf = MeteorSprite.createShield(rangeX);
	    this.addChild(buf, 6);
	    this.arrayMeteorites.push(buf);
	},
	
	makeMeteorMaker:function()
	{
	    var buf = MeteorMaker.create();
	    this.arrayMeteorMaker.push(buf);
	}

	collidePlanet:function(meteor)
	{
	    var dx = meteor.meteoX;
	    var x = GameData.planetCenterX + MeteorSprite.cosTable[dx < 0 ? dx + 360 : dx] * meteor.meteoY;
	    var y = GameData.planetCenterY + MeteorSprite.sinTable[dx < 0 ? dx + 360 : dx] * meteor.meteoY;
	    this.makeRotationParticle(ccp(x, y));
	    
	    //    int dropSpeed = meteor.dropSpeed;
	    
	    this.arrayMeteorites.removeObject(meteor);
	    this.removeChild(meteor, true);
	    
	    if(meteor.isShield || meteor.isHp)
	    {
	        return;
	    }
	    
	    this.realMeteorScore++;
	    GameData.currentScore += this.deltaComboNum;
	    labelScore.setString(currentScore + "");
	    
	    if(this.realMeteorScore % 150 == 0)
	    {
	        this.makeMeteorItemHp();
	    }
	    
	    if(!this.isHighestScore && GameData.currentScore > (GameData.isHardCore ? GameData.highestHardcoreScore : GameData.highestNormalScore))
	    {
	        this.isHighestScore = true;
	        this.labelScore.setColor(cc.c3b(255, 255, 80));
	        this.labelScore.setPosition(ccp(733, 570));
	        this.labelScoreSpell.setString("Highest");
	        this.labelScoreSpell.setColor(cc.c3b(255, 255, 80));
	    }
	    this.ChangeSpeedDifficulty();
	  
	    /// combo
	    if(this.remainHitCoolTime != 0)
	    {
	        return;
	    }
	    
	    // 210, 255, 255
	    this.currentCombo++;
	    switch(this.currentCombo)
	    {
	        case 200:
	            this.labelComboMul.setString("x2");
	            this.labelComboMul.setColor(cc.c3b(150, 255, 120));
	            this.deltaComboNum = 2;
	            this.labelComboMul.setVisible(true);
	            break;
	        case 400:
	            this.labelComboMul.setString("x3");
	            this.labelComboMul.setColor(cc.c3b(100, 240, 240));
	            this.deltaComboNum = 3;
	            break;
	        case 700:
	            this.labelComboMul.setString("x4");
	            this.labelComboMul.setColor(cc.c3b(255, 100, 170));
	            this.deltaComboNum = 4;
	            break;
	        case 1000:
	            this.labelComboMul.setString("x5");
	            this.labelComboMul.setColor(cc.c3b(255, 127, 255));
	            this.deltaComboNum = 5;
	            break;
	    }
	    
	    if(this.currentCombo == 1)
	    {
	        return;
	    }
	    else if(GameData.gameState == GameData.STATE_PLAYING)
	    {
	        this.layerCombo.setVisible(true);
	    }
	    this.labelComboNum.setString(currentCombo + "");
	    
	    this.startComboEffect();
	},
	
	collidePlayer:function(meteor)
	{
	    if(this.remainHitCoolTime != 0 || GameData.gameState == GameData.STATE_GAMEOVER)
	    {
	        return;
	    }
	    this.startSoundEffect(s_puck_mp3);
	    
	    this.currentHP -= 700;//meteor.damage;
	    if(this.currentHP <= 0)
	    {
	        this.layerCombo.setVisible(false);
	        this.saveHighScore();
	        this.gameOver();
	        this.schedule(this.updateGameOverCoolTime);
	        return;
	    }
	    ////
	    this.removeChild(meteor, true);	    
	    this.arrayMeteorites.splice(this.arrayMeteorites.indexOf(meteor), 1);
	    // this.removeChild(meteor, true);
	    
	    this.startFlash(255, 0, 0, 100);
	    
	    this.labelComboMul.setString("");
	    
	    this.remainHitCoolTime = GameData.remainHitCoolTimeMax;
	    this.schedule(this.updateHitCoolTime);
	    this.schedule(this.updateStateBar);
	    this.sprHpBar.setVisible(true);
	    this.sprHpFrame.setVisible(true);

	    this.currentCombo = 0;
	    this.deltaComboNum = 1;
	    this.layerCombo.setVisible(false);
	    this.labelComboNum.setString("");
	},
	
	collideItem:function(meteor)
	{	    
	    if(meteor.isShield)
	    {
	        this.startShield();
	    }
	    else if(meteor.isHp)
	    {
	        this.currentHP = GameData.HP_MAX;
	    }
	    ////
	    this.removeChild(meteor, true);	    
	    this.arrayMeteorites.removeObject(arrayMeteorites.indexOf(meteor), 1);
//	    this.removeChild(meteor, true);
	    this.startSoundEffect(s_itemgot_wav);
	},

	collideShield:function(meteor)
	{
	    this.makeShieldParticle(meteor);
	    this.makeShieldParticle(meteor);
	    this.makeShieldParticle(meteor);
	    
	    this.arrayMeteorites.removeObject(arrayMeteorites.indexOf(meteor));
	    this.removeChild(meteor, true);
	    
	    if(this.remainShieldCoolTime <= 0)
	    {
	        var scalePlus = cc.ScaleTo.create(0.1,  1.5);
	        var action = cc.Sequence.create(scalePlus, cc.CallFuncN.create(this, this.stopShield), null);
	        this.sprShield.runAction(action);
	        
	        return;
	        //CCSequence.actions(액션,CCCallFuncN.actionWithTarget(this, callfuncN_selector(네임 스페이스.finishChk)), NULL);
	    }
	    else
	    {
	        var scaleAction = cc.ScaleTo.create(0.02,  0.8);
	        var scaleActionReverse = cc.ScaleTo.create(0.02, 1.0);
	        this.sprShield.runAction(cc.Sequence.create(scaleAction, scaleActionReverse, null));
	        
	        var perTime = this.remainShieldCoolTime / GameData.remainShieldCoolTimeMax;
	        this.sprShield.setTexture(cc.TextureCache.getInstance().addImage(perTime >= 0.8 ? s_shieldcircle_png : perTime >= 0.6 ? 
	        	s_shieldcircledmg1_png : perTime >= 0.4 ? s_shieldcircledmg2_png : perTime >= 0.4 ? s_shieldcircledmg3_png : s_shieldcircledmg4_png));
	    }	    
	},
	
	enterHome:function()
	{
	    this.layerGameover.setVisible(false);
	    this.prHighestScore.setVisible(false);
	    this.labelScore.setVisible(false);
	    this.layerCombo.setVisible(false);
	    this.abelScoreSpell.setVisible(false);
	    this.removeMakerAndMeteorites();
	    this.schedule(this.updateEnterHome);
	},
	
	removeMakerAndMeteorites:function()
	{
		/*
	    for(i = arrayMeteorMaker.length - 1; i>=0; i--)
	    {
	        arrayMeteorMaker.removeObjectAtIndex(i);
	    }
	    */
        this.arrayMeteorMaker = [];
        
	    var count = this.arrayMeteorites.length;
	    for(i = count-1; i >= 0; i--)
	    {
	        var buf = arrayMeteorites[i];
	        this.removeChild(buf, true);
	        this.arrayMeteorites.splice(i);
//	        this.removeChild(buf, true);
	    }
	},
	
	updateEnterHome:function()
	{
	    if(GameData.isHardCore)
	    {
	        GameData.GameData.playerX = (GameData.GameData.playerX <= 275 && GameData.GameData.playerX >= 265) ? 270 : (GameData.playerX > 90 && GameData.playerX < 265) ? GameData.playerX + 5 : GameData.playerX - 5;
	        if(GameData.playerX < 0)
	        {
	            GameData.playerX += 360;
	        }
	        
	        this.runMode = (GameData.playerX > 90 && GameData.playerX < 270) ? 2 : -2;
	        
	        if(GameData.playerX == 270)
	        {
	            this.runMode = 0;
	            this.unschedule(this.updateEnterHome);
	            GameData.gameState = GameData.STATE_MENU;
	            cc.Director.getInstance().replaceScene(new MenuScene());
	        }
	    }
	    else
	    {
	        GameData.playerX = (GameData.playerX <= 5 || GameData.playerX >= 355) ? 0 : (GameData.playerX > 180) ? GameData.playerX + 5 : GameData.playerX - 5;
	        this.runMode = (GameData.playerX > 180) ? 2 : -2;
	        
	        if(GameData.playerX == 0)
	        {
	            this.runMode = 0;
	            this.unschedule(this.updateEnterHome);
	            GameData.gameState = GameData.STATE_MENU;
	            cc.Director.getInstance().replaceScene(new MenuScene());
	        }
	    }
	    this.updateCharAnimation();
	    this.sprPlanet.setRotation(GameData.playerX);
	},
	
	clickBtnPause:function()
	{
	    if(GameData.gameState == GameData.STATE_GAMEOVER)
	    {
	        return;
	    }
	    this.startSoundEffect(s_pong_wav);
	    this.gamePause();
	},
	
	clickBtnResume:function()
	{
	    this.startSoundEffect(s_pong_wav);
	    this.gameResume();
	},
	
	clickBtnRestart:function()
	{
	    this.startSoundEffect(s_pong_wav);
	    this.saveHighScore();
	    this.startGame();
	    this.gameResume();
	    this.sprHighestScore.setVisible(false);
	    this.labelScore.setColor(cc.c3b(255, 255, 255));
	    this.layerColorFlash.setOpacity(0);
	    this.layerColorFlash.setVisible(false);
	    this.layerCombo.setVisible(false);
	},
	
	clickBtnOption:function()
	{
	    this.startSoundEffect(s_pong_wav);
	    
	    this.layerOptionBox.setVisible(true);
	    this.menuStatePause.setVisible(false);
	    this.sprPauseLabel.setVisible(false);
	    this.menuBtnSetting.setVisible(false);
	}
	
	clickBtnExit:function()
	{
	    this.startSoundEffect(s_pong_mp3);
	    //    stopShield();
	    this.saveHighScore();
	    //    saveFile();
	    this.gameResume();
	    this.gameOver();
	    this.enterHome();
	    this.remainHitCoolTime = 0;
	    this.sprCharacter.setVisible(true);
	}
	
	clickOptionMusic:function()
	{
	    GameData.isMusicSound = !GameData.isMusicSound;
	    this.startSoundEffect(s_pong_wav);
	    this.saveFile();
	    
	    if(GameData.isMusicSound)
	    {
	        this.layerBgmChoice.setVisible(true);
	    }
	    else
	    {
	        this.layerBgmChoice.setVisible(false);
	        ////
	        // CocosDenshion.SimpleAudioEngine* instance = CocosDenshion.SimpleAudioEngine.sharedEngine();
	        // instance.stopBackgroundMusic();
	    }
	    this.bgmSettingChanged = true;
	}
	
	clickOptionSE:function()
	{
		GameData.isSoundEffect = !GameData.isSoundEffect;
	 	this.startSoundEffect(s_pong_wav);
	 	this.saveFile();
	}
	/*
	void GameScene.clickOptionVibrate()
	{
	    startSoundEffect("pong.wav");
	    GameData.isVibrate = !GameData.isVibrate;
	    saveFile();
	}
	*/
	void GameScene.clickOptionExit()
	{
	    this.startSoundEffect(s_pong_wav);
	    
	    this.menuStatePause.setVisible(true);
	    this.sprPauseLabel.setVisible(true);
	    //    menuStatePause.setEnabled(true);
	    this.layerOptionBox.setVisible(false);
	    //    sprBtnSettingSelected.setVisible(false);
	    this.menuBtnSetting.setVisible(true);
	    
	    if(this.bgmSettingChanged)
	    {
	    	////
	        // CocosDenshion.SimpleAudioEngine* instance = CocosDenshion.SimpleAudioEngine.sharedEngine();
	        // instance.stopBackgroundMusic();
	    }
	}
	
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
	
	ChangeSpeedDifficulty:funtion()
	{
	    if (this.realMeteorScore - this.preLevelScore >= this.preLevelUpNeed)
	    {
	        this.preLevelUpNeed += (arrayMeteorMaker.length < 11) ? this.preLevelUpNeed : 0;
	        this.preLevelScore = this.realMeteorScore;
	        this.makeMeteorMaker();
	    }
	    
	    if(GameData.isHardCore)
	    {
	        return;
	    }
	    
	    switch (this.realMeteorScore)
	    {	            
	        case 100:
	            MeteorSprite.maxDropSpeed++;
	            break;
	        case 200:
	            MeteorSprite.minDropSpeed++;
	            break;
	        case 400:
	            MeteorSprite.maxDropSpeed++;
	            break;
	        case 700:
	            MeteorSprite.minDropSpeed++;
	            break;
	        case 1100:
	            MeteorSprite.maxDropSpeed++;
	            break;
	        case 1600:
	            MeteorSprite.minDropSpeed++;
	            break;
	        case 2200:
	            MeteorSprite.maxDropSpeed++;
	            break;
	        case 2900:
	            MeteorSprite.minDropSpeed++;
	            break;
	        case 3700:
	            MeteorSprite.maxDropSpeed++;
	            break;
	        case 4600:
	            MeteorSprite.minDropSpeed++;
	            break;
	        case 5600:
	            MeteorSprite.minDropSpeed++;
	            break;
	            /*
	             case 6700:
	             MeteorSprite.minDropSpeed++;
	             break;
	             */
	            /*
	             case 7900:
	             MeteoMaker.minRandomNum++;
	             break;
	             case 9200:
	             MeteoMaker.minRandomNum++;
	             break;
	             */
	    }
	}
	
	update:function()
	{
	    if(GameData.gameState != GameData.STATE_PLAYING)
	    {
	        return;
	    }
	    
	    this.updateCharAnimation();
	    this.time++;
	    if(this.time == 2500)
	    {
	        this.makeMeteorItemShield();
	        this.time = 0;
	    }
	    
	    for(var i=0; i<this.arrayMeteorMaker.length; i++)
	    {
	    	arrayMeteorMaker[i].update();
	    }	
	        	    
	    for(var i=0; i<this.arrayMeteorites.length; i++)
	    {
	    	arrayMeteorites[i].update();
	    }	    	    
	}
	
	updateShield:function()
	{
	    if(GameData.gameState == GameData.STATE_PAUSE)
	    {
	        return;
	    }
	    
	    this.remainShieldCoolTime--;
	},
	
	updateStateBar:function()
	{
	    if(GameData.gameState == GameData.STATE_PAUSE)
	    {
	        return;
	    }
	    
	    if(this.currentHP <= 0)
	    {
	        this.sprHpBar.setVisible(false);
	        this.sprHpFrame.setVisible(false);
	        return;
	    }
	    else if(this.currentHP != GameData.HP_MAX)
	    {
	        this.currentHP++;
	    }
	    this.sprHpBar.setTextureRect(cc.RectMake(0, 0, this.stateBarWidth * this.currentHP / GameData.HP_MAX, 80));
	    if(this.currentHP == GameData.HP_MAX)
	    {
	        this.sprHpBar.setVisible(false);
	        this.sprHpFrame.setVisible(false);
	        this.unschedule(this.updateStateBar);
	    }
	},
	
	updateHitCoolTime:function()
	{
	    if(GameData.gameState == GameData.STATE_PAUSE)
	    {
	        return;
	    }
	    
	    this.remainHitCoolTime--;
	    if(this.remainHitCoolTime == 0)
	    {
	        this.sprCharacter.setVisible(true);
	        //        sprCharacter.setOpacity(255);
	        this.unschedule(this.updateHitCoolTime);
	        return;
	    }
	    this.sprCharacter.setVisible(remainHitCoolTime % 20 < 7 ? false : true);
	},
	
	updateFlash:function()
	{
	    if(GameData.gameState == GameData.STATE_PAUSE)
	    {
	        return;
	    }
	    this.layerColorFlash.setOpacity(this.layerColorFlash.getOpacity() - 5);
	    if(this.layerColorFlash.getOpacity() == 0)
	    {
	        this.layerColorFlash.setVisible(false);
	        this.unschedule(this.updateFlash);
	    }
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
	    if(absRunNum <= 0 && this.runMode != 0)
	    {
	        absRunNum = 1;
	    }
	    else if(absRunNum >= 19)
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
	
	updateGameOverCoolTime:function()
	{
	    remainGameOverCoolTime--;
	    if(remainGameOverCoolTime == 0)
	    {
	        this.unschedule(schedule_selector(GameScene.updateGameOverCoolTime));
	    }
	},
		
	startShield:function()
	{
	    isShield = true;
	    remainShieldCoolTime = remainShieldCoolTimeMax;
	    //    remainShieldHpMax = arrayMeteorMaker.count() * 1800;
	    //    remainShieldHp = remainShieldHpMax;
	    
	    sprShield.setVisible(true);
	    sprShield.setOpacity(195);
	    sprShield.setTexture(CCTextureCache.sharedTextureCache().addImage("shieldcircle.png"));
	    
	    CCScaleTo* scaleAction = CCScaleTo.create(0.1f,  1.0f);
	    sprShield.runAction(CCSequence.create(scaleAction, NULL));
	    
	    this.schedule(schedule_selector(GameScene.updateShield));
	},
	
	stopShield:function()
	{
	    isShield = false;
	    remainShieldCoolTime = 0;
	    sprShield.setVisible(false);
	    sprShield.setScale(0);
	    this.unschedule(schedule_selector(GameScene.updateShield));
	    CCLOG("stopShield");
	},
		
	startComboEffect:function()
	{
	    if(currentCombo % 10 == 0 || currentCombo == 2)
	    {
	        //        bool combo100 = currentCombo % 100 == 0 ? true : false;
	        /*
	         CCScaleTo* scaleAction = CCScaleTo.create(0.02f, currentCombo % 100 == 0 ? 1.3f : 1.0f);
	         CCScaleTo* scaleActionReverse = CCScaleTo.create(0.05f, 0.8f);
	         CCScaleTo* scaleAction2 = CCScaleTo.create(0.02f, currentCombo % 100 == 0 ? 1.3f : 1.0f);
	         CCScaleTo* scaleActionReverse2 = CCScaleTo.create(0.05f, 0.8f);
	         CCScaleTo* scaleAction3 = CCScaleTo.create(0.02f, currentCombo % 100 == 0 ? 1.5 : 1.25f);
	         CCScaleTo* scaleActionReverse3 = CCScaleTo.create(0.05f, 1.0f);
	         */
	        bool temp = currentCombo % 100 == 0;
	        
	        CCScaleTo* scaleAction = CCScaleTo.create(temp ? 0.03f : 0.02f, temp ? 1.4f : 1.15f);
	        CCScaleTo* scaleActionReverse = CCScaleTo.create(0.05f, 1.0f);
	        CCScaleTo* scaleAction2 = CCScaleTo.create(temp ? 0.03f : 0.02f, temp ? 1.4f : 1.15f);
	        CCScaleTo* scaleActionReverse2 = CCScaleTo.create(0.05f, 1.0f);
	        temp = currentCombo == 200 || currentCombo == 400 || currentCombo == 700 || currentCombo == 1000;
	        CCScaleTo* scaleAction3 = CCScaleTo.create(temp ? 0.05f : 0.02f, temp ? 2.0f : 1.15f);
	        CCScaleTo* scaleActionReverse3 = CCScaleTo.create(0.05f, 1.0f);
	        //    CCAction* actions = CCSpawn.create(scaleActionReverse, scaleAction, NULL);
	        //    labelCombo.runAction(actions);
	        //    labelComboNum.runAction(actions);
	        labelComboNum.runAction(CCSequence.create(scaleAction, scaleActionReverse, NULL));
	        labelCombo.runAction(CCSequence.create(scaleAction2, scaleActionReverse2, NULL));
	        labelComboMul.runAction(CCSequence.create(scaleAction3, scaleActionReverse3, NULL));
	    }
	}
	
	void GameScene.startFlash(int r, int g, int b, int a)
	{
	    layerColorFlash.setColor(ccc3(r, g, b));
	    layerColorFlash.setOpacity(a);
	    layerColorFlash.setVisible(true);
	    this.schedule(schedule_selector(GameScene.updateFlash));
	}
	/*
	 void GameScene.startRunReverse(int coolTime)
	 {
	 remainRunReverseCoolTime = coolTime;
	 }
	 */
	void GameScene.startBackgroundMusic()
	{
	    CocosDenshion.SimpleAudioEngine* instance = CocosDenshion.SimpleAudioEngine.sharedEngine();
	    instance.stopBackgroundMusic();
	    
	    
	    int bgmNumber = GameData.currentBgmNumber;
	    if(bgmNumber == 0)
	    {
	        bgmNumber = rand() % GameData.openedBgmNumber + 1;
	    }
	    
	    if(GameData.isMusicSound)
	    {
	        switch(bgmNumber)
	        {
	                /*
	                 case 1:
	                 instance.playBackgroundMusic(GameData.isHardCore ? "BGM1-fast.mp3" : "BGM1-normal.mp3", true);
	                 break;
	                 case 2:
	                 instance.playBackgroundMusic(GameData.isHardCore ? "BGM2-fast.mp3" : "BGM2-normal.mp3", true);
	                 break;
	                 case 3:
	                 instance.playBackgroundMusic(GameData.isHardCore ? "BGM3-fast.mp3" : "BGM3-normal.mp3", true);
	                 break;
	                 case 4:
	                 instance.playBackgroundMusic(GameData.isHardCore ? "BGM4-fast.mp3" : "BGM4-fast.mp3", true);
	                 break;
	                 */
	            case 1:
	                instance.playBackgroundMusic("BGM1-normal.mp3", true);
	                break;
	            case 2:
	                instance.playBackgroundMusic("BGM2-normal.mp3", true);
	                break;
	            case 3:
	                instance.playBackgroundMusic("BGM3-normal.mp3", true);
	                break;
	            case 4:
	                instance.playBackgroundMusic("BGM4-fast.mp3", true);
	                break;
	            case 5:
	                instance.playBackgroundMusic("BGM1-fast.mp3", true);
	                break;
	            case 6:
	                instance.playBackgroundMusic("BGM2-fast.mp3", true);
	                break;
	            case 7:
	                instance.playBackgroundMusic("BGM3-fast.mp3", true);
	                break;
	        }
	    }
	    
	    //    instance.playEffect("background_music_main.mp3", true);
	}
	
	void GameScene.startSoundEffect(std.string fileName)
	{
	    if(/*GameData.isEffectSound*/GameData.isMusicSound)
	    {
	        (CocosDenshion.SimpleAudioEngine.sharedEngine()).playEffect(fileName.c_str());
	    }
	}
	
	void GameScene.gamePause()
	{
	    if(!gameScene)
	    {
	        return;
	    }
	    /*
	     CCARRAY_FOREACH(childs, child)
	     {
	     child.pauseSchedulerAndActions();
	     }
	     */
	    CCDirector.sharedDirector().pause();
	    CCDirector.sharedDirector().setAnimationInterval(1.0 / 60);
	    
	    if((CocosDenshion.SimpleAudioEngine.sharedEngine()).isBackgroundMusicPlaying())
	    {
	        (CocosDenshion.SimpleAudioEngine.sharedEngine()).pauseBackgroundMusic();
	    }
	    
	    GameData.gameState = GameData.STATE_PAUSE;
	    
	    sprLeftController.setVisible(false);
	    sprRightController.setVisible(false);
	    menuItemPause.setVisible(false);
	    layerPauseMenu.setVisible(true);
	    
	    layerCombo.setVisible(false);
	    
	    menuBtnPause.setEnabled(false);
	    labelScore.setVisible(false);
	    labelScoreSpell.setVisible(false);
	    sprHighestScore.setVisible(false);
	    
	    sprCharacter.setVisible(true);
	    sprHpBar.setVisible(false);
	    sprHpFrame.setVisible(false);
	    layerColorFlash.setVisible(false);
	    sprCharacter.setTexture(CCTextureCache.sharedTextureCache().addImage("player_stand.png"));
	    sprCharacter.setFlipX(false);
	}
	
	void GameScene.gameResume()
	{
	    if(!gameScene)
	    {
	        return;
	    }
	    
	    //    CCDirector.sharedDirector().startAnimation();
	    CCDirector.sharedDirector().resume();
	    
	    if(GameData.isMusicSound)
	    {
	        if(bgmSettingChanged)
	        {
	            startBackgroundMusic();
	            bgmSettingChanged = false;
	        }
	        else
	        {
	            (CocosDenshion.SimpleAudioEngine.sharedEngine()).resumeBackgroundMusic();
	        }
	    }
	    
	    sprLeftController.setVisible(true);
	    sprRightController.setVisible(true);
	    menuItemPause.setVisible(true);
	    layerPauseMenu.setVisible(false);
	    
	    if(currentCombo >= 2)
	    {
	        layerCombo.setVisible(true);
	    }
	    
	    layerColorFlash.setVisible(true);
	    menuBtnPause.setEnabled(true);
	    labelScore.setVisible(true);
	    labelScoreSpell.setVisible(true);
	    /*
	     if(isHighestScore)
	     {
	     sprHighestScore.setVisible(true);
	     }
	     */
	    if(currentHP != HP_MAX)
	    {
	        sprHpBar.setVisible(true);
	        sprHpFrame.setVisible(true);
	    }
	    GameData.gameState = GameData.STATE_PLAYING;
	}
	
	void GameScene.screenTouching()
	{
	    if(GameData.gameState == GameData.STATE_PAUSE)
	    {
	        return;
	    }
	    
	    GameData.playerX += /*remainRunReverseCoolTime <= 0 ?*/ runMode/* : -runMode*/;
	    if(GameData.playerX < 0)
	    {
	        GameData.playerX += 360;
	    }
	    else if(GameData.playerX >= 360)
	    {
	        GameData.playerX -= 360;
	    }
	    
	    sprPlanet.setRotation(GameData.playerX);
	    //    sprBackground.setRotation(GameData.playerX);
	    layerParticle.setRotation(GameData.playerX);
	    //   this.setRotation(GameData.playerX);
	}
	
	void GameScene.startTouchSchedule()
	{
	    this.schedule(schedule_selector(GameScene.screenTouching));
	    /*
	     switch(runMode)
	     {
	     case -1:
	     sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlRD.png"));
	     break;
	     case -2:
	     sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlRU.png"));
	     break;
	     case 1:
	     sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlLD.png"));
	     break;
	     case 2:
	     sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlLU.png"));
	     break;
	     }
	     */
	}
	
	void GameScene.stopTouchSchedule()
	{
	    this.unschedule(schedule_selector(GameScene.screenTouching));
	}
	
	void GameScene.registerWithTouchDispatcher()
	{
	    CCDirector.sharedDirector().getTouchDispatcher().addTargetedDelegate(this, 0, true);
	}
	
	bool GameScene.ccTouchBegan(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent) //Not optional
	{
	    //    CCLOG("began start %d", touchCount);
	    if(GameData.gameState == GameData.STATE_GAMEOVER)
	    {
	        if(remainGameOverCoolTime == 0 && layerGameover.isVisible())
	        {
	            startSoundEffect("pong.wav");
	            enterHome();
	        }
	        //        CCLOG("began false %d", touchCount);
	        return false;
	    }
	    
	    touchArray.addObject(pTouch);
	    
	    currentTouch = pTouch;
	    CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(pTouch.getLocationInView());
	    setRunModeWithPoint(touchPoint.x, touchPoint.y);
	    startTouchSchedule();
	    /*
	     if(touchCount == 0)
	     {
	     CCTouch *touch = (CCTouch*)(touches.anyObject());
	     CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(touch.getLocationInView());
	     setRunModeWithPoint(touchPoint.x);
	     startTouchSchedule();
	     }
	     */
	    //    touchCount++;
	    touchCount++;
	    //    CCLOG("began end %d", touchCount);
	    return true;
	}
	
	void GameScene.ccTouchMoved(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent)
	{
	    //    CCLOG("moved start %d", touchCount);
	    if(pTouch == currentTouch)
	    {
	        CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(pTouch.getLocationInView());
	        setRunModeWithPoint(touchPoint.x, touchPoint.y);
	    }
	    //    CCLOG("moved end %d", touchCount);
	}
	
	void GameScene.ccTouchEnded(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent)
	{
	    //    CCLOG("ended start %d", touchCount);
	    touchCount--;
	    bool isCurrentTouch = false;
	    
	    if(touchCount == 0)
	    {
	        runMode = 0;
	        sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	        sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	        stopTouchSchedule();
	        touchArray.removeAllObjects();
	    }
	    else
	    {
	        if(pTouch == currentTouch)
	        {
	            isCurrentTouch = true;
	        }
	        touchArray.removeObject(pTouch);
	        if(isCurrentTouch)
	        {
	            currentTouch = (CCTouch*) touchArray.objectAtIndex(0);
	            CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(currentTouch.getLocationInView());
	            setRunModeWithPoint(touchPoint.x, touchPoint.y);
	        }
	    }
	    //    CCLOG("ended end %d", touchCount);
	}
	
	void GameScene.ccTouchCancelled(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent)
	{
	    //    CCLOG("cancel start %d", touchCount);
	    touchCount--;//-= touches.count();
	    
	    //    CCSetIterator it;
	    //    CCTouch* touch;
	    /*
	     int count = touchArray.count();
	     for(int i = count - 1; i >= 0; i++)
	     {
	     touchArray.removeObjectAtIndex(i);
	     }
	     */
	    touchArray.removeObject(pTouch);
	    
	    runMode = 0;
	    sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	    sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	    stopTouchSchedule();
	    //    CCLOG("cancel end %d", touchCount);
	}
	//
	//// 손가락이 화면에 닿을 때
	//void GameScene.ccTouchesBegan(CCSet *touches, CCEvent *event)
	//{
	//    if(GameData.gameState == GameData.STATE_GAMEOVER)
	//    {
	//        if(layerGameover.isVisible())
	//        {
	//            startSoundEffect("pong.wav");
	//            enterHome();
	//        }
	//        return;
	//    }
	//
	//    CCSetIterator it;
	//    CCTouch* touch;
	//
	//    for(it=touches.begin(); it!=touches.end(); it++)
	//    {
	//        touch = (CCTouch*)(*it);
	//        touchArray.addObject(touch);
	//    }
	//    currentTouch = touch;
	//    CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(touch.getLocationInView());
	//    setRunModeWithPoint(touchPoint.x, touchPoint.y);
	//    startTouchSchedule();
	//    /*
	//     if(touchCount == 0)
	//     {
	//     CCTouch *touch = (CCTouch*)(touches.anyObject());
	//     CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(touch.getLocationInView());
	//     setRunModeWithPoint(touchPoint.x);
	//     startTouchSchedule();
	//     }
	//     */
	//    //    touchCount++;
	//    touchCount += touches.count();
	//}
	//
	//// 손가락이 드래그 될 때
	//void GameScene.ccTouchesMoved(CCSet *touches, CCEvent *event)
	//{
	//    CCSetIterator it;
	//    CCTouch* touch;
	//
	//    for(it=touches.begin(); it!=touches.end(); it++)
	//    {
	//        touch = (CCTouch*)(*it);
	//        if(touch == currentTouch)
	//        {
	//            CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(touch.getLocationInView());
	//            setRunModeWithPoint(touchPoint.x, touchPoint.y);
	//            return;
	//        }
	//    }
	//
	//    /*
	//     CCTouch *touch = (CCTouch*)(touches.anyObject());
	//     CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(touch.getLocationInView());
	//     if(touches.count() == 1)
	//     {
	//     setRunModeWithPoint(touchPoint.x);
	//     }
	//     */
	//
	//    //    char buf[80];
	//    //    sprintf(buf, "Moved %d", touches.count());
	//    //    label.setString(buf);
	//}
	//
	//// 손가락이 화면 밖에 나가거나, 떨 때
	//void GameScene.ccTouchesEnded(CCSet *touches, CCEvent *event)
	//{
	//    CCSetIterator it;
	//    CCTouch* touch;
	//    touchCount -= touches.count();
	//    bool isCurrentTouch = false;
	//
	//    if(touchCount == 0)
	//    {
	//        runMode = 0;
	//        sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	//        sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	//        stopTouchSchedule();
	//        touchArray.removeAllObjects();
	//    }
	//    else
	//    {
	//        for(it=touches.begin(); it!=touches.end(); it++)
	//        {
	//            touch = (CCTouch*)(*it);
	//            if(touch == currentTouch)
	//            {
	//                isCurrentTouch = true;
	//            }
	//            touchArray.removeObject(touch);
	//        }
	//        if(isCurrentTouch)
	//        {
	//            currentTouch = (CCTouch*) touchArray.objectAtIndex(0);
	//            CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(currentTouch.getLocationInView());
	//            setRunModeWithPoint(touchPoint.x, touchPoint.y);
	//        }
	//    }
	//    /*
	//     touchCount -= touches.count();
	//     if(touchCount == 0)
	//     {
	//     stopTouchSchedule();
	//     }
	//     */
	//}
	//
	//// 갑자기 핸드폰이 정지될 때
	//void GameScene.ccTouchesCancelled(cocos2d.CCSet* touches, cocos2d.CCEvent* event)
	//{
	//    CCLog("cc cancelled %d", touchCount);
	//    touchCount = 0;//-= touches.count();
	//
	////    CCSetIterator it;
	////    CCTouch* touch;
	///*
	//    int count = touchArray.count();
	//    for(int i = count - 1; i >= 0; i++)
	//    {
	//        touchArray.removeObjectAtIndex(i);
	//    }
	// */
	//    touchArray.removeAllObjects();
	//
	//    runMode = 0;
	//    sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	//    sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	//    stopTouchSchedule();
	//
	//    /*
	//
	//    for(it=touches.begin(); it!=touches.end(); it++)
	//    {
	//        touch = (CCTouch*)(*it);
	//        touchArray.removeObject(touch);
	//    }
	//    if(touchArray.count() != 0)
	//    {
	//        currentTouch = (CCTouch*) touchArray.objectAtIndex(0);
	//        CCPoint touchPoint = CCDirector.sharedDirector().convertToGL(currentTouch.getLocationInView());
	//        setRunModeWithPoint(touchPoint.x, touchPoint.y);
	//    }
	//    else
	//    {
	//        runMode = 0;
	//        sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	//        sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	//        stopTouchSchedule();
	//    }
	//     */
	//}
	
	void GameScene.setRunModeWithPoint(int x, int y)
	{
	    //    runMode = x / -100 + (x < 400 ? 4 : 3);
	    /*
	     if(x<150)
	     {
	     runMode = 2;
	     }
	     else if(x<375)
	     {
	     runMode = 1;
	     }
	     else if(x<425)
	     {
	     runMode = 0;
	     }
	     else if(x<650)
	     {
	     runMode = -1;
	     }
	     else
	     {
	     runMode = -2;
	     }
	     *///87 + 65 142 22
	    if(x>=-20 && x<=150)
	    {
	        if(y>=-20 && y<=150)
	        {
	            if(runMode != 1)
	            {
	                sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlLD.png"));
	                sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	            }
	            runMode = 1;
	        }
	        else if(y>150 && y<=300)
	        {
	            if(runMode != 2)
	            {
	                sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlLU.png"));
	                sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	            }
	            runMode = 2;
	        }
	        else
	        {
	            if(runMode != 0)
	            {
	                sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	                sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	            }
	            runMode = 0;
	        }
	    }
	    else if(x>=750 && x<=920)
	    {
	        if(y>=-20 && y<=150)
	        {
	            if(runMode != -1)
	            {
	                sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	                sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlRD.png"));
	            }
	            runMode = -1;
	        }
	        else if(y>150 && y<=300)
	        {
	            if(runMode != -2)
	            {
	                sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	                sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlRU.png"));
	            }
	            runMode = -2;
	        }
	        else
	        {
	            if(runMode != 0)
	            {
	                sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	                sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	            }
	            runMode = 0;
	        }
	    }
	    else
	    {
	        runMode = 0;
	        sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	        sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	    }
	    /*
	     if(remainRunFastCoolTime > 0)
	     {
	     runMode *= 2;
	     }
	     if(remainRunReverseCoolTime > 0)
	     {
	     runMode *= -1;
	     }
	     */
	    /*
	     if(x<100)
	     {
	     runMode = 2;
	     }
	     else if(x<450)
	     {
	     runMode = 1;
	     }
	     else if(x<800)
	     {
	     runMode = -1;
	     }
	     else
	     {
	     runMode = -2;
	     }
	     */
	    /*
	     if(x<150)
	     {
	     runMode = RUN_MODE_RIGHT_FAST;
	     }
	     else if(x<400)
	     {
	     runMode = RUN_MODE_RIGHT;
	     }
	     else if(x<650)
	     {
	     runMode = RUN_MODE_LEFT;
	     }
	     else
	     {
	     runMode = RUN_MODE_LEFT_FAST;
	     }
	     */
	}
	
	void GameScene.gameOver()
	{
	    GameData.gameState = GameData.STATE_GAMEOVER;
	    CocosDenshion.SimpleAudioEngine.sharedEngine().stopBackgroundMusic();
	    
	    runMode = 0;
	    updateCharAnimation();
	    menuBtnPause.setVisible(false);
	    sprLeftController.setVisible(false);
	    sprRightController.setVisible(false);
	    sprHpBar.setVisible(false);
	    sprHpFrame.setVisible(false);
	    stopTouchSchedule();
	    //    layerColorFlash.setOpacity(0);
	    layerColorFlash.setVisible(false);
	    stopShield();
	    layerParticle.setVisible(false);
	    
	    this.unschedule(schedule_selector(GameScene.updateHitCoolTime));
	    this.unschedule(schedule_selector(GameScene.updateFlash));
	    this.unschedule(schedule_selector(GameScene.updateStateBar));
	    
	    saveHighScore();
	    
	    if(currentHP <= 0)
	    {
	        /*
	         if(!isHighestScore)
	         {
	         sprHighestScore.setPosition(ccp(750, 160));
	         char buf[16] = {0};
	         sprintf(buf, "%d", GameData.isHardCore ? GameData.highestHardcoreScore : GameData.highestNormalScore);
	         
	         CCLabelBMFont* labelHighest = CCLabelBMFont.create(buf, "bmfontCB64.fnt");;
	         labelHighest.setPosition(ccp(750, 100));
	         labelHighest.setColor(ccc3(255, GameData.isHardCore ? 0 : 255, 0));
	         labelHighest.setScale(0.8f);
	         layerGameover.addChild(labelHighest);
	         sprHighestScore.setVisible(true);
	         }
	         */
	        labelScore.stopAllActions();
	        //        labelScoreSpell.stopAllActions();
	        labelScore.setAnchorPoint(ccp(0.5f, 0.5f));
	        //        labelScoreSpell.setAnchorPoint(ccp(0.5f, 0.5f));
	        labelScore.setPosition(ccp(planetCenterX, planetCenterY));
	        labelScore.setScale(1.0);
	        //        labelScoreSpell.setPosition(ccp(planetCenterX, planetCenterY + 65));
	        //        labelScoreSpell.setScale(0.8f);
	        labelScoreSpell.setVisible(false);
	        
	        if(isHighestScore)
	        {
	            labelScore.setColor(ccc3(255, GameData.isHardCore ? 0 : 255, 0));
	        }
	        else
	        {
	            sprHighestScore.setPosition(ccp(750, 160));
	            char buf[16] = {0};
	            sprintf(buf, "%d", GameData.isHardCore ? GameData.highestHardcoreScore : GameData.highestNormalScore);
	            
	            CCLabelBMFont* labelHighest = CCLabelBMFont.create(buf, "bmfontCB64.fnt");;
	            labelHighest.setPosition(ccp(750, 100));
	            labelHighest.setColor(ccc3(255, GameData.isHardCore ? 0 : 255, 0));
	            labelHighest.setScale(0.8f);
	            layerGameover.addChild(labelHighest);
	        }
	        sprHighestScore.setVisible(true);
	        layerGameover.setVisible(true);
	    }
	}

	void GameScene.saveFile()
	{
	    FileIO.sharedInstance().saveFile();
	}

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
    	this.sprPlanet.setPosition(cc.p(450, 100));
    	this.sprPlanet.setRotation(GameData.GameData.playerX);
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
	     sprMpBar = CCSprite.create("MpGauge.png");
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
	    this.layerParticle.setRotation(GameData.GameData.playerX);
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
	    CCSprite* sprOptionVibration = CCSprite.create("vibration.png");
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
	    if(GameData.isVibrate)
	    {
	        btn3_1 = CCMenuItemImage.create("on.png", "off.png");
	        btn3_2 = CCMenuItemImage.create("off.png", "on.png");
	    }
	    else
	    {
	        btn3_2 = CCMenuItemImage.create("on.png", "off.png");
	        btn3_1 = CCMenuItemImage.create("off.png", "on.png");
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
// //	    var toggle3 = CCMenuItemToggle.createWithTarget(this, menu_selector(MenuScene.clickOptionVibrate), btn3_1, btn3_2, NULL);

	    
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

