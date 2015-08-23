"use strict";

var INITIAL_LIFE = 5;
var INITIAL_GOAL = 25;

var Worm = function(hi, hj) {
  this.food = 0;
  this.life = INITIAL_LIFE;
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

var DEAD_CAN_SPLIT = true;

Worm.prototype.isSplittable = function() {
  if (this.life > 0 || DEAD_CAN_SPLIT) {
    var size = 1 + this.parts.length;
    return size >= 6;
  } else {
    return false;
  }
};

// One recorded action, either a move or a split
var Action = function(type) {
  this.type = type;
};

Action.MOVE = 1;
Action.SPLIT = 2;

Action.move = function(di, dj) {
  var action = new Action(Action.MOVE);
  action.di = di;
  action.dj = dj;
  return action;
};

Action.split = function() {
  return new Action(Action.SPLIT);
};

// The action recorder
var Recorder = function() {
  this.actions = [];
};

Recorder.prototype.record = function(action) {
  this.actions.push(action);
};

// The top-level model
var WIDTH = 40;
var HEIGHT = 30;
var Model = function(level) {
  this.width = WIDTH;
  this.height = HEIGHT;
  this.loadLevel(LEVELS[level]);
  this.worm = new Worm(this.hi, this.hj);
  this.wormlet = [];
  this.cheese[this.worm.hj][this.worm.hi] = 0;
  this.recorder = new Recorder();
};

Model.prototype.loadLevel = function(l) {
  this.cheese = [];
    this.left = 0;
    this.percent = 100;
  this.turn = 0;
  var idx = 0;
  for (var j = 0; j < this.height; ++j) {
    var row = [];
    for (var i = 0; i < this.width; ++i, idx += 2) {
      var c = l.charAt(idx);
      var val = 0;
      switch (c) {
        case '#':
          val = 1;
          break;
        case '.':
          val = 2;
          break;
        case 'X':
          val = 3;
          break;
        case '@':
          this.hi = i;
          this.hj = j;
          break;
      }
      row.push(val);
      if (val == 1 || val == 2) {
          this.left += 1;
      }
    }
    this.cheese.push(row);
  }
  this.total = this.left;
};

Model.prototype.moveHead = function(di, dj) {
  var canMove = this.canMoveWormHead(this.worm, di, dj);
  for (var i = 0; i < this.wormlet.length; ++i) {
    canMove = canMove || this.canMoveWormHead(this.wormlet[i], di, dj);
  }
  if (!canMove) {
    return; // No move: no turn!
  }

  this.moveWormHead(this.worm, di, dj);
  for (var i = 0; i < this.wormlet.length; ++i) {
    this.moveWormHead(this.wormlet[i], di, dj);
  }
  this.turn += 1;
  this.recorder.record(Action.move(di, dj));
};

Model.prototype.canMoveWormHead = function(worm, di, dj) {
  if (worm.life == 0) {
    return false;
  }
  if (worm.confused) {
    di = -di;
    dj = -dj;
  }
  var new_hi = worm.hi + di;
  var new_hj = worm.hj + dj;
  if (new_hi < 0 || new_hi >= this.width ||
      new_hj < 0 || new_hj >= this.height) {
    return false;
  }
  if (this.cheese[new_hj][new_hi] == 3) {
    return false;
  }
  if (this.worm.hi == new_hi && this.worm.hj == new_hj) {
    return false;
  }
  if (this.worm.occupies(new_hi, new_hj)) {
    return false;
  }
  for (var i = 0; i < this.wormlet.length; ++i) {
    var wormlet = this.wormlet[i];
    if (wormlet.hi == new_hi && wormlet.hj == new_hj) {
      return false;
    }
    if (wormlet.occupies(new_hi, new_hj)) {
      return false;
    }
  }
  return true;
};

Model.prototype.moveWormHead = function(worm, di, dj) {
  if (!this.canMoveWormHead(worm, di, dj)) {
    worm.life = Math.max(worm.life - 1, 0);
    return;
  }

  // Move OK
  if (worm.confused) {
    di = -di;
    dj = -dj;
  }
  var new_hi = worm.hi + di;
  var new_hj = worm.hj + dj;
  var grow = false;
  if (this.cheese[new_hj][new_hi]) {
      this.left -= 1;
      this.percent = Math.floor(100 * this.left / this.total);
    if (++worm.food == 3) {
      grow = true;
      worm.food = 0;
    }
    if (this.cheese[new_hj][new_hi] == 2) {
      worm.confused = !worm.confused;
    }
    worm.life = INITIAL_LIFE;
  } else {
    worm.life -= 1;
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
    this.recorder.record(Action.split());
    return true;
  }
  return false;
};
