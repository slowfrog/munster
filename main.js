"use strict";

var game = new Phaser.Game(640, 480, Phaser.AUTO, "gameDiv");

// MAIN STATE
var gameState = {};

var FIRE_DELAY = 200;

gameState.create = function() {
  this.level = 0;
  this.startLevel(this.level);
  this.lastFire = {};
  this.renderer = new Renderer(game, this.model);
};

gameState.startLevel = function(lvl) {
  this.model = new Model(lvl);
};

gameState.nextLevel = function() {
  this.level += 1;
  if (this.level == LEVELS.length) {
    this.level = 0;
  }
  this.startLevel(this.level);
};

gameState.shouldFire = function(key, now, opt_delay) {
  var delay = opt_delay || FIRE_DELAY;
  if (game.input.keyboard.isDown(key)) {
    if ((!this.lastFire[key]) || (this.lastFire[key] < now - delay)) {
      this.lastFire[key] = now;
      return true;
    }
  } else {
    delete this.lastFire[key];
  }
  return false;
};

gameState.update = function() {
  // Check input
  var d = 15;
  var now = gameState.time.time;
  if (gameState.shouldFire(Phaser.Keyboard.DOWN, now)) {
    this.moveHead(0, 1);
  } else if (gameState.shouldFire(Phaser.Keyboard.RIGHT, now)) {
    this.moveHead(1, 0);
  } else if (gameState.shouldFire(Phaser.Keyboard.UP, now)) {
    this.moveHead(0, -1);
  } else if (gameState.shouldFire(Phaser.Keyboard.LEFT, now)) {
    this.moveHead(-1, 0);
  }

  if (gameState.shouldFire(Phaser.Keyboard.SPACEBAR, now, 500)) {
    this.model.splitWorm();
  }
  if (gameState.shouldFire(Phaser.Keyboard.N, now, 5000)) {
    this.nextLevel();
    this.renderer.reset(this.model);
  }

  if (gameState.shouldFire(Phaser.Keyboard.ESC, now, 5000)) {
    this.startLevel(this.level);
    this.renderer.reset(this.model);
  }

  // Render
  this.renderer.render();
};

gameState.moveHead = function(di, dj) {
  this.model.moveHead(di, dj);
};

// Define states
game.state.add("game", gameState);
game.state.start("game");
