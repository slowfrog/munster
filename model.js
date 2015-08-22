"use strict";

var Worm = function(hi, hj) {
  this.food = 0;
  this.hi = hi;
  this.hj = hj;
  this.parts = [];
  this.confused = false;
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

Worm.prototype.isSplittable = function() {
  var size = 1 + this.parts.length;
  return size >= 6;
};

var Model = function(w, h, hi, hj) {
  this.width = w;
  this.height = h;
  this.cheese = [];
  for (var j = 0; j < h; ++j) {
    var row = [];
    for (var i = 0; i < w; ++i) {
      row.push(1 + (Math.random() < 0.05 ? 1 : 0));
    }
    this.cheese.push(row);
  }
  this.worm = new Worm(hi, hj);
  this.wormlet = [];
  this.cheese[this.worm.hj][this.worm.hi] = 0;
};

Model.prototype.moveHead = function(di, dj) {
  this.moveWormHead(this.worm, di, dj);
  for (var i = 0; i < this.wormlet.length; ++i) {
    this.moveWormHead(this.wormlet[i], di, dj);
  }
};

Model.prototype.moveWormHead = function(worm, di, dj) {
  if (worm.confused) {
    di = -di;
    dj = -dj;
  }
  var new_hi = worm.hi + di;
  var new_hj = worm.hj + dj;
  if (new_hi < 0 || new_hi >= this.width ||
      new_hj < 0 || new_hj >= this.height) {
    return;
  }
  if (this.worm.hi == new_hi && this.worm.hj == new_hj) {
    return;
  }
  if (this.worm.occupies(new_hi, new_hj)) {
    return;
  }
  for (var i = 0; i < this.wormlet.length; ++i) {
    var wormlet = this.wormlet[i];
    if (wormlet.hi == new_hi && wormlet.hj == new_hj) {
      return;
    }
    if (wormlet.occupies(new_hi, new_hj)) {
      return;
    }
  }
  // Move OK
  var grow = false;
  if (this.cheese[new_hj][new_hi]) {
    if (++worm.food == 3) {
      grow = true;
      worm.food = 0;
    }
    if (this.cheese[new_hj][new_hi] == 2) {
      worm.confused = !worm.confused;
    }
  }
  worm.moveHead(new_hi, new_hj, grow);
  this.cheese[worm.hj][worm.hi] = 0;
};

Model.prototype.splitWorm = function() {
  if (this.worm.isSplittable()) {
    var wormlet = new Worm(
      this.worm.parts[0].i, this.worm.parts[0].j);
    for (var i = 1; i <= 2; ++i) {
      wormlet.parts.push(this.worm.parts[3 - i]);
    }
    this.wormlet.push(wormlet);
    this.worm.parts.splice(0, 3);
  }
};
