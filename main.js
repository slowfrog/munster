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
  this.renderer.render();
};


// Define states
game.state.add("game", gameState);
game.state.start("game");


