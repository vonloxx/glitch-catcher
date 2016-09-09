"use strict";

function Game(options) {
  this.width = options.canvas.width = options.width || 640;
  this.height = options.canvas.height = options.height || 480;
  this.ctx = options.canvas.getContext('2d') || null;
  this.scenes = [];
  this.dt = 0;
  this.t = 0;
  this.lastDelta = Date.now();
  this.activeScene = -1;
  this.interval = null;
  this.stopped = true;
  this.mobile = "ontouchstart" in document;

  this.eventListeners = [];

  var that = this;

  // Setup events.
  function callListeners(type, e) {
    that.eventListeners.forEach(function(listener){
      if (listener.type === type) {
        listener.callback(e);
      }
    });
  }

  if (this.mobile) {
    // For mobile.
    options.canvas.addEventListener("touchstart", function(e){
      callListeners('touchstart', e.touches[0]);
    }, false);
    options.canvas.addEventListener("touchend", function(e){
      callListeners('touchend', e.touches[0]);
    }, false);
    options.canvas.addEventListener("touchmove", function(e){
      callListeners('touchmove', e.touches[0]);
    }, false);
  } else {
    // For desktop.
    options.canvas.addEventListener("mousedown", function(e){
      callListeners('mousedown', e);
    }, false);
    options.canvas.addEventListener("mouseup", function(e){
      callListeners('mouseup', e);
    }, false);
    options.canvas.addEventListener("mousemove", function(e){
      callListeners('mousemove', e);
    }, false);
  }

}

Game.prototype.update = function(dt){
  this.t += dt;
  if (this.activeScene >= 0) {
    this.scenes[this.activeScene].update(dt);
  }
};

Game.prototype.render = function(ctx){
  if (this.activeScene >= 0) {
    this.scenes[this.activeScene].render(this.ctx);
  }
};

Game.prototype.run = function(){
  var that = this;

  function loop(){
    var now = Date.now();
    that.dt = (now - that.lastDelta) / 1000.0;
    that.ctx.clearRect(0, 0, that.width, that.height);

    // that.ctx.beginPath();
    // that.ctx.rect(0, 0, that.width, that.height);
    // that.ctx.fillStyle = 'black';
    // that.ctx.fill();

    that.update(that.dt);
    that.render();

    that.ctx.textAlign = 'left';
    that.ctx.fillStyle = 'white';
    that.ctx.font = 'bold 12px "pulse"';
    that.ctx.fillText('TIME ' + Math.round(that.t * 100) / 100, 1, that.height - 1);
    that.ctx.fillText('DELTA ' + that.dt, 100, that.height - 1);

    that.lastDelta = now;
    if (!that.stopped) {
      window.requestAnimFrame(loop);
    } else {
      //that.stopped = false;
    }
  }

  //this.scenes[this.activeScene].init();
  this.stopped = false;
  loop();
};

Game.prototype.stop = function() {
  this.stopped = true;
  window.clearInterval(this.interval);
}

Game.prototype.resume = function() {
  this.stopped = false;
  this.lastDelta = Date.now();
  //this.run();
}

Game.prototype.addScene = function(scene){
  scene.parent = this;
  scene.ctx = this.ctx;
  this.scenes.push(scene);
};

Game.prototype.setActiveScene = function(index, transition){
  this.scenes[index].clear();
  this.scenes[index].init();
  this.activeScene = index;
};

Game.prototype.addEventListener = function(type, callback) {
  var listener = {
    type: type,
    callback: callback
  };
  this.eventListeners.push(
    listener
  );
  return listener;
}

Game.prototype.removeEventListener = function(listener) {
  this.ctx.canvas.removeEventListener(listener.type, listener.callback);
  this.eventListeners.splice(this.eventListeners.indexOf(listener), 1);
}


// Make an "universal" request animation frame.
window.requestAnimFrame = (function(){
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();
