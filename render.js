"use strict";

var Renderer = function(game, cheese) {
  this.game = game;
  this.cheese = cheese;
  this.graphics = game.add.graphics();
  console.log(this.graphics);
};

Renderer.prototype.render = function() {
  this.graphics.clear();
  for (var j = 0; j < this.cheese.length; ++j) {
    var row = this.cheese[j];
    for (var i = 0; i < row.length; ++i) {
      this.graphics.beginFill(Phaser.Color.getColor(255 * row[i], 255 * row[i], 0));
      this.graphics.drawRect(i * 40, j * 40, 39, 39);
      this.graphics.endFill();
    }
  }
};
