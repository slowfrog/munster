"use strict";

var game = new Phaser.Game(640, 480, Phaser.AUTO, "gameDiv");

// MAIN STATE
var gameState = {};

gameState.create = function() {
  this.arrows = game.input.keyboard.createCursorKeys();
  this.startLevel();
  this.renderer = new Renderer(game, this.model);
};

gameState.startLevel = function() {
  this.model = new Model(10, 10, 4, 5);
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

  if (game.input.keyboard.downDuration(Phaser.Keyboard.ESC, d)) {
    this.startLevel();
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


