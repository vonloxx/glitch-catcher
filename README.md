# PULSE - My JS13K 2016 entry

## Making-of

Last year when I developed about 60% of my game, I inadvertently formatted my Mac and had no commits pulled to repository. So I was unable to submit my entry due the lack of time to remake the whole game. Big lesson here kids, always use a version control as a backup and frequently pull your code to the remote rep. You'll never know when you're going to screw things up. ;)
But I learned a lot about JS/HTML game development and it was fun (while it lasted). So I was decided to enter at 2016's edition.

Unfortunately this year I couldn't allocate too much time to develop my game. I had a couple of hours on each day of the weekend and probably would steal some sleeping time. So I needed to be smart and come up with a game that could take advantage of already-made stuff.

First was taking ideas for the game. Theme: Glitch. Oh boy. Besides the obvious screen glitches, how would I come up with a game about glitches? Went to Ferry Halim's Orisinal site http://www.ferryhalim.com/orisinal to check if any game could fit the theme and so I found one: http://www.ferryhalim.com/orisinal/g3/bugs.htm. It is a quite simple game and enjoyed a lot playing it. Especially when I kept trying to break my own top score. All I needed was to insert a "glitch" on it 😉.

And so I started. First I took Ayman's js13k starter https://github.com/aymanfarhat/js13k-starter to save time setting up the build process and developing the initial RaF/render/update bootstrap. Decided to follow a class/object approach with some kind of observable/event architecture but it soon revealed a not-so-good decision especially when you dealing with a limited size. And, believe me, you can fill up 13Kb of code very quickly. Even compressed.

Not entering in too many technical details, there's this general game object https://github.com/vonloxx/js13k-2016/blob/master/src/js/game-object.js that is going to be inherited by the rest of the game entities: Game, Scene, Player, etc. Basically it has two main methods (update and render) which calls every event registered by the inherited classes. By the end of development (and after a code re-factor), I circumvent a bit this approach just to get things done 😇.

Next, the player class https://github.com/vonloxx/js13k-2016/blob/master/src/js/player.js. Added a lot of entity states on the update/render because of the "pulse" and explosion and listeners for the mouse/touch events.
<blockquote class="twitter-tweet" data-lang="pt"><p lang="en" dir="ltr">Last night finally I was able to add swarm behaviour to those pesky enemies <a href="https://twitter.com/hashtag/js13k?src=hash">#js13k</a> <a href="https://t.co/Z5jLumi2xk">pic.twitter.com/Z5jLumi2xk</a></p>&mdash; Marco Fernandes (@marcoffernandes) <a href="https://twitter.com/marcoffernandes/status/773156092784340992">6 de setembro de 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

For the enemies movement I would like them to have a kind of a flock behaviour so I searched and found this: https://github.com/skeeto/boids-js. It was perfect and it followed the class approach I was using. So, in a couple of hours, I was able to integrate it on my game and see the result. Beautiful!

![The Swarm](https://raw.githubusercontent.com/vonloxx/js13k-2016/master/images/swarm-1.gif)

<blockquote class="twitter-tweet" data-lang="pt"><p lang="en" dir="ltr">Last night finally I was able to add swarm behaviour to those pesky enemies <a href="https://twitter.com/hashtag/js13k?src=hash">#js13k</a> <a href="https://t.co/Z5jLumi2xk">pic.twitter.com/Z5jLumi2xk</a></p>&mdash; Marco Fernandes (@marcoffernandes) <a href="https://twitter.com/marcoffernandes/status/773156092784340992">6 de setembro de 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Quickly I had a playable "prototype" and ready to do some tests before implementing better graphics and sound.

Tests, tests and more tests. Probably this was where I spent most of the time allocated to the game. To get a balanced mechanic and a nice learning curve you really need to test a lot and give others to test and receive feedback.
As a result of the tests, I had to differentiate some vars on the mobile and desktop because on mobile it was a bit harder (a lot harder according to one tester). So, for example, on desktop you get a maximum of 200 boids, while on mobile you just get 100. If I ever build an online leaderboard, I need to remember this!

Tests and consequent code tweaks took more time than I expected. And after that I finally realized that the chosen architecture did took a lot of valuable bytes not leaving enough for, at least, sound effects. Did a code re-factor but without stepping out of the original architecture. More time spent. Soon I was on the last weekend before the deadline.

I was still missing better graphics and sound but no time. So I just grabbed a nice palette from http://www.colourlovers.com/palette/2562636/Christina, added a simple particles explosion (http://www.gameplaypassion.com/blog/explosion-effect-html5-canvas/) for the player, chose a small font http://www.dafont.com/pt/bitmap.php and submitted the game.

Nowadays I really regret not taking some time from my sleep to include some sounds and some web-gl filter which I believe it would give the game a better experience but I'm really proud of the result. Especially considering that this was my last completed game in +20 years! Yeah, I'm that old. My last completed game was a platformer written in Turbo Pascal for MS-DOS 😎.

Next year I'll surely participate again.
