var game = new Scene();

game.addStats = function() {
  var stats = window.localStorage.getItem('stats');
  var col = [];
  if (stats) {
    col = JSON.parse(stats);
  }

  col.push(
    {
      date: Date.now(),
      score: game.score,
      pulses: game.pulsesCount,
      kills: game.kills,
      startTime: game.startTime,
      endTime: game.endTime,
    }
  );

  window.localStorage.setItem('stats', JSON.stringify(col));
}

game.addListener('init', function(){
  game.timer = 0;
  game.score = 0;
  game.kills = 0;
  game.addBoids = false;
  game.boidsCounter = 0;
  game.pulsesCount = 0;
  game.startTime = Date.now();
  game.endTime = null;

  // Every 2 seconds add 20 boids.
  game.boidsCreationInterval = window.setInterval(function(){
    var boids = game.entities[0].createBoid(20);
    boids.forEach(function(boid){
      player.addCollisionTest(boid, 'explosion', function(boid, player){
        // Don't destroy the boid, just reset position.
        boid.x = 0;
        boid.y = 0;
        player.kills++;
      });

      player.addCollisionTest(boid, 'player', collisionCallback);
    });

    game.boidsCounter += 20;

    if (game.boidsCounter > 200) {
      window.clearInterval(game.boidsCreationInterval);
    }
  }, 2000);

  var swarm = new Swarm({
    width: game.parent.width,
    height: game.parent.height,
  });
  //swarm.createBoid(100);
  swarm.createBoid(20);

  game.addEntity(swarm);

  var player = new Player({
    x: game.parent.width / 2,
    y: game.parent.height / 2
  });

  player.explosionCallback = function(player){
    game.pulsesCount++;
    if (player.kills === 0) {
      return;
    }
    // Higher the kill count in one explosion, higher the bonus.
    var killScore = player.kills + Math.floor(Math.pow(player.kills / 2, 2));
    killScore = killScore < player.kills?player.kills:killScore;

    game.score += killScore;
    game.kills += player.kills;

    killsText.text = '+' + killScore; // + '[' + player.kills + ']';
    killsText.fillStyle = 'white';
    if (player.kills > 20) {
      killsText.fillStyle = 'yellow';
    }
    if (player.kills > 40) {
      killsText.fillStyle = 'red';
    }
    killsText.start();
  }

  function collisionCallback() {
    player.die(
      function(player) {
        if (player.lives <= 0) {
          var text = new Text({
            x: game.parent.width / 2,
            y: game.parent.height / 2,
            font: '48px "pulse"',
            text: 'GAME OVER!'
          });

          game.addEntity(text);
          game.endTime = Date.now();
          game.addStats();
        }
      },
      function(player) {
        if (player.lives <= 0) {
          game.entities.splice(game.entities.indexOf(player) , 1);
          var setActiveScene = function() {
            $.setActiveScene(0);
            $.removeEventListener(l1);
            $.removeEventListener(l2);
          }
          var l1 = $.addEventListener('touchstart', setActiveScene);
          var l2 = $.addEventListener('mousedown', setActiveScene);
        }
      }
    );
  }

  swarm.boids.forEach(function(boid){
    player.addCollisionTest(boid, 'explosion', function(boid, player){
      // Don't destroy the boid, just reset position.
      boid.x = 0;
      boid.y = 0;
      player.kills++;
    });

    player.addCollisionTest(boid, 'player', collisionCallback);
  });

  game.addListener('update', function(dt){
    game.timer += dt;
  });

  game.addEntity(player);

  var scoreText = new Text({
    x: game.parent.width / 2,
    y: 60,
    font: '36px "pulse"',
    text: game.score
  });

  scoreText.addListener('update', function(dt){
    scoreText.text = game.score;
  });

  game.addEntity(scoreText);

  var livesText = new Text({
    x: game.parent.width / 2,
    y: 30,
    font: '16px "pulse"',
    fillStyle: 'red',
    text: "\u2665\u2665\u2665"
  });

  livesText.addListener('update', function(dt){
    livesText.text = '\u2665\u2665\u2665'.substring(0, player.lives);
  });

  game.addEntity(livesText);


  var killsText = new Text({
    x: game.parent.width / 2,
    y: 80,
    font: '36px "pulse"',
    text: ''
  });
  killsText.timer = 0;

  // Clear all listeners, doing custom ones.
  killsText.listeners = [];

  killsText.addListener('update', function(dt){
    if (!killsText.show) {
      return;
    }

    killsText.timer += dt / 2;
    //killsText.y -= dt * 5:

    var xDistance = $.width/2 - killsText.x;
    var yDistance = 40 - killsText.y;
    var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    if (distance > 1) {
        killsText.x += xDistance * (dt * 2);
        killsText.y += yDistance * (dt * 2);
    }

    if (killsText.timer > 1) {
      killsText.show = false;
    }
  });

  killsText.addListener('render', function(ctx){
    if (!killsText.show) {
      return;
    }

    var ctx = killsText.ctx;
    ctx.globalAlpha = 1 - killsText.timer;
    ctx.fillStyle = killsText.fillStyle;
    ctx.font = killsText.font;
    ctx.textAlign = killsText.align;
    // Update text bounds property.
    killsText.bounds = ctx.measureText(killsText.text);
    ctx.fillText(killsText.text, killsText.x, killsText.y);
    ctx.globalAlpha = 1;
  });

  killsText.start = function(){
    killsText.show = true;
    killsText.timer = 0;
    killsText.x = player.position.x;
    killsText.y = player.position.y;
  }

  game.addEntity(killsText);

});
