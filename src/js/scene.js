"use strict";

function Scene() {
  GameObject(this); //extend from game object.
  this.entities = [];
  this.parent = null;
  var that = this;

  this.addEntity = function(entity) {
    entity.parent = that;
    this.entities.push(entity);
  };

  this.addListener('update', function(dt){
    that.entities.forEach(function(entity){
      entity.update(dt);
    });
  });

  this.addListener('render', function(dt){
    that.entities.forEach(function(entity){
      entity.render();
    });
  });
};

Scene.prototype = Object.create(GameObject.prototype);
Scene.prototype.constructor = Scene;
