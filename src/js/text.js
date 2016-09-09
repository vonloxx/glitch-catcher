"use strict";

function Text(options) {
  GameObject(this); //extend from game object.

  this.x = options.x || 0;
  this.y = options.y || 0;
  this.text = options.text || 'No text';
  this.align = options.align || 'center';
  this.font = options.font || 'bold 24px "pulse"';
  this.fillStyle = options.fillStyle || '#ffffff';
  this.bounds = {};

  var that = this;

  this.addListener('update', function(dt){
  });

  this.addListener('render', function(){
    var ctx = that.ctx;
    ctx.fillStyle = that.fillStyle;
    ctx.font = that.font;
    ctx.textAlign = that.align;

    // Update text bounds property.
    that.bounds = ctx.measureText(that.text);

    ctx.fillText(that.text, that.x, that.y);
  });
};

Text.prototype = Object.create(GameObject.prototype);
Text.prototype.constructor = Text;
