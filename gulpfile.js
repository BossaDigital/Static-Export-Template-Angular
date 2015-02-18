// -----------------------------------------------------------
var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	autoPrefixer 	= require('gulp-autoprefixer'),
	minifyCSS 		= require('gulp-minify-css'),
	browserify 		= require('gulp-browserify'),
	concat			= require('gulp-concat'),
	copy 			= require('gulp-copy'),
	livereload 		= require('gulp-livereload'),
	jade 			= require('gulp-jade'),
	webserver 		= require('gulp-webserver');
// -----------------------------------------------------------


gulp.task('sass', function() {
	gulp.src("src/sass/*.scss")
	.pipe(sass())
	.on('error', function(error) {
		console.log(error);
		this.emit('end');
	})
	.pipe(autoPrefixer())
	.pipe(minifyCSS())
	.pipe(gulp.dest("build/css"));
});
gulp.task('templates', function() {
  gulp.src('src/jade/**/*.jade')
	.pipe(jade({}))
	.on('error', function(error) {
		console.log(error);
		this.emit('end');
	})
	.pipe(gulp.dest('./build'))
});

gulp.task('browserify', function() {
	gulp.src(['src/javascripts/main.js'])
	.pipe(browserify({
		insertGlobals: true,
		debug: true
	}))
	.on('error', function(error) {
		console.log(error);
		this.emit('end');
	})
	.pipe(concat('app.js'))
	.pipe(gulp.dest('build/js'));
});

gulp.task('insert-bin',function(){
	return gulp.src('src/bin/**')
	.pipe(copy('build/bin',{
		prefix:2
	}));
});

gulp.task('webserver', function() {
  gulp.src('./build')
    .pipe(webserver({
      livereload: true,
      // directoryListing: true,
      open: true,
      fallback: 'index.html'
    }));
});
gulp.task('watch', function() {
	gulp.watch("src/sass/**/*", ['sass']);
	gulp.watch('src/jade/**/*.jade', ['templates']);
	gulp.watch('src/javascripts/**', ['browserify']);
	gulp.watch('src/bin/**', ['insert-bin']);
	//gulp.watch(paths.srcImg + "/**/*", ['images']);
});
gulp.task('build-all',['sass','templates','browserify','insert-bin']);
gulp.task('default',['watch','webserver']);