"use strict";

var DISPLAY_WIDTH = 700;
var BUTTON_SIZE = 40;
var game = new Phaser.Game(DISPLAY_WIDTH, 480, Phaser.AUTO, "gameDiv");

// MAIN STATE
var gameState = {};

var FIRE_DELAY = 150;

gameState.preload = function() {
  game.load.audio("nomnom", ["nomnom.wav"], true);
  game.load.audio("snip", ["snip.wav"], true);
  game.load.spritesheet("buttons", "buttons.png", BUTTON_SIZE, BUTTON_SIZE);
};

gameState.create = function() {
  this.winbool = false;
  this.wintime = 0;
  this.level = 0;
  this.startLevel(this.level);
  this.lastFire = {};
  this.renderer = new Renderer(game, this.model);
  this.inputEnabled = true;
  this.nomnom = game.add.audio("nomnom", 0.7, true, true);
  this.snip = game.add.audio("snip", 0.7, true, true);
  this.upbutton = game.add.sprite(DISPLAY_WIDTH - 10 - 3 * BUTTON_SIZE / 2, 10, "buttons", 0);
  this.rightbutton = game.add.sprite(DISPLAY_WIDTH - 10 - BUTTON_SIZE, 10 + BUTTON_SIZE, "buttons", 1);
  this.downbutton = game.add.sprite(DISPLAY_WIDTH - 10 - 3 * BUTTON_SIZE / 2, 10 + 2 * BUTTON_SIZE, "buttons", 2);
  this.leftbutton = game.add.sprite(DISPLAY_WIDTH - 10 - 2 * BUTTON_SIZE, 10 + BUTTON_SIZE, "buttons", 3);
  this.splitbutton = game.add.sprite(DISPLAY_WIDTH - 10 - 3 * BUTTON_SIZE / 2, 10 + 4 * BUTTON_SIZE, "buttons", 5);
  this.replaybutton = game.add.sprite(DISPLAY_WIDTH - 10 - 3 * BUTTON_SIZE / 2, 10 + 5.5 * BUTTON_SIZE, "buttons", 6);
  this.escbutton = game.add.sprite(DISPLAY_WIDTH - 10 - 3 * BUTTON_SIZE / 2, 10 + 7 * BUTTON_SIZE, "buttons", 4);

  this.keySprite = {};
  this.keySprite[Phaser.Keyboard.UP] = this.upbutton;
  this.keySprite[Phaser.Keyboard.RIGHT] = this.rightbutton;
  this.keySprite[Phaser.Keyboard.DOWN] = this.downbutton;
  this.keySprite[Phaser.Keyboard.LEFT] = this.leftbutton;
  this.keySprite[Phaser.Keyboard.ESC] = this.escbutton;
  this.keySprite[Phaser.Keyboard.SPACEBAR] = this.splitbutton;
  this.keySprite[Phaser.Keyboard.R] = this.replaybutton;
};

gameState.startLevel = function(lvl) {
    this.winbool = false;
    this.model = new Model(lvl);
};

gameState.nextLevel = function() {
  this.level += 1;
  if (this.level == LEVELS.length) {
    this.level = 0;
  }
  this.startLevel(this.level);
};

var ORIGIN = new Phaser.Point(0, 0);

gameState.shouldFire = function(key, now, opt_delay) {
  var delay = opt_delay || FIRE_DELAY;
  if (game.input.keyboard.isDown(key) ||
      (this.keySprite[key] &&
       game.input.hitTest(this.keySprite[key], game.input.activePointer, ORIGIN) &&
       game.input.activePointer.isDown)) {
    if ((!this.lastFire[key]) || (this.lastFire[key] < now - delay)) {
      this.lastFire[key] = now;
      return true;
    }
  } else {
    delete this.lastFire[key];
  }
  return false;
};

var REPLAY_DELAY = 100;

