"use strict";

function Glitch() {
  GameObject(this); //extend from game object.
  this.position = {x: 0, y: 0};
  this.dimension = {
    w: 16,
    h: 16
  };
  this.distance = {
    x: Math.random() * (10) - 5,
    y: Math.random() * (10) - 5
  };
  this.velocity = Math.random() * (5) + 5;
  this.rotateTo = 0;
  this.angle = 0;
  this.timer = 0;

  var that = this;

  this.addListener('update', function(dt){
    // Check collision tests
    if (that.collisionTests) {
      that.collisionTests.forEach(function(collision){
        if (collision.type === 'player') {
          var rect1 = {
            x: collision.target.position.x,
            y: collision.target.position.y,
            width: collision.target.dimension.w,
            height: collision.target.dimension.h
          }
          var rect2 = {
            x: that.position.x,
            y: that.position.y,
            width: that.dimension.w,
            height: that.dimension.h
          }

          // console.log(rect1.x, rect2.x + rect2.width);
          // console.log(rect1.x + rect1.width, rect2.x);
          // console.log(rect1.y, rect2.y + rect2.height);
          // console.log(rect1.height + rect1.y, rect2.y);

          if (rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.height + rect1.y > rect2.y) {
               collision.collision = true;
               collision.callback(that, collision);
          }
        }

        if (collision.type === 'explosion') {
          var circle = {
            x: collision.target.position.x,
            y: collision.target.position.y,
            r: collision.target.bubble.w,
          };

          var rect = {
            x: that.position.x,
            y: that.position.y,
            w: that.dimension.w,
            h: that.dimension.h
          };

          var distX = Math.abs(circle.x - rect.x-rect.w/2);
          var distY = Math.abs(circle.y - rect.y-rect.h/2);

          if (distX > (rect.w/2 + circle.r)) { return false; }
          if (distY > (rect.h/2 + circle.r)) { return false; }

          if (distX <= (rect.w/2)) { collision.collision = true; }
          if (distY <= (rect.h/2)) { collision.collision = true; }

          var dx=distX-rect.w/2;
          var dy=distY-rect.h/2;

          collision.collision = (dx*dx+dy*dy<=(circle.r*circle.r));

          if ( collision.collision ) {
            collision.callback(that, collision);
          }
        }

        if (collision.type === 'emp') {
          var circle = {
            x: collision.target.position.x,
            y: collision.target.position.y,
            r: collision.target.bubble.w,
          };

          var rect = {
            x: that.position.x,
            y: that.position.y,
            w: that.dimension.w,
            h: that.dimension.h
          };

          var distX = Math.abs(circle.x - rect.x-rect.w/2);
          var distY = Math.abs(circle.y - rect.y-rect.h/2);

          if (distX > (rect.w/2 + circle.r)) { return false; }
          if (distY > (rect.h/2 + circle.r)) { return false; }

          if (distX <= (rect.w/2)) { collision.collision = true; }
          if (distY <= (rect.h/2)) { collision.collision = true; }

          var dx=distX-rect.w/2;
          var dy=distY-rect.h/2;

          collision.collision = (dx*dx+dy*dy<=(circle.r*circle.r));

          if ( collision.collision ) {
            collision.callback(that, collision);
          }
        }
      });
    }

    that.timer += dt * that.velocity;

    if (parseInt(that.timer) % 25 === 0 && parseInt(that.timer) % 50 != 0) {
      that.distance.x = Math.random() * (10) - 5;
      //that.distance.x++;
    }

    if (parseInt(that.timer) % 50 === 0) {
      that.distance.y = Math.random() * (10) - 5;
      //that.distance.y++;
    }

    // var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    // if (distance > 1) {
    //   //that.position.x += 10 * (dt * that.velocity);
    //   that.position.x += xDistance * (dt * that.velocity);
    //   that.position.y += yDistance * (dt * that.velocity);
    // }
    var velX = that.distance.x * (dt * that.velocity);
    var velY = that.distance.y * (dt * that.velocity);

    that.position.x += velX;
    that.position.y += velY;

    if (that.position.x > that.parent.parent.width) {
      that.position.x = 0; //-= velX*2;
    }

    if (that.position.x < 0) {
      that.position.x = that.parent.parent.width; //-= velX*2;
    }

    if (that.position.y > that.parent.parent.height) {
      that.position.y = 0; // -= velY*2;
    }

    if (that.position.y < 0) {
      that.position.y = that.parent.parent.height; // -= velY*2;
    }

    that.angle = Math.atan2(that.distance.y,that.distance.x) * (180/Math.PI);

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
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.restore();
  });
}

Glitch.prototype = Object.create(GameObject.prototype);
Glitch.prototype.constructor = Glitch;

Glitch.prototype.addCollisionTest = function(target, type, callback){
  if (!this.collisionTests) {
    this.collisionTests = [];
  }

  this.collisionTests.push({
    target: target,
    type: type,
    callback: callback,
    collision: false
  });
};

Glitch.prototype.die = function(){
  this.triggerListeners('die', this);
}
