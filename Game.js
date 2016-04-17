BunnyDefender.Game = function(game) {
	this.totalBunnies;
	this.bunnyGroup;
	this.totalSpacerocks;
	this.spacerockgroup;
	this.burst;
	this.gameover;
	this.countdown;
	this.overmessage;
	this.secondsElapsed;
	this.timer;
	this.music;
	this.ouch;
	this.boom;
	this.ding;
	//declaring our variables
};

BunnyDefender.Game.prototype = {
	create: function() {
	//runs once in the beginning
		this.gameover = false;
		this.totalBunnies = 20;
		this.secondsElapsed = 0;
		this.timer = this.time.create(false);
		//false tells timer that we don't want it to remove itself from game
		this.timer.loop(1000, this.updateSeconds, this);
		//we want timer to loop every second and call function 
		this.totalSpacerocks = 13;
		this.music = this.add.audio('game_audio');
		this.music.play('', 0, 0.3, true);
		//specify specific marker in audio (none), tell to start at specific position (0), initialize volume (.3 - from 0 to 1), boolean means are you looping audio
		this.ouch = this.add.audio('hurt_audio');
		this.boom = this.add.audio('explosion_audio');
		this.ding = this.add.audio('select_audio');
		this.buildWorld();
	},
	
	updateSeconds: function() {
		this.secondsElapsed++;	
		//add to seconds
	},
	
	buildWorld: function() {
		this.add.image(0,0, 'sky');
		// asset names from preloader import
		this.add.image(0, 800, 'hill');
		this.buildBunnies();
		this.buildSpaceRocks();
		this.buildEmitter();
		this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Bunnies Left ' + this.totalBunnies, 20);
		this.timer.start();
		//gets our timer loop going as soon as everything is ready
	},
	
	buildBunnies: function() {
		this.bunnygroup = this.add.group();
		//create new group for us called bunnygroup
		this.bunnygroup.enableBody = true;
		//allow bunny group to interact with other objects
		//works with Phaser phyics engine to perform collisions
		for(var i=0; i<this.totalBunnies; i++){
			var b = this.bunnygroup.create(this.rnd.integerInRange(-10, this.world.width-50), this.rnd.integerInRange(this.world.height-180, this.world.height-60), 'bunny', 'Bunny0000');
			//var b is x and y position for where you are placing bunnies (randomly on the hill part of the screen)
			//create new bunny, Bunny0000 tells us where inside texture atlas we want to begin (for sprite sheet frame)
			b.anchor.setTo(0.5,0.5);
			//center of the bunny
			b.body.moves = false;
			//we're going to animate bunnies, tween them across the stage manually, we don't want physics engine to take control
			b.animations.add('Rest', this.game.math.numberArray(1,58));
			b.animations.add('Walk', this.game.math.numberArray(68,107));
			b.animations.play('Rest', 24, true);
			//rest and walk animations, needs array of numbers corresponding to frames within texture atlas
			//for each of the bunnies, we will play its rest state for 24 frames a second.
			this.assignBunnyMovement(b);
		}
		
	},
	
	assignBunnyMovement: function(b) {
		bposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
		// numbers within range, 50 px from left of screen, 50 pixels from right
		bdelay = this.rnd.integerInRange(2000, 6000);
		//bunnies all start moving at different time, between 2 and 6 seconds
		// variables based on random number, position that the bunny wants to go to
		if(bposition < b.x){ //which direction should bunny face, based on where it is on the screen
			b.scale.x = 1;
			
		}else{
			b.scale.x = -1;	
		}
		//scale.x by 1 flips the rabbit, because we set anchor to center of bunny
		t = this.add.tween(b).to({x:bposition}, 8500, Phaser.Easing.Quadratic.InOut, true, bdelay);
		// we want to move along x axis, to position we declared (bposition), how long we want tween to last, Phaser.Easing,Quadratic.InOut is a built in tweening function start off slow, speed up, end slow, we want tween to auto start (true), and then pass in randomized delay
		t.onStart.add(this.startBunny, this);
		// event listener, invoking startBunny when tween starts
		t.onComplete.add(this.stopBunny, this);
		// event listener, invoking stopBunny when tween stops
	},
														 
	startBunny: function(b) {
		b.animations.stop('Rest');
		//stop the actual play animation
		b.animations.play('Walk', 24, true);
		//starting up Walk Animation, autoloop to true
	},
		
	stopBunny: function(b) {
		b.animations.stop('Walk');
		//stop walk animation
		b.animations.play('Rest', 24, true);
		this.assignBunnyMovement(b);
		//passing in bunny instance, changes position, delay, direction, create new tween for each bunny
	},
	buildSpaceRocks: function() {
		this.spacerockgroup = this.add.group();
		for(var i=0; i<this.totalSpacerocks; i++) {
			var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500,0), 'spacerock', 'SpaceRock0000');
			//positioning space rocks far above stage, using entire animation
			var scale = this.rnd.realInRange(0.3, 1.0);
			//variable for scale, between .3 and 1
			r.scale.x = scale;
			r.scale.y = scale;
			//actually create randomized scaling effect, small and large spacerocks
			this.physics.enable(r, Phaser.Physics.ARCADE);
			//physics engine needs to be enabled to hurl rocks toward bunnies
			//default Phaser physics engine
			r.enableBody = true;
			r.body.velocity.y = this.rnd.integerInRange(200, 400);
			//determine how fast these rocks will fall
			r.animations.add('Fall');
			r.animations.play('Fall', 24, true);
			//spacerocks only have one animation
			r.checkWorldBounds = true;
			//once space rock has left stage, it will be able to fire off an event
			r.events.onOutOfBounds.add(this.resetRock, this);
			//this references object, spacerock 
		}
	},
	
	resetRock: function(r) {
		if(r.y > this.world.height){
			this.respawnRock(r);
		}
		//respawn rock when it has left world bounds (screen height)
		
	},
	
	respawnRock: function(r) {
		if(this.gameover == false) {
			r.reset(this.rnd.integerInRange(0, this.world.width),this.rnd.realInRange(-1500,0));
			//same as when we created rocks
			r.body.velocity.y = this.rnd.integerInRange(200,400);
			//reset is a function in phaser which resets the x and y position on entity you call it upon, you have to place new x and y position
		}
	},
	buildEmitter: function() {
		this.burst = this.add.emitter(0, 0, 80);
		//creat burst object as emitter, positioned at 0, 0, plus amount of particles that emitter can hold at any specific time
		this.burst.minParticleScale = 0.3;
		this.burst.maxParticleScale = 1.2;
		//minimum and maximum particle scale
		this.burst.minParticleSpeed.setTo(-30,30);
		this.burst.maxParticleSpeed.setTo(30,-30);
		// minimum and maximum particle speed
		this.burst.makeParticles('explosion');
		//will go through and generate 80 particles of explosion
		this.input.onDown.add(this.fireBurst, this);
		//this refers to input itself
		
	},
	
	fireBurst: function(pointer) {
		if(this.gameover == false){
			this.boom.play();
			this.boom.volume = 0.2;
			this.burst.emitX = pointer.x;
			this.burst.emitY = pointer.y;
			this.burst.start(true, 2000, null, 20);
			//start our particles running, lifespan, frequency of particle emission (pointless because its exploding all at once), quantity per click, 20 means its allowing 4 particle bursts on screen
			//true determined whether or not burst acts as explosion
			//explosion means it will generate all particles at once
		}
		
	},
	
	burstCollision: function(r, b) {
		this.respawnRock(r);
		//return rock to the top of screen
	},
	
	bunnyCollision: function(r, b) {
	//when spacerocks collide with bunnies, they die and rocks reset
		if(b.exists){
			this.ouch.play();
			this.respawnRock(r);
			this.makeGhost(b);
			b.kill();
			//phaser specific function for removing sprite instance
			this.totalBunnies--;
			//subtracting from total Bunnies count
			this.checkBunniesLeft();
		}
	},
	
	checkBunniesLeft: function() {
	//check if there are any bunnies, indicate game over if none
	//adding GAME OVER text
		if(this.totalBunnies <= 0){
			this.gameover = true;
			this.music.stop();
			this.countdown.setText('Bunnies Left 0');
			this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER\n\nYou Lasted\n\n ' + this.secondsElapsed+ ' Seconds', 42);
			//line break characters to add line breaks before secs elapsed
			this.overmessage.align = "center";
			//within area of text, align to center
			this.overmessage.inputEnabled = true;
			this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
			// call quitGame if user clicks on "GAME OVER" text
		}else{
			this.countdown.setText('Bunnies Left '+ this.totalBunnies);	
		}
	},
		
	quitGame: function(pointer) {
		this.ding.play();
			this.state.start('StartMenu');
	},
	
	friendlyFire: function(b, e) {
	//makes it so bunnies die when you hit them with your explosions
		if(b.exists){
			this.ouch.play();
			this.makeGhost(b);
			b.kill();
			this.totalBunnies--;
			this.checkBunniesLeft();
		}
		
	},
	
	makeGhost: function(b) {
		bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
		//need to know x and y position of bunny, putting ghost above actual bunny (b)
		bunnyghost.anchor.setTo(0.5,0.5);
		//setting anchor to center
		bunnyghost.scale.x = b.scale.x;
		//matching scale of ghost to scale of bunny, depending on which way bunny is facing
		this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
		//default physics engine applied to bunnyghost, so it will respond to gravity
		bunnyghost.enableBody = true;
		// body will respond to physics engine
		bunnyghost.checkWorldBounds = true;
		//we will know when ghost has left screen
		bunnyghost.body.velocity.y = -800;
		//velocity and y is being set to negative gravity, which will cause ghost to rush to top of screen
		
	},
	
	
	update: function() { //built in phased function runs constantly
		this.physics.arcade.overlap(this.spacerockgroup, this.burst, this.burstCollision, null, this);
			//feed two objects that we need to test for collisions against
			// call a function for when collission is detected, "this" provides callback context being passed into function  
		//null is for process callback which we aren't using
		this.physics.arcade.overlap(this.spacerockgroup, this.bunnygroup, this.bunnyCollision, null, this);
		//same as previous line of code, testing collision between spacerocks and bunnygroups
		this.physics.arcade.overlap(this.bunnygroup, this.burst, this.friendlyFire, null, this);
	
	}

	
};