gameState.update = function() {
  var now = gameState.time.time;
  if (this.winbool) {
	if (this.wintime + 4000 <= now) {
	  this.nextLevel();
	  this.renderer.reset(this.model);
	}
    return;
  }    
  if (this.inputEnabled) {
    // Check input
    if (gameState.shouldFire(Phaser.Keyboard.DOWN, now) ||
        (game.input.activePointer.targetObject == this.downbutton &&
         game.input.activePointer.isDown())) {
      this.moveHead(0, 1);
    } else if (gameState.shouldFire(Phaser.Keyboard.RIGHT, now)) {
      this.moveHead(1, 0);
    } else if (gameState.shouldFire(Phaser.Keyboard.UP, now)) {
      this.moveHead(0, -1);
    } else if (gameState.shouldFire(Phaser.Keyboard.LEFT, now)) {
      this.moveHead(-1, 0);
    }
    
    if (gameState.shouldFire(Phaser.Keyboard.SPACEBAR, now, 500)) {
      this.split();
    }
    if (gameState.shouldFire(Phaser.Keyboard.S, now, 500)) {
      this.showLevelString();
    }

    if (gameState.shouldFire(Phaser.Keyboard.R, now, 10000)) {
      this.startReplay();
    }
  }
  
  if (gameState.shouldFire(Phaser.Keyboard.N, now, 5000)) {
    this.stopReplay();
    this.nextLevel();
    this.renderer.reset(this.model);
  }

  if (gameState.shouldFire(Phaser.Keyboard.ESC, now, 5000)) {
    this.stopReplay();
    this.startLevel(this.level);
    this.renderer.reset(this.model);
  }

  if (this.actions && now > this.lastActionTime + REPLAY_DELAY) {
    if (this.actions.length == 0) {
      this.stopReplay();
      return;
    }
    var action = this.actions[0];
    switch (action.type) {
    case Action.MOVE:
      this.moveHead(action.di, action.dj);
      break;
    case Action.SPLIT:
      this.split();
      break;
    }
    
    this.actions.splice(0, 1);
    if (this.actions.length == 0) {
      this.stopReplay();
    }
  }

  // Render
  this.renderer.render();
};

gameState.showLevelString = function() {
    var levelString = "";
    var cellString = "";
    console.log(this.model.cheese);
    for (var j = 0; j < this.model.height; j = j+1) {
	levelString = levelString + "\"";
	for (var i = 0; i < this.model.width; i = i+1) {
	    switch (this.model.cheese[j][i]) {
	    case 0:
		cellString = " "; break;
	    case 1:
		cellString = "#"; break;
	    case 2:
		cellString = "."; break;
	    case 3:
		cellString = "X"; break;
	    }
	    levelString = levelString + cellString + " ";
	}
	levelString += "\"" + ((this.model.height != j+1) ? " + " : "") + " \n";
    }
    console.log(levelString);
};

gameState.startReplay = function() {
  this.actions = this.model.recorder.actions;
  this.lastActionTime = gameState.time.time;
  this.inputEnabled = false;
  this.startLevel(this.level);
  this.renderer.reset(this.model);
};

gameState.stopReplay = function() {
  delete this.actions;
  delete this.lastActionTime;
  this.inputEnabled = true;
};

gameState.split = function() {
  if (this.model.splitWorm()) {
    this.snip.play('', 0, 1, false);
  }
};

gameState.moveHead = function(di, dj) {
    var medal = 0;
    if (this.model.percent <= 25) {
	if (this.model.turn <= this.model.gold) {
	    medal = 3;
	    // GOLD
	} else if (this.model.turn <= this.model.silver) {
	    medal = 2;
	    // SILVER
	} else if (this.model.turn <= this.model.bronze) {
	    medal = 1;
	    // BRONZE
	}
	// TODO transition
	//
	gameState.winbool=true;
	gameState.wintime=gameState.time.time;
	this.renderer.displayWin(medal);
    } else {
	  if (this.model.moveHead(di, dj)) {
        if (!this.nomnom.isPlaying) {
          this.nomnom.play('', 0, 0.1, false, true);
        }
      }
    }
};

// Define states
game.state.add("game", gameState);
game.state.start("game");

// Prevent document scrolling
document.addEventListener("keydown", function(ev) {
  if ((ev.keyCode >= 37 && ev.keyCode <= 40) ||
      (ev.keyCode == 32)) {
    ev.preventDefault();
  }
}, false);
