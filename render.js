"use strict";

var Renderer = function(game, model) {
  this.game = game;
  this.model = model;
  console.log(model);
  this.graphics = game.add.graphics();
};

Renderer.prototype.render = function() {
  this.graphics.clear();
  var cheese = this.model.cheese;
  for (var j = 0; j < cheese.length; ++j) {
    var row = cheese[j];
    for (var i = 0; i < row.length; ++i) {
      this.graphics.beginFill(Phaser.Color.getColor(255 * row[i], 255 * row[i], 0));
      this.graphics.drawRect(i * 40, j * 40, 39, 39);
      this.graphics.endFill();
    }
  }

  this.graphics.beginFill(Phaser.Color.getColor(255, 0, 0));
  this.graphics.drawCircle(this.model.hi * 40 + 20, this.model.hj * 40 + 20, 38);
  this.graphics.endFill();
};
