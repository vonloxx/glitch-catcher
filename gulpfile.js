var gulp          = require('gulp'),
    webserver     = require('gulp-webserver'),
    opn           = require('opn'),
    concat        = require('gulp-concat'),
    minifyCSS     = require('gulp-minify-css'),
    rename        = require('gulp-rename'),
    uglify        = require('gulp-uglify'),
    jshint        = require('gulp-jshint'),
    minifyHTML    = require('gulp-minify-html'),
    replaceHTML   = require('gulp-html-replace'),
    rimraf        = require('gulp-rimraf'),
    ignore        = require('gulp-ignore'),
    zip           = require('gulp-zip'),
    checkFileSize = require('gulp-check-filesize'),
    watch         = require('gulp-watch'),
    minify        = require('gulp-minify'),

    serveDir = './src',

    server = {
        host: 'localhost',
        port: '9000'
    },

    distPaths = {
        build: '_build',
        //js_concat_file: 'game.js',
        js_build_file: 'game.min.js',
        css_build_file: 'game.min.css'
    },

    sourcePaths = {
        css: [
            'src/css/*.css',
        ],
        js: [
            'src/js/game-object.js',
            'src/js/boids.js',
            'src/js/particle.js',
            'src/js/explosion.js',
            'src/js/text.js',
            'src/js/player.js',
            'src/js/scene.js',
            'src/js/game.js',
            'src/js/scene-menu.js',
            'src/js/scene-game.js',
            'src/js/z-run.js',
        ],
        mainHtml: [
            'src/index.html'
        ]
    };

gulp.task('serve', function () {
    gulp.src(serveDir)
        .pipe(webserver({
            host: server.host,
            port: server.port,
            fallback: 'index.html',
            livereload: false,
            directoryListing: false,
            open: true
    }));
});

/* Golfing tests purposes */
gulp.task('golf', function(){
  return gulp.src('src/test/golf.js')
      .pipe(minify())
      .pipe(gulp.dest('_golf'));
});

gulp.task('openbrowser', function () {
    opn( 'http://' + server.host + ':' + server.port );
});

gulp.task('buildCSS', function () {
    return gulp.src(sourcePaths.css)
        .pipe(concat(distPaths.css_build_file))
        .pipe(minifyCSS())
        .pipe(gulp.dest(distPaths.build));
});

gulp.task('buildJS', function () {
    return gulp.src(sourcePaths.js)
        .pipe(concat(distPaths.js_build_file))
        // .pipe(uglify().on('error', function(e){
        //     console.log(e);
        //  }))
        .pipe(uglify())
        // .pipe(minify({
        //   ext: {
        //     min:'.js'
        //   }
        // }))
        .pipe(gulp.dest(distPaths.build));
});

gulp.task('buildIndex', function () {
    return gulp.src(sourcePaths.mainHtml)
        .pipe(replaceHTML({
            'css': distPaths.css_build_file,
            'js': distPaths.js_build_file
        }))
        .pipe(minifyHTML())
        .pipe(rename('index.html'))
        .pipe(gulp.dest(distPaths.build));
});

gulp.task('cleanBuild', function () {
    return gulp.src('./_build/*', { read: false })
        .pipe(ignore('.gitignore'))
        .pipe(rimraf());
});

gulp.task('zipBuild', function () {
    return gulp.src('./_build/*')
        .pipe(zip('game.zip'))
        .pipe(gulp.dest('./_dist'))
        .pipe(checkFileSize({
            fileSizeLimit: 13312
        }));
});

gulp.task('watch', function () {
    gulp.watch(sourcePaths.css, ['buildCSS', 'zipBuild']);
    gulp.watch(sourcePaths.js, ['buildJS', 'zipBuild']);
    gulp.watch(sourcePaths.mainHtml, ['buildIndex', 'zipBuild']);
});

gulp.task('build', ['buildJS', 'buildCSS', 'buildIndex', 'zipBuild']);
gulp.task('default', ['build', 'serve', 'watch']);
