"use strict";

var Worm = function(hi, hj) {
  this.hi = hi;
  this.hj = hj;
  this.parts = [];
};

Worm.prototype.moveHead = function(new_hi, new_hj, grow) {
  this.parts.push({i: this.hi, j: this.hj});
  if (!grow) {
    this.parts.splice(0, 1);
  }
  this.hi = new_hi;
  this.hj = new_hj;
};

Worm.prototype.occupies = function(hi, hj) {
  for (var k = 0; k < this.parts.length; ++k) {
    if (this.parts[k].i == hi && this.parts[k].j == hj) {
      return true;
    }
  }
  return false;
};

var Model = function(w, h, hi, hj) {
  this.width = w;
  this.height = h;
  this.cheese = [];
  for (var j = 0; j < h; ++j) {
    var row = [];
    for (var i = 0; i < w; ++i) {
      row.push(1);
    }
    this.cheese.push(row);
  }
  this.worm = new Worm(hi, hj);
  this.food = 0;
  this.cheese[this.worm.hj][this.worm.hi] = 0;
};

Model.prototype.moveHead = function(di, dj) {
  var new_hi = this.worm.hi + di;
  var new_hj = this.worm.hj + dj;
  if (new_hi < 0 || new_hi >= this.width ||
      new_hj < 0 || new_hj >= this.height) {
    return;
  }
  if (this.worm.occupies(new_hi, new_hj)) {
    return;
  }
  var grow = false;
  if (this.cheese[new_hj][new_hi]) {
    if (++this.food == 3) {
      grow = true;
      this.food = 0;
    }
  }
  this.worm.moveHead(new_hi, new_hj, grow);
  this.cheese[this.worm.hj][this.worm.hi] = 0;
};
