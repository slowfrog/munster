"use strict";

var game = new Phaser.Game(640, 480, Phaser.AUTO, "gameDiv");

// MAIN STATE
var gameState = {};

gameState.create = function() {
  this.arrows = game.input.keyboard.createCursorKeys();
  this.startLevel();
  this.renderer = new Renderer(game, this.cheese);
};

gameState.startLevel = function() {
  this.cheese = [];
  for (var j = 0; j < 10; ++j) {
    var row = [];
    for (var i = 0; i < 10; ++i) {
      row.push(1);
    }
    this.cheese.push(row);
  }
};

gameState.update = function() {
  this.renderer.render();
};


// Define states
game.state.add("game", gameState);
game.state.start("game");


