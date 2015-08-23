"use strict";

var Renderer = function(game, model) {
  this.game = game;
  this.model = model;
  this.graphics = game.add.graphics();
  this.labelScore = game.add.text(20, 450, "0",
                                  { font: "30px Arial", fill: "#ffffff" });
  this.labelTurn = game.add.text(300, 450, "0",
                                 { font: "30px Arial", fill: "#ffffff" });
};

Renderer.prototype.reset = function(model) {
  this.model = model;
};

var SCALE = 15;

var COLOR = [
  Phaser.Color.getColor(0, 0, 0),
  Phaser.Color.getColor(255, 255, 0),
  Phaser.Color.getColor(0, 0, 255),
  Phaser.Color.getColor(200, 160, 0)
];

Renderer.prototype.render = function() {
  this.graphics.clear();
  var cheese = this.model.cheese;
  for (var j = 0; j < cheese.length; ++j) {
    var row = cheese[j];
    for (var i = 0; i < row.length; ++i) {
      this.graphics.beginFill(COLOR[row[i]]);
      this.graphics.drawRect(i * SCALE, j * SCALE, SCALE - 1, SCALE - 1);
      this.graphics.endFill();
    }
  }

  var head_color = this.model.worm.confused ?
    Phaser.Color.getColor(0, 255, 0) :
    Phaser.Color.getColor(255, 0, 0);
  this.renderWorm(this.model.worm,
                  head_color);
  for (var i = 0; i < this.model.wormlet.length; ++i) {
    head_color = this.model.wormlet[i].confused ?
      Phaser.Color.getColor(180, 255, 180) :
      Phaser.Color.getColor(255, 180, 180);
    this.renderWorm(this.model.wormlet[i],
                    head_color);
  }

    this.labelScore.text = this.model.percent
    // Math.floor(100 * this.model.left / this.model.total)
	+ "% cheese";
  this.labelTurn.text = "Turn: " + this.model.turn;
};

Renderer.prototype.renderWorm = function(worm, col_head) {
  var col_parts = worm.life == 0 ? Phaser.Color.getColor(200, 160, 0)
    : worm.life == 1 ? Phaser.Color.getColor(215, 190, 80)
    : worm.life == 2 ? Phaser.Color.getColor(230, 210, 150)
    : worm.life == 3 ? Phaser.Color.getColor(250, 230, 200)
    : Phaser.Color.getColor(255, 255, 255);
  this.graphics.beginFill(col_head);
  this.graphics.drawCircle(worm.hi * SCALE + SCALE / 2, worm.hj * SCALE + SCALE / 2, SCALE - 2);
  this.graphics.endFill();
  var prevx = worm.hi * SCALE + SCALE / 2;
  var prevy = worm.hj * SCALE + SCALE / 2;
  for (var i = worm.parts.length - 1; i >= 0; --i) {
    this.graphics.lineStyle(7, col_parts, 1);
    this.graphics.moveTo(prevx, prevy);1
    this.graphics.lineTo(worm.parts[i].i * SCALE + SCALE / 2, worm.parts[i].j * SCALE + SCALE / 2);
    this.graphics.lineStyle(0, col_parts, 1);
    this.graphics.beginFill(col_parts);
    this.graphics.drawCircle(worm.parts[i].i * SCALE + SCALE / 2, worm.parts[i].j * SCALE + SCALE / 2, SCALE - 2);
    this.graphics.endFill();
    prevx = worm.parts[i].i * SCALE + SCALE / 2;
    prevy = worm.parts[i].j * SCALE + SCALE / 2;
  }
};
