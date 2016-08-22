"use strict";

function Player() {
  GameObject(this); //extend from game object.

  this.position = {x: 0, y: 0};
  this.dimension = {w: 32, h: 32};
  this.velocity = 5;
  this.moving = false;
  this.expanding = false;
  this.arming = false;
  this.exploding = false;
  this.colliding = false;
  this.timer = 0;
  this.moveTo = {x: 0, y: 0};
  this.rotateTo = 0;
  this.angle = 0;
  this.life = 100;

  this.bubble = {
    w: 0,
    h: 0,
    vel: 1,
    armed: {
      w: 0,
      h: 0
    }
  };

  var that = this;

  if (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0)) {

  } else {

  }

  this.addListener("touchmove", function(e){
    var touches = e.changedTouches;

    that.moveTo.x = touches[0].pageX;
    that.moveTo.y = touches[0].pageY;
    that.moving = true;

    if (!that.exploding && !that.arming) {
      that.exploding = false;
      that.arming = false;
      that.expanding = true;
    }
    e.preventDefault();
  });

  this.addListener("touchstart", function(e){
    var touches = e.changedTouches;

    if (that.arming) {
      that.moveTo.x = touches[0].pageX;
      that.moveTo.y = touches[0].pageY;
      that.moving = true;
    }

    that.expanding = true;
  });

  this.addListener("touchend", function(e){
    if (that.bubble.h > 32) {
      that.expanding = false;
      this.exploding = false;
      that.arming = true;
      that.timer = 0;
      that.bubble.armed.w = that.bubble.w;
      that.bubble.armed.h = that.bubble.h;
    } else {
      that.timer = 0;
      that.expanding = false;
      this.exploding = false;
      that.arming = false;
      that.bubble.armed.w = 0;
      that.bubble.w = 0;
      that.bubble.armed.h = 0;
      that.bubble.h = 0;

    }
  });

  this.addListener('update', function(dt){
    that.colliding = false;

    if (that.moving) {
      var xDistance = that.moveTo.x - that.position.x;
      var yDistance = that.moveTo.y - that.position.y;
      var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      if (distance > 1) {
          that.position.x += xDistance * (dt * that.velocity);
          that.position.y += yDistance * (dt * that.velocity);
      } else {
        that.moving = false;
      }

      that.angle = Math.atan2(yDistance,xDistance) * (180/Math.PI);
    }

    if (that.expanding && that.bubble.h < 100) {
      that.bubble.w += 32 * (dt * that.bubble.vel);
      that.bubble.h += 32 * (dt * that.bubble.vel);
    }

    if (that.arming) {
      if (that.dimension.w <= 64) {
        that.dimension.w += 64 * (dt * that.bubble.vel);
        that.dimension.h += 64 * (dt * that.bubble.vel);

        that.bubble.w += 32 * (dt * that.bubble.vel);
        that.bubble.h += 32 * (dt * that.bubble.vel);
      }

      that.timer += dt * that.bubble.vel * 2;

      if (that.timer > 1) {
        that.timer = 0;
        that.arming = false;
        that.exploding = true;
      }
    }

    if (that.exploding) {
      that.dimension.w = 32;
      that.dimension.h = 32;
      that.bubble.w = that.bubble.armed.w;
      that.bubble.h = that.bubble.armed.h;

      that.timer += dt * that.bubble.vel * 2;

      if (that.timer > 1) {
        that.timer = 0;
        that.exploding = false;
        that.bubble.w = 0;
        that.bubble.h = 0;
      }
    }


  });

  this.addListener('render', function(){
    var ctx = that.parent.parent.ctx;

    ctx.save();
    ctx.translate(that.position.x,that.position.y);
    //ctx.rotate(45 * Math.PI / 180);
    ctx.rotate(that.angle * Math.PI / 180);
    ctx.translate(-that.dimension.w/2,-that.dimension.h/2); // before we draw the sprite lets set the anchor point to its center.
    ctx.beginPath();
    //ctx.rect(that.position.x, that.position.y, that.dimension.w, that.dimension.h);
    ctx.rect(0, 0, that.dimension.w, that.dimension.h);
    //ctx.rect(that.position.x - (that.dimension.w / 2), that.position.y - (that.dimension.h / 2), that.dimension.w, that.dimension.h);
    ctx.fillStyle = that.colliding?'red':'white';
    ctx.fill();
    ctx.restore();

    if (that.expanding) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(that.position.x, that.position.y, that.bubble.w, 0, 2 * Math.PI);
      ctx.fillStyle = '#00CCFF';
      ctx.fill();
      //ctx.stroke();
      ctx.globalAlpha = 1;

      // if (that.bubble.h < 100) {
      //   ctx.beginPath();
      //   ctx.strokeStyle = '#FFFFFF';
      //   ctx.lineWidth = 5;
      //   ctx.arc(that.position.x, that.position.y, that.bubble.w, that.bubble.w / 2, that.bubble.w / 2 + (Math.PI));
      //   ctx.stroke();
      // }
    }

    if (that.arming || that.expanding) {
      ctx.globalCompositeOperation = "overlay";
      for (var i = 0; i < 10; i++) {
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 10;
        var bubbleRad = that.bubble.w - Math.random() * that.bubble.w;
        ctx.arc(that.position.x, that.position.y, bubbleRad, bubbleRad / 2, bubbleRad / 2 + (Math.PI));
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "source-over";
    }

    if (that.arming) {
      ctx.globalAlpha = parseInt(that.timer * 10) % 2 == 0?0.5:0;//0.5;
      ctx.beginPath();
      ctx.arc(that.position.x, that.position.y, that.bubble.w, 0, 2 * Math.PI);
      ctx.fillStyle = '#00CCFF';
      ctx.fill();
      //ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (that.exploding) {
      ctx.globalAlpha = 1 - that.timer;
      ctx.beginPath();
      ctx.arc(that.position.x, that.position.y, that.bubble.w, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 10;
      ctx.arc(that.position.x, that.position.y, that.bubble.w + that.timer * 100, 0, 2 * Math.PI);
      ctx.stroke();

      //ctx.stroke();
      ctx.globalAlpha = 1;
    }

  });

}

Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.die = function(){
  //console.log('DIE!', this);
  this.dying = true;
}

Player.prototype.stopExpanding = function(){
  this.timer = 0;
  this.expanding = false;
  this.moving = false;
  this.exploding = false;
  this.arming = false;
  this.bubble.h = 0;
  this.bubble.w = 0;
}
