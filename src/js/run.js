"use strict";
//document.addEventListener('DOMContentLoaded', function(){
  var $ = new Game({
    width: window.innerWidth,
    height: window.innerHeight/ 2,
  });

  $.init('canvas', 'webgl')

  var menu = new Scene();
  menu.addListener('update', function(dt){
    if (menu.parent && menu.parent.keys[32]) {
      console.log('[MENU] Space pressed!');
    }

    if (menu.parent && menu.parent.touch){
      console.log('[MENU] Touched!');
    }
  });

  $.addScene(menu);

  // Add game scene.
  var gameScene = new Scene();
  gameScene.timer = 0;
  gameScene.addListener('update', function(dt){
    if (gameScene.parent && gameScene.parent.keys[32]) {
      console.log('Space pressed!');
    }

    if (gameScene.parent && gameScene.parent.touch){
      //console.log('Touched!');
    }

    gameScene.timer += dt * 20;

    // Every now and then, throw a new glitch.
    var interval = 50 - parseInt(gameScene.timer) / 10;
    if (interval < 0) {
      gameScene.timer = 0;
      interval = 50 - parseInt(gameScene.timer) / 10;
    }
    if (parseInt(gameScene.timer) % interval == 0) {
      var glitch = createGlitch();
      gameScene.addEntity(glitch);
      console.log('Another glitch');
    }

    // Every now and then, throw a free arming.
    if (parseInt(gameScene.timer) % 500 == 0) {
      console.log('Here comes salvation!');
      // var glitch = createGlitch();
      // gameScene.addEntity(glitch);
    }

    //console.log(gameScene.timer);
  });

  gameScene.addListener('spawn-glitches', function(){
    $.applyBlur();
  });

  var kills = 0;

  var player = new Player();
  player.position = {x: $.width / 2, y: $.height / 2};
  gameScene.addEntity(player);

  function createGlitch(){
    var glitch = new Glitch();
    //glitch.position = {x: Math.random() * 100, y: Math.random() * $.height};
    glitch.position = {
      x: Math.random() * 10 + (parseInt(Math.random() * 2) == 0?$.width - 10:0),
      y: Math.random() * 10 + (parseInt(Math.random() * 2) == 0?$.height - 10:0),
    };

    glitch.addCollisionTest(player, 'explosion', function(origin, collision){
      if (collision.target.exploding) {
        // origin.position = {
        //   x: Math.random() * 10 + (parseInt(Math.random() * 2) == 0?$.width - 10:0),
        //   y: Math.random() * 10 + (parseInt(Math.random() * 2) == 0?$.height - 10:0),
        // };
        origin.die();
        kills++;
        gameScene.entities.splice(gameScene.entities.indexOf(origin), 1);
      }
    });

    glitch.addCollisionTest(player, 'emp', function(origin, collision){
      if (!collision.target.exploding && !collision.target.arming && !collision.target.dying && !collision.target.spawning) {
        collision.target.die();
        collision.target.expanding = false;
        collision.target.stopExpanding();
      }
    });

    glitch.addCollisionTest(player, 'player', function(origin, collision){
      if (!collision.target.exploding && !collision.target.arming && !collision.target.dying && !collision.target.spawning) {
        collision.target.die();
        collision.target.colliding = true;
        //collision.target.life -= 0.1;
        //gameScene.entities.splice(gameScene.entities.indexOf(origin), 1);
      }
    });

    return glitch;
  }



  for (var i = 0; i < 50; i++) {
    var glitch = createGlitch();
    gameScene.addEntity(glitch);
  }

  $.addScene(gameScene);

  var ui = new UI();
  gameScene.addEntity(ui);
  player.addListener('die', function(player){
    ui.lives = player.lives;
  });

  player.addListener('start-explosion', function(player){
    kills = 0;
  });

  player.addListener('end-explosion', function(player){
    ui.score += kills + (kills * parseInt(kills / 2));
    ui.displayKills(kills, player.position.x, player.position.y);
  });

  $.activeScene = 1;
//});
