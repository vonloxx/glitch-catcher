var menu = new Scene();

menu.addListener('init', function(){
  menu.timer = 0;

  function startGame() {
    $.setActiveScene(1);
    $.removeEventListener(l1);
    $.removeEventListener(l2);
  }

  var l1 = $.addEventListener('touchstart', startGame);
  var l2 = $.addEventListener('mousedown', startGame);

  menu.introTexts = [
    {
      queue: [1,3],
      text: 'HOW TO PLAY...',
    },
    {
      queue: [4,6],
      text: 'TOUCH TO MOVE',
    },
    {
      queue: [6,8],
      text: 'AND TO ARM THE PULSE',
    },
    {
      queue: [14,18],
      text: 'RELEASE TO TRIGGER IT!',
    },
    {
      queue: [19,22],
      text: 'AFTER RELEASING THE PULSE',
    },
    {
      queue: [22,25],
      text: 'PLACE YOURSELF ABOVE',
    },
    {
      queue: [25,28],
      text: 'THE ENEMIES TO DESTROY THEM',
    },
    {
      queue: [30,35],
      text: 'GOOD LUCK!',
    },
  ];
});

// menu.addListener('touchstart', function(e){
//   if ($.activeScene == 0) {
//     $.setActiveScene(1);
//   }
// });
//
// menu.addListener('mouseup', function(e){
//   if ($.activeScene == 0) {
//     $.setActiveScene(1);
//   }
// });

menu.addListener('render', function(ctx){
  // ctx.beginPath();
  // ctx.rect(0, 0, $.width, $.height);
  // ctx.fillStyle = '#1A2333';
  // ctx.fill();

  var scale = (Math.abs(Math.cos(menu.timer)) / 2) / 3 + 0.7;

  ctx.save();
  ctx.translate($.width / 2, 100);
  ctx.scale(scale, scale);

  ctx.shadowBlur = scale * 100;
  ctx.shadowColor = 'rgba(0, 216, 255, 0.2)';

  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  ctx.textAlign = 'center';
  ctx.font = 'bold 120px "pulse"';

  ctx.fillText('PULSE', -2, 38);
  ctx.fillText('PULSE', 2, 38);
  ctx.fillText('PULSE', -2, 42);
  ctx.fillText('PULSE', 2, 42);

  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.font = 'bold 120px "pulse"';
  ctx.textAlign = 'center';
  ctx.fillText('PULSE', 0, 40);

  ctx.restore();

  menu.introTexts.forEach(function(help){
    if (menu.timer > help.queue[0] && menu.timer < help.queue[1]) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px "pulse"';
      ctx.textAlign = 'center';
      ctx.fillText(help.text, menu.parent.width / 2, menu.parent.height / 2 - 80);
    }
  });

  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px "pulse"';
  ctx.textAlign = 'center';
  ctx.fillText('TOUCH TO START', $.width / 2, $.height - 80);
});

menu.addListener('update', function(dt){
  menu.timer += dt * 2;
});
