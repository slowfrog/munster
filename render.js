"use strict";

var Renderer = function(game, model) {
  this.game = game;
  this.model = model;
  this.graphics = game.add.graphics();
};

Renderer.prototype.reset = function(model) {
  this.model = model;
};

var SCALE = 20;

Renderer.prototype.render = function() {
  this.graphics.clear();
  var cheese = this.model.cheese;
  for (var j = 0; j < cheese.length; ++j) {
    var row = cheese[j];
    for (var i = 0; i < row.length; ++i) {
      this.graphics.beginFill(Phaser.Color.getColor(255 * row[i], 255 * row[i], 0));
      this.graphics.drawRect(i * SCALE, j * SCALE, SCALE - 1, SCALE - 1);
      this.graphics.endFill();
    }
  }

  this.renderWorm(this.model.worm,
                  Phaser.Color.getColor(255, 0, 0),
                  Phaser.Color.getColor(255, 255, 255));
  for (var i = 0; i < this.model.wormlet.length; ++i) {
    this.renderWorm(this.model.wormlet[i],
                    Phaser.Color.getColor(255, 200, 200),
                    Phaser.Color.getColor(255, 255, 255));
  }
};

Renderer.prototype.renderWorm = function(worm, col_head, col_parts) {
  this.graphics.beginFill(col_head);
  this.graphics.drawCircle(worm.hi * SCALE + SCALE / 2, worm.hj * SCALE + SCALE / 2, SCALE - 2);
  this.graphics.endFill();
  for (var i = 0; i < worm.parts.length; ++i) {
    this.graphics.beginFill(col_parts);
    this.graphics.drawCircle(worm.parts[i].i * SCALE + SCALE / 2, worm.parts[i].j * SCALE + SCALE / 2, SCALE - 2);
    this.graphics.endFill();
  }
};
