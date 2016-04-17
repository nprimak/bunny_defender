var BunnyDefender = {};
BunnyDefender.Boot = function(game) {};
// same object we created inside HTML file -- var game
//Boot.js is capitalized, .Boot needs to be capitalized

BunnyDefender.Boot.prototype = {
	preload: function() {
		this.load.image('preloadBar', 'images/loader_bar.png');
		this.load.image('titleimage', 'images/TitleImage.png');
	},
	
	create: function() {
		this.input.maxPointers = 1;
		// we're only ever going to have 1 pointer activated at a time, cursor, finger, etc.
		//this refers to game object
		this.stage.disableVisibilityChange = false;
		// if we have another tab opened up, it will paase the game for us
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// scale manager SHOW ALL will show everything defined in stage itself, won't cut anything off
		this.scale.minWidth = 270;
		this.scale.minHeight = 480;
		//min W & min H prevents game from getting too small if someone resizes browser
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		// absolutely centers game in browser viewpoint
		this.stage.forcePortrait = true;
		//will force portrait mode during our game on mobile
		
		
		this.scale.setScreenSize(true);
		// allows us to force the screen size of our game
		this.input.addPointer();
		//adds pointer to our input object
		this.stage.backgroundColor = '#171642';
		
		this.state.start('Preloader');
	}
};
		
		