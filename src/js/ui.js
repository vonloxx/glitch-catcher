"use strict";

function UI() {
  GameObject(this); //extend from game object.
  this.lives = 3;
  this.score = 0;
  //this.kills = 0;
  this.kills = {
    number: 0,
    x: 0,
    y: 0,
    show: false,
    timer: 0,
    dir: 1,
  };
  // this.showKills = false;
  // this.showKillsTimer = 0;
  var that = this;

  this.addListener('update', function(dt){
    if (that.kills.show) {
      that.kills.timer += dt * 1.5;
      that.kills.y--;

      if (that.kills.timer > 1) {
        that.kills.show = false;
        that.kills.timer = 0;
      }
    }

  });

  this.addListener('render', function(){
    var ctx = that.parent.parent.ctx;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px "04b19"';
    ctx.fillText('Score:' + that.score, 10, 30);
    ctx.fillText('Lives:' + that.lives, 10, 60);

    if (that.kills.show) {
      ctx.save();
      //ctx.translate(that.kills.x,that.kills.y);
      ctx.globalAlpha = 1 - that.kills.timer;
      //ctx.scale(that.kills.timer + 1, that.kills.timer + 1);
      ctx.fillStyle = that.kills.number > 9 ? 'yellow' : 'white';
      ctx.font = 'bold ' + (that.kills.number > 9?'72px':'48px') + ' "04b19"';
      ctx.fillText(that.kills.number, that.kills.x, that.kills.y);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  });
};

UI.prototype = Object.create(GameObject.prototype);
UI.prototype.constructor = UI;

UI.prototype.displayKills = function(kills, x, y){
  this.kills.number = kills;
  this.kills.show = true;
  this.kills.x = x;
  this.kills.y = y;
  this.kills.dir = -1;

  if (y < 200) {
    this.kills.dir = 1;
  }

  this.kills.y = y + (50*this.kills.dir);
}
