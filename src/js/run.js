var MOBILE = "ontouchstart" in document;
var WIDTH = window.innerWidth < window.innerHeight && window.innerWidth > 420 ? 420 : window.innerWidth > window.innerHeight && window.innerWidth > 767 ? 768 : window.innerWidth;
var HEIGHT = window.innerHeight < window.innerWidth && window.innerHeight > 420 ? 420 : window.innerHeight > window.innerWidth && window.innerHeight > 767 ? 768 : window.innerHeight;

console.log(WIDTH, HEIGHT);

var $ = new Game({
  canvas: document.getElementById('canvas'),
  width: WIDTH, //window.innerWidth,
  height: HEIGHT, //window.innerHeight,
});

window.addEventListener('resize', function(){
  WIDTH = window.innerWidth < window.innerHeight && window.innerWidth > 420 ? 420 : window.innerWidth > window.innerHeight && window.innerWidth > 767 ? 768 : window.innerWidth;
  HEIGHT = window.innerHeight < window.innerWidth && window.innerHeight > 420 ? 420 : window.innerHeight > window.innerWidth && window.innerHeight > 767 ? 768 : window.innerHeight;
  $.width = WIDTH;
  $.height = HEIGHT;
});

document.addEventListener('DOMContentLoaded', function(){
  // Setup menu scene - from scene-menu.js.
  $.addScene(menu);

  // Setup game scene - from scene-game.js.
  $.addScene(game);

  $.setActiveScene(0);

  $.run();
});
