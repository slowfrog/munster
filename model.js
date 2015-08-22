"use strict";

var Model = function(w, h, hi, hj) {
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
