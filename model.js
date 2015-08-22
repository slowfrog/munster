"use strict";

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
  this.hi = hi;
  this.hj = hj;
  this.cheese[this.hj][this.hi] = 0;
};

Model.prototype.moveHead = function(di, dj) {
  var new_hi = this.hi + di;
  var new_hj = this.hj + dj;
  if (new_hi < 0 || new_hi >= this.width ||
      new_hj < 0 || new_hj >= this.height) {
    return;
  }
  this.hi = new_hi;
  this.hj = new_hj;
  this.cheese[this.hj][this.hi] = 0;
};
