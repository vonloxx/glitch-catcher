"use strict";
document.addEventListener('DOMContentLoaded', function(){
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
  gameScene.addListener('update', function(dt){
    if (gameScene.parent && gameScene.parent.keys[32]) {
      console.log('Space pressed!');
    }

    if (gameScene.parent && gameScene.parent.touch){
      //console.log('Touched!');
    }
  });

  var player = new Player();
  player.position = {x: $.width / 2, y: $.height / 2};

  gameScene.addEntity(player);


  var glitches = [];

  for (var i = 0; i < 50; i++) {
    var glitch = new Glitch();
    //glitch.position = {x: Math.random() * 100, y: Math.random() * $.height};
    glitch.position = {x: Math.random() * $.width, y: Math.random() * $.height};

    glitch.addCollisionTest(player, 'emp', function(origin, collision){
      if (collision.target.exploding) {
        gameScene.entities.splice(gameScene.entities.indexOf(origin), 1);
      }

      if (!collision.target.exploding && !collision.target.arming) {
        collision.target.die();
        collision.target.expanding = false;
        collision.target.stopExpanding();
        //console.log('Kill player!');
      }

    });

    glitch.addCollisionTest(player, 'player', function(origin, collision){
      if (!collision.target.exploding && !collision.target.arming) {
        collision.target.die();
        collision.target.colliding = true;
        collision.target.life -= 0.1;
        console.log(collision.target.life);
        //gameScene.entities.splice(gameScene.entities.indexOf(origin), 1);
      }
    });

    gameScene.addEntity(glitch);
  }

  $.addScene(gameScene);

  $.activeScene = 1;
});
