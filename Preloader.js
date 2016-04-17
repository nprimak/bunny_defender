BunnyDefender.Preloader = function(game) {
	this.preloadBar = null;
	this.titleText = null;
	this.ready = false;
	// we haven't loaded anything so game.ready = false
	
};

BunnyDefender.Preloader.prototype = {
	
	preload: function() {
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
		//allows you to use a specific sprite as a preloader and can crop it in certain ways
		//this.world.centerX is game world center point along X axis
		//we defined preloadbar in Boot.js
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		//assign sprite to our actual preloader mechanism
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		// image needs to be adjusted on y axis to appear centered
		this.titleText.anchor.setTo(0.5, 0.5);
		// sets transform/anchor point to center of the object 
		this.load.image('titlescreen','images/TitleBG.png');
		this.load.bitmapFont('eightbitwonder','fonts/eightbitwonder.png','fonts/eightbitwonder.fnt');
		this.load.image('hill', 'images/hill.png');
		this.load.image('sky', 'images/sky.png');
		this.load.atlasXML('bunny', 'images/spritesheets/bunny.png', 'images/spritesheets/bunny.xml');
		this.load.atlasXML('spacerock', 'images/spritesheets/spacerock.png', 'images/spritesheets/spacerock.xml');
		this.load.image('explosion', 'images/explosion.png');
		this.load.image('ghost','images/ghost.png');
		this.load.audio('explosion_audio', 'audio/explosion.mp3');
		this.load.audio('hurt.audio', 'audio/hurt.mp3');
		this.load.audio('select.audio', 'audio/select.mp3')
		this.load.audio('game_audio', 'audio/bgm.mp3');
			
	},
	
	create: function () {
		this.preloadBar.cropEnabled = false;
		//fires off once everything has happened in the preload function, turns cropping off
	},
	
	update: function () {
		if(this.cache.isSoundDecoded('game_audio') && this.ready == false){
			this.ready = true;
			// will run once create function has occurred
			this.state.start('StartMenu');
		}
	}
	
};
		

