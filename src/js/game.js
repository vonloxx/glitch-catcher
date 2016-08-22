"use strict";

// Global temp
//var fbo1, fbo2, blur1dShader, gaussianBlurShader, glowShader;

function Game(options) {
  GameObject(this); //extend from game object.
  this.canvas = null;
  this.scenes = [];
  this.keys = [];
  this.touch = false;
  this.width = options.width || 640;
  this.height = options.height || 480;
  this.messages = [];
  this.activeScene = -1;

  this.eventListeners = [];

  var lastDelta = Date.now();
  var dt = 0;
  var that = this;

  this.addScene = function(scene) {
    scene.parent = this;
    this.scenes.push(scene);
  }

  this.addEventListener = function(type, callback){
    this.eventListeners.push({
      type: type,
      callback: callback
    });
  }

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }

  window.addEventListener("load", function() { window.scrollTo(0, 1); });

  this.init = function(canvas, webgl) {
    console.log(this);
    console.log(that);
    this.canvas = document.getElementById(canvas);
    this.canvas.width = this.width = window.innerWidth; //this.width;
    this.canvas.height = this.height = window.innerHeight; //this.height;
    this.ctx = this.canvas.getContext('2d');
    //old school looks.
    //this.ctx.imageSmoothingEnabled= false;

    // Setup WegGL
    this.webgl = document.getElementById(webgl);
    this.webgl.width = this.width = window.innerWidth; //this.width;
    this.webgl.height = this.height = window.innerHeight; //this.height;
    this.gl = this.webgl.getContext('webgl') || this.webgl.getContext("experimental-webgl");

    this.gl.viewport(0, 0, this.webgl.width, this.webgl.height);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);

    var buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
      1.0, -1.0,
      1.0,  1.0
    ]), this.gl.STATIC_DRAW);

    /*
    blur1dShader = glCreateShader(this.gl,
      `
        attribute vec2 p;
        varying vec2 uv;

        void main() {
          gl_Position = vec4(p,0.0,1.0);
          uv = 0.5 * (p+1.0);
        }
      `,
      `
        precision highp float;

        varying vec2 uv;
        uniform sampler2D t;
        uniform vec2 dim;
        uniform vec2 dir;

        void main() {
          vec4 color = vec4(0.0);
          vec2 off1 = vec2(1.3846153846) * dir;
          vec2 off2 = vec2(3.2307692308) * dir;
          color += texture2D(t, uv) * 0.2270270270;
          color += texture2D(t, uv + (off1 / dim)) * 0.3162162162;
          color += texture2D(t, uv - (off1 / dim)) * 0.3162162162;
          color += texture2D(t, uv + (off2 / dim)) * 0.0702702703;
          color += texture2D(t, uv - (off2 / dim)) * 0.0702702703;
          gl_FragColor = color;
        }
      `
    );
    this.gl.uniform2f(glUniformLocation(this.gl, blur1dShader, "dim"), this.webgl.width, this.webgl.height);

    fbo1 = glCreateFBO(this.gl, this.webgl.width, this.webgl.height);
    fbo2 = glCreateFBO(this.gl, this.webgl.width, this.webgl.height);

    this.textureGame = glCreateTexture(this.gl);
    */

    // Update scenes.
    this.addListener('update', function(dt){
      if (that.activeScene >= 0) {
        that.scenes[that.activeScene].update(dt);
      }
    });

    // Render scenes.
    this.addListener('render', function(dt){
      if (that.activeScene >= 0) {
        that.scenes[that.activeScene].render();
      }

      // Apply post effects.
      /*
      glSetTexture(that.gl, that.textureGame, that.canvas);

      glBindFBO(that.gl, fbo1);
      glBindShader(that.gl, blur1dShader);
      that.gl.uniform1i(glUniformLocation(that.gl, blur1dShader, "t"), glBindTexture(that.gl, that.textureGame, 0));
      that.gl.uniform2f(glUniformLocation(that.gl, blur1dShader, "dir"),  1.5, 1.5 );
      that.gl.drawArrays(that.gl.TRIANGLES, 0, 6);

      // that.gl.bindFramebuffer(that.gl.FRAMEBUFFER, null);
      // glBindShader(that.gl, gaussianBlurShader);
      // that.gl.uniform1i(glUniformLocation(that.gl, gaussianBlurShader, "image"), glBindTexture(that.gl, glGetFBOTexture(fbo1), 0));
      // that.gl.drawArrays(that.gl.TRIANGLES, 0, 6);


      that.gl.bindFramebuffer(that.gl.FRAMEBUFFER, null);
      glBindShader(that.gl, blur1dShader);
      that.gl.uniform1i(glUniformLocation(that.gl, blur1dShader, "t"), glBindTexture(that.gl, glGetFBOTexture(fbo1), 0));
      that.gl.uniform2f(glUniformLocation(that.gl, blur1dShader, "dir"),  -1.5, 1.5 );
      that.gl.drawArrays(that.gl.TRIANGLES, 0, 6);
      */
    });

    lastDelta = Date.now();
    loop();
  }

  function loop() {
    var now = Date.now();
    dt = (now - lastDelta) / 1000.0;
    // need to fix this:
    that.ctx.clearRect(0, 0, that.width, that.height);
    that.ctx.beginPath();
    that.ctx.rect(0, 0, that.width, that.height);
    that.ctx.fillStyle = 'black';
    that.ctx.fill();
    that.update(dt);
    that.render();

    lastDelta = now;
    window.requestAnimFrame(loop);
  }

  function triggerEventListeners(type, event) {
    that.eventListeners.forEach(function(listener){
      if (listener.type === type) {
        listener.callback(event);
      }
    });
  }

  window.addEventListener('resize', function(){
    that.canvas.width = window.innerWidth;
    that.canvas.height = window.innerHeight;
  }, false);

  document.addEventListener("keydown", function(e){
    that.keys[e.keyCode] = true;
    triggerEventListeners('keydown', e);
  }, false);
  document.addEventListener("keyup", function(e){
    that.keys[e.keyCode] = false;
    triggerEventListeners('keyup', e);
  }, false);

  document.addEventListener("touchstart", function(e){
    that.touch = true;
  }, false);
  document.addEventListener("touchend", function(e){
    that.touch = false;
  }, false);

  document.addEventListener("mousedown", function(e){
    that.mouseEvent = e;
    that.touch = true;
    triggerEventListeners('mousedown', e);
  }, false);
  document.addEventListener("mouseup", function(e){
    that.mouseEvent = e;
    that.touch = false;
    triggerEventListeners('mouseup', e);
  }, false);
  document.addEventListener("mousemove", function(e){
    triggerEventListeners('mousemove', e);
  }, false);

}

Game.prototype = Object.create(GameObject.prototype);
Game.prototype.constructor = Game;

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
