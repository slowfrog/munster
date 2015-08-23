"use strict";

var game = new Phaser.Game(640, 480, Phaser.AUTO, "gameDiv");

// MAIN STATE
var gameState = {};

gameState.create = function() {
  this.level = 0;
  this.arrows = game.input.keyboard.createCursorKeys();
  this.startLevel(this.level);
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

gameState.update = function() {
  // Check input
  var d = 15;
  if (this.arrows.down.downDuration(d)) {
    this.moveHead(0, 1);
  } else if (this.arrows.right.downDuration(d)) {
    this.moveHead(1, 0);
  } else if (this.arrows.up.downDuration(d)) {
    this.moveHead(0, -1);
  } else if (this.arrows.left.downDuration(d)) {
    this.moveHead(-1, 0);
  }

  if (game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, d)) {
    this.model.splitWorm();
  }
  if (game.input.keyboard.downDuration(Phaser.Keyboard.N, d)) {
    this.nextLevel();
    this.renderer.reset(this.model);
  }

  if (game.input.keyboard.downDuration(Phaser.Keyboard.ESC, d)) {
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
