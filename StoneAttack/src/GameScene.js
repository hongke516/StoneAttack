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

	// arrayMeteorites:[],
	arrayMeteorMaker:[],

	sprCharacter:null, // CCSprite
	sprPlanet:null, // CCSprite			
	sprBgmNumber:null, // CCSprite
	sprBackground:null,
	sprHpBar:null,
	sprHpFrame:null,
	sprHowToPlay:null,
	
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
	////
	key:null,
	lastMeteor:null,
	isShift:false,
	
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

	    this.schedule(this.update);
	    
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
	    
		this.sprHowToPlay = cc.Sprite.create(s_howtoplay_png);
		this.sprHowToPlay.setPosition(cc.p(450, 300));
		this.addChild(this.sprHowToPlay, 6);    
		this.menuBtnPause.setVisible(false);
		this.labelScore.setVisible(false);
		this.labelScoreSpell.setVisible(false);
	    
	    this.startGame();	
		
		this.setKeyboardEnabled(true);
        this.setTouchEnabled(true);
        return true;
    },    

	startGame:function()
	{
	    this.removeMakerAndMeteorites();
	    // this.makeMeteorMaker();
	    
	    this.stopShield();
	    this.time = 0;
	    this.deltaComboNum = 1;
	    this.currentCombo = 0;
	    this.realMeteorScore = 0;
	    
	    this.preLevelScore = 0;
	    this.preLevelUpNeed = 1;
	    this.runReverse = false;
	    this.runMode = 0;
	    this.currentHP = GameData.HP_MAX;
	    GameData.currentScore = 0;
	    
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
	    this.labelScore.setPosition(cc.p(765, 570));
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
	    this.saveFile();
	},
	
	makeShieldParticle:function(meteor)
	{
	    /*var tempParticle = */ParticleExplosionSprite.createWithPoint(s_shield_particle_png, meteor.sprite.getPosition());
	    // this.addChild(tempParticle.sprite, 5);
	    ////
		this/*.layerParticle*/.addChild(ParticleExplosionSprite.items[ParticleExplosionSprite.items.length - 1].sprite, 5);	    
//	    tempParticle.deltaOpacity(10);
	    // tempParticle.start();
	},
	
	makeRotationParticle:function(position)
	{
	    /*var tempParticle = */ParticleExplosionSprite.createWithPoint(s_star_particle_png, position);
	    // this.layerParticle.addChild(tempParticle.sprite);
		this.layerParticle.addChild(ParticleExplosionSprite.items[ParticleExplosionSprite.items.length - 1].sprite);	    
	    //tempParticle.start();
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
	{////
	    // var buf = MeteorSprite.create(x);
//		var buf = new MeteorSprite();
		// buf.construct(x);
		// var randNum = Math.floor(Math.random() * 4);
		// switch(randNum)
		// {
			// case 0:
				// buf.initWithFile(s_metheo1_png);
				// break;
			// case 1:
				// buf.initWithFile(s_metheo2_png);
				// break;
			// case 2:
				// buf.initWithFile(s_metheo3_png);
				// break;
			// case 3:
				// buf.initWithFile(s_metheo4_png);
				// break;
		// }
		MeteorSprite.create(x);
		this.addChild(MeteorSprite.items[MeteorSprite.items.length-1].sprite, 6);
		// var meteor = MeteorSprite.create(x);
		// this.addChild(meteor.sprite, 6);
	    // this.addChild(buf.sprite, 6);
//	    this.arrayMeteorites.push(buf);
	},
	
	makeMeteorItemHp:function()
	{
		MeteorSprite.createHp();
		this.addChild(MeteorSprite.items[MeteorSprite.items.length-1].sprite, 6);		
	    // var buf = MeteorSprite.createHp();
	    // this.addChild(buf, 6);
	    // this.arrayMeteorites.push(buf);
	},
	
	makeMeteorItemShield:function()
	{
	    var randNum = Math.floor(Math.random() * 180) + GameData.playerX;
	    
	    var rangeX = this.randNum >= 360 ? this.randNum - 360 : this.randNum;
		MeteorSprite.createShield(rangeX);
		this.addChild(MeteorSprite.items[MeteorSprite.items.length-1].sprite, 6);	    
	    // var buf = MeteorSprite.createShield(rangeX);
	    // this.addChild(buf, 6);
	    // this.arrayMeteorites.push(buf);

	    randNum = null;
	    rangeX = null;
	},
	
	makeMeteorMaker:function()
	{
	    // var buf = MeteorMaker.create();
		var buf = new MeteorMaker();
		buf.construct(Math.floor(Math.random() * 360));	    
	    this.arrayMeteorMaker.push(buf);
	    cc.log("메이커 : " + this.arrayMeteorMaker.length + "\n스코어 : " + this.realMeteorScore);

	    buf = null;
	},

	collidePlanet:function(meteor)
	{
	    var dx = meteor.MeteorX;
	    var x = GameData.planetCenterX + GameData.cosTable[dx < 0 ? dx + 360 : dx] * meteor.MeteorY;
	    var y = GameData.planetCenterY + GameData.sinTable[dx < 0 ? dx + 360 : dx] * meteor.MeteorY;
	    // cc.log("meteoY:"+meteor.meteoY + " " + dx + " " + GameData.planetCenterX + " " + GameData.planetCenterY);
	    // this.makeRotationParticle(cc.p(x, y));
	    this.makeRotationParticle(cc.p(x, y));	    
	    
	    //    int dropSpeed = meteor.dropSpeed;
	    
	    // this.arrayMeteorites.removeObject(meteor);
	    this.removeChild(meteor.sprite, true);
	    
	    if(meteor.isShield || meteor.isHp)
	    {
	        return;
	    }
	    
	    this.realMeteorScore++;
	    GameData.currentScore += this.deltaComboNum;
	    this.labelScore.setString(GameData.currentScore + "");
	    
	    if(this.realMeteorScore % 150 == 0)
	    {
	        this.makeMeteorItemHp();
	    }
	    
	    if(!this.isHighestScore && GameData.currentScore > (GameData.isHardCore ? GameData.HighScore.Hardcore : GameData.HighScore.Normal))
	    {
	        this.isHighestScore = true;
	        this.labelScore.setColor(cc.c3b(255, 255, 80));
	        this.labelScore.setPosition(cc.p(733, 570));
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
	    this.labelComboNum.setString(this.currentCombo + "");
	    
	    this.startComboEffect();

	    dx = null;
	    x = null;
	    y = null;
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
	        this.lastMeteor = meteor;
	        return;
	    }
	    ////
	    this.removeChild(meteor.sprite, true);	    
	    // this.arrayMeteorites.splice(this.arrayMeteorites.indexOf(meteor), 1);
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
	    this.removeChild(meteor.sprite, true);	    
	    // this.arrayMeteorites.removeObject(arrayMeteorites.indexOf(meteor), 1);
//	    this.removeChild(meteor, true);
	    this.startSoundEffect(s_itemgot_mp3);
	},

	collideShield:function(meteor)
	{
	    this.makeShieldParticle(meteor);
	    this.makeShieldParticle(meteor);
	    this.makeShieldParticle(meteor);
	    

	    this.removeChild(meteor.sprite, true);
	    // this.arrayMeteorites.removeObject(arrayMeteorites.indexOf(meteor));
	    	    
	    if(this.remainShieldCoolTime <= 0)
	    {
	        var scalePlus = cc.ScaleTo.create(0.1,  1.5);
	        // var actionTo = cc.CallFunc.create(this, this.stopShield);
	        // var action = cc.Sequence.create(scalePlus, actionTo, null);
	        this.sprShield.runAction(/*action*/scalePlus);
	        this.schedule(this.stopShield, 0, false, 0.1);

	        scalePlus = null;
	        return;
	        //CCSequence.actions(액션,CCCallFuncN.actionWithTarget(this, callfuncN_selector(네임 스페이스.finishChk)), NULL);
	    }
	    else
	    {
	        var scaleAction = cc.ScaleTo.create(0.02,  0.8);
	        var scaleActionReverse = cc.ScaleTo.create(0.02, 1.0);
	        this.sprShield.runAction(cc.Sequence.create(scaleAction, scaleActionReverse, null));
	        
	        var perTime = this.remainShieldCoolTime / this.remainShieldCoolTimeMax;
	        this.sprShield.setTexture(cc.TextureCache.getInstance().addImage(perTime >= 0.8 ? s_shieldcircle_png : perTime >= 0.6 ? 
	        	s_shieldcircledmg1_png : perTime >= 0.4 ? s_shieldcircledmg2_png : perTime >= 0.4 ? s_shieldcircledmg3_png : s_shieldcircledmg4_png));

	        scaleAction = null;
	        scaleActionReverse = null;
	        perTime = null;
	    }	    
	},
	
	enterHome:function()
	{
	    this.layerGameover.setVisible(false);
	    this.sprHighestScore.setVisible(false);
	    this.labelScore.setVisible(false);
	    this.layerCombo.setVisible(false);
	    this.labelScoreSpell.setVisible(false);
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
	    // var count = this.arrayMeteorites.length;
	    var count = MeteorSprite.items.length;
	    for(var i = count-1; i >= 0; i--)
	    {
	        // var buf = this.arrayMeteorites[i];
	        var buf = MeteorSprite.items[i];
	        this.removeChild(buf.sprite, true);
	        // this.arrayMeteorites.splice(i);
//	        this.removeChild(buf, true);
	    }
        MeteorSprite.items = [];
        if(this.lastMeteor != null)
        {
        	this.removeChild(this.lastMeteor.sprite, true);
        }    
        this.lastMeteor = null;
	},
	
	updateEnterHome:function()
	{
	    if(GameData.isHardCore)
	    {
	        GameData.playerX = (GameData.playerX <= 275 && GameData.playerX >= 265) ? 270 : (GameData.playerX > 90 && GameData.playerX < 265) ? GameData.playerX + 5 : GameData.playerX - 5;
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
	    this.startSoundEffect(s_pong_mp3);
	    this.gamePause();
	},
	
	clickBtnResume:function()
	{
	    this.startSoundEffect(s_pong_mp3);
	    this.gameResume();
	},
	
	clickBtnRestart:function()
	{
	    this.startSoundEffect(s_pong_mp3);
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
	    this.startSoundEffect(s_pong_mp3);
	    this.stopAllBackgroundMusic();
//	    this.pauseAllBackgroundMusic();
	
	    this.layerOptionBox.setVisible(true);
	    this.menuStatePause.setVisible(false);
	    this.sprPauseLabel.setVisible(false);
	    this.menuBtnSetting.setVisible(false);
	},
	
	clickBtnExit:function()
	{
	    this.startSoundEffect(s_pong_mp3);
	    //    stopShield();
	    this.saveHighScore();
	    this.gameResume();
	    this.gameOver();
	    this.enterHome();
	    this.remainHitCoolTime = 0;
	    this.sprCharacter.setVisible(true);
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
	        ////
	        // CocosDenshion.SimpleAudioEngine* instance = CocosDenshion.SimpleAudioEngine.sharedEngine();
	        // instance.stopBackgroundMusic();
	    }
	    this.bgmSettingChanged = true;
	},
	
	clickOptionSE:function()
	{
		GameData.isSoundEffect = !GameData.isSoundEffect;
	 	this.startSoundEffect(s_pong_mp3);
	 	this.saveFile();
	},
	/*
	void GameScene.clickOptionVibrate()
	{
	    startSoundEffect("pong.mp3");
	    GameData.isVibrate = !GameData.isVibrate;
	    saveFile();
	}
	*/
	clickOptionExit:function()
	{
	    this.startSoundEffect(s_pong_mp3);
	    
	    this.menuStatePause.setVisible(true);
	    this.sprPauseLabel.setVisible(true);
	    //    menuStatePause.setEnabled(true);
	    this.layerOptionBox.setVisible(false);
	    //    sprBtnSettingSelected.setVisible(false);
	    this.menuBtnSetting.setVisible(true);
	    
	    this.stopAllBackgroundMusic();
	    // if(this.bgmSettingChanged)
	    // {
	    	// this.stopAllBackgroundMusic();
	    	////
	        // CocosDenshion.SimpleAudioEngine* instance = CocosDenshion.SimpleAudioEngine.sharedEngine();
	        // instance.stopBackgroundMusic();
	    // }
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
	
	ChangeSpeedDifficulty:function()
	{
	    if (this.realMeteorScore - this.preLevelScore >= this.preLevelUpNeed)
	    {
	        this.preLevelUpNeed += (this.arrayMeteorMaker.length < 11) ? this.preLevelUpNeed : 0;
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
	},
	
	update:function()
	{
	    if(GameData.gameState != GameData.STATE_PLAYING || this.sprHowToPlay != null)
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
	    	this.arrayMeteorMaker[i].update();
	    }	
	    MeteorSprite.update();
	    ParticleExplosionSprite.updatePoint();
	    
	    /*    	    
	    for(var i=0; i<this.arrayMeteorites.length; i++)
	    {
	    	this.arrayMeteorites[i].update();
	    }
	    */	    	    
	},
	
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
	    this.sprCharacter.setVisible(this.remainHitCoolTime % 20 < 7 ? false : true);
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

	    absNum = null;
	},
	
	updateGameOverCoolTime:function()
	{
	    this.remainGameOverCoolTime--;
	    if(this.remainGameOverCoolTime == 0)
	    {
	        this.unschedule(this.updateGameOverCoolTime);
	    }
	},
		
	startShield:function()
	{
	    this.isShield = true;
	    this.remainShieldCoolTime = this.remainShieldCoolTimeMax;
	    
	    this.sprShield.setVisible(true);
	    this.sprShield.setOpacity(195);
	    this.sprShield.setTexture(cc.TextureCache.getInstance().addImage(s_shieldcircle_png));
	    
	    var scaleAction = cc.ScaleTo.create(0.1,  1.0);
	    this.sprShield.runAction(cc.Sequence.create(scaleAction, null));
	    
	    this.schedule(this.updateShield);
	},
	
	stopShield:function()
	{
	    this.isShield = false;
	    this.remainShieldCoolTime = 0;
	    this.sprShield.setVisible(false);
	    this.sprShield.setScale(0);
	    this.unschedule(this.updateShield);
	},
		
	startComboEffect:function()
	{
	    if(this.currentCombo % 10 == 0 || this.currentCombo == 2)
	    {
	        var temp = this.currentCombo % 100 == 0;
	        
	        var scaleAction = cc.ScaleTo.create(temp ? 0.03 : 0.02, temp ? 1.4 : 1.15);
	        var scaleActionReverse = cc.ScaleTo.create(0.05, 1.0);
	        var scaleAction2 = cc.ScaleTo.create(temp ? 0.03 : 0.02, temp ? 1.4 : 1.15);
	        var scaleActionReverse2 = cc.ScaleTo.create(0.05, 1.0);
	        temp = this.currentCombo == 200 || this.currentCombo == 400 || this.currentCombo == 700 || this.currentCombo == 1000;
	        var scaleAction3 = cc.ScaleTo.create(temp ? 0.05 : 0.02, temp ? 2.0 : 1.15);
	        var scaleActionReverse3 = cc.ScaleTo.create(0.05, 1.0);

	        this.labelComboNum.runAction(cc.Sequence.create(scaleAction, scaleActionReverse, null));
	        this.labelCombo.runAction(cc.Sequence.create(scaleAction2, scaleActionReverse2, null));
	        this.labelComboMul.runAction(cc.Sequence.create(scaleAction3, scaleActionReverse3, null));

	        temp = null;
	        scaleAction = null;
	        scaleActionReverse = null;
	        scaleAction2 = null;
	        scaleActionReverse2 = null;
	        scaleAction3 = null;
	        scaleActionReverse3 = null;
	    }
	},
	
	startFlash:function(r, g, b, a)
	{
	    this.layerColorFlash.setColor(cc.c3b(r, g, b));
	    this.layerColorFlash.setOpacity(a);
	    this.layerColorFlash.setVisible(true);
	    this.schedule(this.updateFlash);
	},

	startBackgroundMusic:function()
	{
	    // CocosDenshion.SimpleAudioEngine* instance = CocosDenshion.SimpleAudioEngine.sharedEngine();
	    // instance.stopBackgroundMusic();
	    ////
	    if(!GameData.isMusicSound)
	    {
	    	return;
	    }
	    	    
		this.stopAllBackgroundMusic(); 
	    
	    var bgmNumber = GameData.currentBgmNumber;
	    if(bgmNumber == 0)
	    {
	        bgmNumber = Math.floor(Math.random() * 7) + 1;
	    }
	    
        switch(bgmNumber)
        {
            case 1:
  				SoundControl.Sound[s_BGM1_normal_mp3].play({loops:999});          
                // instance.playBackgroundMusic("BGM1-normal.mp3", true);
                break;
            case 2:
            	SoundControl.Sound[s_BGM2_normal_mp3].play({loops:999});
                // instance.playBackgroundMusic("BGM2-normal.mp3", true);
                break;
            case 3:
            	SoundControl.Sound[s_BGM3_normal_mp3].play({loops:999});
                // instance.playBackgroundMusic("BGM3-normal.mp3", true);
                break;
            case 4:
	            SoundControl.Sound[s_BGM4_fast_mp3].play({loops:999});
                // instance.playBackgroundMusic("BGM4-fast.mp3", true);
                break;
            case 5:
            	SoundControl.Sound[s_BGM1_fast_mp3].play({loops:999});
                // instance.playBackgroundMusic("BGM1-fast.mp3", true);
                break;
            case 6:
            	SoundControl.Sound[s_BGM2_fast_mp3].play({loops:999});
                // instance.playBackgroundMusic("BGM2-fast.mp3", true);
                break;
            case 7:
            	SoundControl.Sound[s_BGM3_fast_mp3].play({loops:999});
                // instance.playBackgroundMusic("BGM3-fast.mp3", true);
                break;
        }

        bgmNumber = null;
	},
	
	stopAllBackgroundMusic:function()
	{
    	SoundControl.Sound[s_BGM1_normal_mp3].stop();
    	SoundControl.Sound[s_BGM1_fast_mp3].stop();
    	SoundControl.Sound[s_BGM2_normal_mp3].stop();
    	SoundControl.Sound[s_BGM2_fast_mp3].stop();
    	SoundControl.Sound[s_BGM3_normal_mp3].stop();
    	SoundControl.Sound[s_BGM3_fast_mp3].stop();
    	SoundControl.Sound[s_BGM4_fast_mp3].stop();	   		
	},
/*
	pauseAllBackgroundMusic:function()
	{
    	// SoundControl.Sound[s_BGM1_normal_mp3].pause();
    	// SoundControl.Sound[s_BGM1_fast_mp3].pause();
    	// SoundControl.Sound[s_BGM2_normal_mp3].pause();
    	// SoundControl.Sound[s_BGM2_fast_mp3].pause();
    	// SoundControl.Sound[s_BGM3_normal_mp3].pause();
    	// SoundControl.Sound[s_BGM3_fast_mp3].pause();
    	// SoundControl.Sound[s_BGM4_fast_mp3].pause();	   	
		if(!GameData.isMusicSound)
		{
			return;
		}
		switch(GameData.currentBgmNumber)
		{
			case 1:
				SoundControl.Sound[s_BGM1_normal_mp3].pause();
				break;
			case 2:
				SoundControl.Sound[s_BGM2_normal_mp3].pause();
				break;
			case 3:
				SoundControl.Sound[s_BGM3_normal_mp3].pause();
				break;
			case 4:
				SoundControl.Sound[s_BGM4_fast_mp3].pause();
				break;
			case 5:
				SoundControl.Sound[s_BGM1_fast_mp3].pause();
				break;
			case 6:
				SoundControl.Sound[s_BGM2_fast_mp3].pause();
				break;
			case 7:
				SoundControl.Sound[s_BGM3_fast_mp3].pause();
				break;
		}    		
	},
	*/
	resumeBackgroundMusic:function()
	{
		if(!GameData.isMusicSound)
		{
			return;
		}
		switch(GameData.currentBgmNumber)
		{
			case 1:
				SoundControl.Sound[s_BGM1_normal_mp3].play();
				break;
			case 2:
				SoundControl.Sound[s_BGM2_normal_mp3].play();
				break;
			case 3:
				SoundControl.Sound[s_BGM3_normal_mp3].play();
				break;
			case 4:
				SoundControl.Sound[s_BGM4_fast_mp3].play();
				break;
			case 5:
				SoundControl.Sound[s_BGM1_fast_mp3].play();
				break;
			case 6:
				SoundControl.Sound[s_BGM2_fast_mp3].play();
				break;
			case 7:
				SoundControl.Sound[s_BGM3_fast_mp3].play();
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
   /*
	stopAllSoundEffect:function()
	{
    	SoundControl.Sound[s_pong_mp3].stop();
    	SoundControl.Sound[s_itemgot_mp3].stop();
    	SoundControl.Sound[s_puck_mp3].stop();
	},   
	*/
	gamePause:function()
	{
	    if(!GameData.gameScene)
	    {
	        return;
	    }
	    /*
	     CCARRAY_FOREACH(childs, child)
	     {
	     child.pauseSchedulerAndActions();
	     }
	     */
	    cc.Director.getInstance().pause();
	    
	    // cc.Director.getInstance().setAnimationInterval(1.0 / 60);
	    this.stopAllBackgroundMusic();
	    // if(GameData.isMusicSound)
	    // {
// //		    this.pauseAllBackgroundMusic();
	    // }
	    // if((CocosDenshion.SimpleAudioEngine.sharedEngine()).isBackgroundMusicPlaying())
	    // {
	        // (CocosDenshion.SimpleAudioEngine.sharedEngine()).pauseBackgroundMusic();
	    // }
	    
	    
	    GameData.gameState = GameData.STATE_PAUSE;
	    
	    // this.sprLeftController.setVisible(false);
	    // this.sprRightController.setVisible(false);
	    this.menuItemPause.setVisible(false);
	    this.layerPauseMenu.setVisible(true);
	    
	    this.layerCombo.setVisible(false);
	    
	    this.menuBtnPause.setEnabled(false);
	    this.labelScore.setVisible(false);
	    this.labelScoreSpell.setVisible(false);
	    this.sprHighestScore.setVisible(false);
	    
	    this.sprCharacter.setVisible(true);
	    this.sprHpBar.setVisible(false);
	    this.sprHpFrame.setVisible(false);
	    this.layerColorFlash.setVisible(false);
	    this.sprCharacter.setTexture(cc.TextureCache.getInstance().addImage(s_player_stand_png));
	    this.sprCharacter.setFlipX(false);
	},
	
	gameResume:function()
	{
	    if(!GameData.gameScene)
	    {
	        return;
	    }
	    
	    //    CCDirector.sharedDirector().startAnimation();
	    cc.Director.getInstance().resume();
	    
	    if(GameData.isMusicSound)
	    {
	    	this.startBackgroundMusic();
	        // if(this.bgmSettingChanged)
	        // {
	            // this.startBackgroundMusic();
	            // this.bgmSettingChanged = false;
	        // }
	        // else
	        // {
// //	        	this.resumeBackgroundMusic();
// //	            (CocosDenshion.SimpleAudioEngine.sharedEngine()).resumeBackgroundMusic();
	        // }
	    }
	    
	    // this.sprLeftController.setVisible(true);
	    // this.sprRightController.setVisible(true);
	    this.menuItemPause.setVisible(true);
	    this.layerPauseMenu.setVisible(false);
	    
	    if(this.currentCombo >= 2)
	    {
	        this.layerCombo.setVisible(true);
	    }
	    
	    this.layerColorFlash.setVisible(true);
	    this.menuBtnPause.setEnabled(true);
	    this.labelScore.setVisible(true);
	    this.labelScoreSpell.setVisible(true);
	    /*
	     if(isHighestScore)
	     {
	     sprHighestScore.setVisible(true);
	     }
	     */
	    if(this.currentHP != GameData.HP_MAX)
	    {
	        this.sprHpBar.setVisible(true);
	        this.sprHpFrame.setVisible(true);
	    }
	    GameData.gameState = GameData.STATE_PLAYING;
	},
	
	screenTouching:function()
	{
	    if(GameData.gameState == GameData.STATE_PAUSE)
	    {
	        return;
	    }
	    
	    GameData.playerX += this.runMode;
	    if(GameData.playerX < 0)
	    {
	        GameData.playerX += 360;
	    }
	    else if(GameData.playerX >= 360)
	    {
	        GameData.playerX -= 360;
	    }
	    
	    this.sprPlanet.setRotation(GameData.playerX);
	    //    sprBackground.setRotation(GameData.playerX);
	    this.layerParticle.setRotation(GameData.playerX);
	    //   this.setRotation(GameData.playerX);
	},
	
	startTouchSchedule:function()
	{
	    this.schedule(this.screenTouching);
	},
	
	stopTouchSchedule:function()
	{
	    this.unschedule(this.screenTouching);
	},
	
	onKeyDown:function(e)
	{
		if(this.sprHowToPlay != null)
		{
		    this.makeMeteorMaker();			
			this.removeChild(this.sprHowToPlay, true);
			this.menuBtnPause.setVisible(true);
			this.labelScore.setVisible(true);
			this.labelScoreSpell.setVisible(true);
			this.sprHowToPlay = null;
			// this.startGame();
			return;
		}
		
	    if(GameData.gameState == GameData.STATE_GAMEOVER)
	    {
	        if(this.remainGameOverCoolTime == 0 && this.layerGameover.isVisible())
	        {
	            this.startSoundEffect(s_pong_mp3);
	            this.enterHome();
	        }
	        return;
	    }
	    switch(e)
		{
			case cc.KEY.escape:
				if(GameData.gameState == GameData.STATE_PAUSE)
				{
					if(this.layerOptionBox.isVisible())
					{
						this.clickOptionExit();
					}
					else
					{
						this.clickBtnResume();
					}
				}
				else
				{
					this.clickBtnPause();					
				}		
				break;
			
			case cc.KEY.shift:
				this.isShift = true;
				if(this.runMode == 1 || this.runMode == -1)
				{
					this.runMode *= 2;
				}
				break;
							
			case cc.KEY.left:
				this.key = e;
				this.runMode = (/*this.runMode == 2 || this.runMode == -2*/this.isShift) ? 2 : 1;
				this.startTouchSchedule();
				break;
			case cc.KEY.right:
				this.key = e;
				this.runMode = (/*this.runMode == 2 || this.runMode == -2*/this.isShift) ? -2 : -1;
				this.startTouchSchedule();
				break;
		}
	    	    
	    // this.startTouchSchedule();
	},
	
	onKeyUp:function(e)
	{
		if(e == this.key)
		{
			this.runMode = 0;
			this.stopTouchSchedule();	
		}
		else if(e == cc.KEY.shift)
		{
			this.isShift = false;
			
			if(/*this.isShift && (*/this.runMode == 2 || this.runMode == -2/*)*/)
			{
				this.runMode /= 2;
//				this.isShift = false;
			}
		}
	},
	/*
	void GameScene.registerWithTouchDispatcher()
	{
	    CCDirector.sharedDirector().getTouchDispatcher().addTargetedDelegate(this, 0, true);
	}
	
	bool GameScene.ccTouchBegan(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent) //Not optional
	{
	    if(GameData.gameState == GameData.STATE_GAMEOVER)
	    {
	        if(remainGameOverCoolTime == 0 && layerGameover.isVisible())
	        {
	            startSoundEffect("pong.mp3");
	            enterHome();
	        }
	        return false;
	    }
	    
	    touchArray.addObject(pTouch);
	    
	    currentTouch = pTouch;
	    cc.point touchPoint = CCDirector.sharedDirector().convertToGL(pTouch.getLocationInView());
	    setRunModeWithPoint(touchPoint.x, touchPoint.y);
	    startTouchSchedule();
	    touchCount++;
	    return true;
	}
	
	void GameScene.ccTouchMoved(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent)
	{
	    if(pTouch == currentTouch)
	    {
	        cc.point touchPoint = CCDirector.sharedDirector().convertToGL(pTouch.getLocationInView());
	        setRunModeWithPoint(touchPoint.x, touchPoint.y);
	    }
	}
	
	void GameScene.ccTouchEnded(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent)
	{
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
	            cc.point touchPoint = CCDirector.sharedDirector().convertToGL(currentTouch.getLocationInView());
	            setRunModeWithPoint(touchPoint.x, touchPoint.y);
	        }
	    }
	}
	
	void GameScene.ccTouchCancelled(cocos2d.CCTouch *pTouch, cocos2d.CCEvent *pEvent)
	{
	    touchCount--;//-= touches.count();
	    touchArray.removeObject(pTouch);
	    
	    runMode = 0;
	    sprLeftController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlL.png"));
	    sprRightController.setTexture(CCTextureCache.sharedTextureCache().addImage("controlR.png"));
	    stopTouchSchedule();
	}
	*/
	/*
	void GameScene.setRunModeWithPoint(int x, int y)
	{
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
	}
	*/
	
	gameOver:function()
	{
	    GameData.gameState = GameData.STATE_GAMEOVER;
	    // CocosDenshion.SimpleAudioEngine.sharedEngine().stopBackgroundMusic();
	   	this.stopAllBackgroundMusic();
	    
	    this.runMode = 0;
	    this.updateCharAnimation();
	    this.menuBtnPause.setVisible(false);
	    // this.sprLeftController.setVisible(false);
	    // this.sprRightController.setVisible(false);
	    this.sprHpBar.setVisible(false);
	    this.sprHpFrame.setVisible(false);
	    this.stopTouchSchedule();
	    //    layerColorFlash.setOpacity(0);
	    this.layerColorFlash.setVisible(false);
	    this.stopShield();
	    this.layerParticle.setVisible(false);
	    
	    this.unschedule(this.updateHitCoolTime);
	    this.unschedule(this.updateFlash);
	    this.unschedule(this.updateStateBar);
	    
	    this.saveHighScore();
	    
	    if(this.currentHP <= 0)
	    {
	        this.labelScore.stopAllActions();
	        this.labelScore.setAnchorPoint(cc.p(0.5, 0.5));
	        this.labelScore.setPosition(cc.p(GameData.planetCenterX, GameData.planetCenterY));
	        this.labelScore.setScale(1.0);
	        this.labelScoreSpell.setVisible(false);
	        
	        if(this.isHighestScore)
	        {
	            this.labelScore.setColor(cc.c3b(255, GameData.isHardCore ? 0 : 255, 0));
	        }
	        else
	        {
	            this.sprHighestScore.setPosition(cc.p(750, 160));
	            
	            var buf = "" + GameData.isHardCore ? GameData.HighScore.Hardcore : GameData.HighScore.Normal;
	            
	            var labelHighest = cc.LabelBMFont.create(buf, s_bmfontCB64_fnt);
	            labelHighest.setPosition(cc.p(750, 100));
	            labelHighest.setColor(cc.c3b(255, GameData.isHardCore ? 0 : 255, 0));
	            labelHighest.setScale(0.8);
	            this.layerGameover.addChild(labelHighest);
	        }
	        this.sprHighestScore.setVisible(true);
	        this.layerGameover.setVisible(true);
	    }
	},

	saveFile:function()
	{
		GameCache.save();
	},
   
    initSpriteBackground:function()
    {
    	var sprBackground = cc.Sprite.create(s_GameScene_background_png);
    	sprBackground.setScale(1.5);
    	sprBackground.setPosition(cc.p(GameData.planetCenterX, 300));
    	this.addChild(sprBackground, 1);

    	sprBackground = null;	
    },
	
    initSpritePlanet:function()
    {
    	this.sprPlanet = cc.Sprite.create(s_planet_png);
    	this.sprPlanet.setPosition(cc.p(450, 100));
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
	    this.sprHpBar.setPosition(cc.p(420, GameData.planetCenterY + 115));
	    this.sprHpBar.setAnchorPoint(cc.p(0, 0));
	    this.sprHpBar.setScale(0.33);
	    this.sprHpBar.setVisible(false);
	    this.addChild(this.sprHpBar, 8);
	    
	    this.sprHpFrame = cc.Sprite.create(s_gaugebar_png);
	    this.sprHpFrame.setPosition(cc.p(395, GameData.planetCenterY + 115));
	    this.sprHpFrame.setAnchorPoint(cc.p(0, 0));
	    this.sprHpFrame.setScale(0.33);
	    this.sprHpFrame.setVisible(false);
	    this.addChild(this.sprHpFrame, 8);
	    /*
	     sprMpBar = CCSprite.create("MpGauge.png");
	     sprMpBar.setPosition(cc.p(500, 320));
	     sprMpBar.setAnchorPoint(cc.p(0, 0));
	     this.addChild(sprMpBar);
	     */
	    var barSize = this.sprHpBar.getContentSize();
	    this.stateBarWidth = barSize.width;
	    this.stateBarHeight = barSize.height;

	    barSize = null;
	},
	
	initBMFont:function()
	{
	    this.layerCombo = cc.Layer.create();
	    
	    this.labelCombo = cc.LabelBMFont.create("Combo", s_bmfontCB64_fnt);
	    this.labelCombo.setPosition(cc.p(GameData.planetCenterX, GameData.planetCenterY + 75));
	    this.labelCombo.setColor(cc.c3b(255, 255, 0));
	    this.layerCombo.addChild(this.labelCombo);
	    
	    this.labelComboNum = cc.LabelBMFont.create("", s_bmfontCB64_fnt);
	    this.labelComboNum.setPosition(cc.p(GameData.planetCenterX, GameData.planetCenterY));
	    this.labelComboNum.setColor(cc.c3b(255, 255, 0));
	    this.layerCombo.addChild(this.labelComboNum);
	    
	    this.labelComboMul = cc.LabelBMFont.create("", s_bmfontCB64_fnt);
	    this.labelComboMul.setPosition(cc.p(843, 520));
	    this.labelComboMul.setVisible(false);
	    
	    this.layerCombo.addChild(this.labelComboMul);
	    this.layerCombo.setVisible(false);
	    
	    this.addChild(this.layerCombo, 8);	    
	    
	    this.labelScore = cc.LabelBMFont.create("0", s_bmfontCB64_fnt);
	    this.labelScore.setPosition(cc.p(765, 570));
	    this.labelScore.setColor(cc.c3b(255, 255, 255));
	    this.labelScore.setScale(0.7);
	    this.labelScore.setAnchorPoint(cc.p(1.0, 0.5));
	    this.addChild(this.labelScore, 8);
	    
	    this.labelScoreSpell = cc.LabelBMFont.create("Score", s_bmfontCB64_fnt);
	    this.labelScoreSpell.setPosition(cc.p(880, 565));
	    this.labelScoreSpell.setColor(cc.c3b(255, 255, 255));
	    this.labelScoreSpell.setScale(0.55);
	    this.labelScoreSpell.setAnchorPoint(cc.p(1.0, 0.5));
	    this.addChild(this.labelScoreSpell, 8);
	},
	
	initLayerParticle:function()
	{
	    this.layerParticle = cc.Layer.create();
	    this.layerParticle.setAnchorPoint(cc.p(0.5, 1.0 / 600 * GameData.planetCenterY));
	    this.layerParticle.setRotation(GameData.playerX);
	    this.addChild(this.layerParticle, 5);
	},
	
	initLayerFlash:function()
	{
	    this.layerColorFlash = cc.LayerColor.create();
	    this.layerColorFlash.setVisible(false);
	    this.layerColorFlash.setOpacity(0);
	    this.addChild(this.layerColorFlash, 9);
	},
	
	initBtnPause:function()
	{
	    this.menuItemPause = cc.MenuItemImage.create(s_pausebutton_png, s_pausebuttonpressed_png, this.clickBtnPause, this);
	    
	    this.menuBtnPause = cc.Menu.create(this.menuItemPause, null);
	    
	    this.menuBtnPause.setPosition(cc.p(70, 530));
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
	    this.menuBtnSetting.setPosition(cc.p(830, 530));
	    	    
	    this.menuStatePause = cc.Menu.create(menuItemResume, menuItemRestart, menuItemExit, null);
	    this.menuStatePause.alignItemsVerticallyWithPadding(7);
	    this.menuStatePause.setPosition(cc.p(0, 0));
	    this.menuStatePause.setPosition(cc.p(450, 155));
	    
	    this.sprPauseLabel = cc.Sprite.create(s_pause_png);
	    this.sprPauseLabel.setPosition(cc.p(450, 400));
	    this.sprPauseLabel.setScale(0.9);
	    
	    this.layerPauseMenu = cc.LayerColor.create(cc.c3b(0, 0, 0));
	    this.layerPauseMenu.setOpacity(100);
	    this.layerPauseMenu.addChild(this.sprPauseLabel);
	    this.layerPauseMenu.addChild(this.menuStatePause);
	    this.layerPauseMenu.addChild(this.menuBtnSetting);
	    
	    this.layerPauseMenu.setVisible(false);
	    this.addChild(this.layerPauseMenu, 10);

	    menuItemResume = null;
	    menuItemRestart = null;
	    menuItemExit = null;
	    menuItemSetting = null;
	},
	
	initSpriteShield:function()
	{
	    this.remainShieldCoolTimeMax = 360;	    
	    this.sprShield = cc.Sprite.create(s_shieldcircle_png);
	    this.sprShield.setPosition(cc.p(GameData.shieldX, GameData.shieldY));
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
	            this.sprBgmNumber = cc.Sprite.create(s_bgm4_normal_png);
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
	    sprOptionVibration.setPosition(cc.p(340, 145));
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

	    sprOptionBox = null;
	    sprOptionTitle = null;
		menuItemOptionExit = null;
	    menuOptionExit = null;
	    sprOptionBGM = null;
	    menuItemBgmChoiceLeft = null;
	    menuItemBgmChoiceRight = null;
	    menuBgmChoiceLeft = null;
	    menuBgmChoiceRight = null;
    },

	initGameover:function()
	{
	    this.layerGameover = cc.Layer.create();
	    
	    var sprGameover = cc.Sprite.create(s_gameover_png);
	    sprGameover.setPosition(cc.p(450, 355));
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
	    this.sprHighestScore.setPosition(cc.p(450, 170));
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

