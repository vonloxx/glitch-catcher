"use strict";

function GameObject(obj) {
  // document.addEventListener("mousedown", function(e){
  //   obj.triggerListeners('mousedown', e);
  // }, false);
  // document.addEventListener("mouseup", function(e){
  //   obj.triggerListeners('mouseup', e);
  // }, false);
  // document.addEventListener("mousemove", function(e){
  //   obj.triggerListeners('mousemove', e);
  // }, false);

  document.addEventListener('DOMContentLoaded', function(){
    //var canvas = document.getElementsByTagName('canvas')[0];

    document.addEventListener("mousedown", function(e){
      obj.triggerListeners('mousedown', e);
    }, false);
    document.addEventListener("mouseup", function(e){
      obj.triggerListeners('mouseup', e);
    }, false);
    document.addEventListener("mousemove", function(e){
      obj.triggerListeners('mousemove', e);
    }, false);

    document.addEventListener("touchstart", function(e){
      obj.triggerListeners('touchstart', e);
    }, false);
    document.addEventListener("touchend", function(e){
      obj.triggerListeners('touchend', e);
    }, false);
    document.addEventListener("touchmove", function(e){
      obj.triggerListeners('touchmove', e);
    }, false);

  });

}

GameObject.prototype.render = function() {
  if (!this.listeners) {
    return;
  }

  this.listeners.forEach(function(listener){
    if (listener.type == 'render') {
      listener.callback();
    }
  });
};

GameObject.prototype.update = function(dt) {
  if (!this.listeners) {
    return;
  }

  this.listeners.forEach(function(listener){
    if (listener.type == 'update') {
      listener.callback(dt);
    }
  });
};

GameObject.prototype.addListener = function(type, callback) {
  if (!this.listeners) {
    this.listeners = [];
  }

  this.listeners.push({
    type: type,
    callback: callback
  });
};

GameObject.prototype.triggerListeners = function(type, event) {
  if (!this.listeners) {
    this.listeners = [];
  }

  this.listeners.forEach(function(listener){
    if (listener.type == type) {
      listener.callback(event);
    }
  });
};
