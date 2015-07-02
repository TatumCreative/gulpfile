var gulp				= require('gulp'),
	sourcemaps			= require('gulp-sourcemaps'),
	uglify				= require('gulp-uglify'),
	rename				= require('gulp-rename'),
	gutil				= require('gulp-util'),
	jshint				= require('gulp-jshint'),
	react				= require('gulp-react'),
	sass				= require('gulp-ruby-sass'),
	replace				= require('gulp-replace'),
	iconfont			= require('gulp-iconfont'),
	plumber				= require('gulp-plumber'),
	consolidate			= require('gulp-consolidate'),
	runBrowserify		= require('./src/browserifyBundle'),
	updateVersionPhp	= require('./src/updateVersionPhp'),
	updateVersionHtml	= require('./src/updateVersionHtml'),
	clearConsole		= require('./src/clearConsole'),
	shell				= require('gulp-shell');

var config = JSON.parse( require('fs').readFileSync( "package.json", 'utf8' ) ).gulpfile;
var paths = config.paths;


function _updateTheme() {
	if( config.phpVersionFile ) updateVersionPhp( config.phpVersionFile );
	if( config.htmlVersionFile ) updateVersionHtml( config.htmlVersionFile );
}

gulp.task('default', ['watch']);

gulp.task('watch', function() {
	
	clearConsole();
	clearConsole.pause = true;
	
	if( paths.sass ) {
		gulp.watch( paths.sass, ['sass'] );
		gulp.start( 'sass' );
	}
	
	if( paths.jsWatch ) {
		gulp.watch( paths.jsWatch, ['browserify'] );
		gulp.start( 'browserify' );		
	}
	
	//Hack not to clear on initial load
	setTimeout(function() {
		clearConsole.pause = false;
	}, 3000);
	
});

gulp.task('outdated', (function() {
	
	return shell.task([
		'npm outdated --depth=0;',
		'cd node_modules/gulpfile; npm outdated --depth=0;'
	]);
			
})() );

gulp.task('browserify', ['jshint'], function() {
	
	runBrowserify( gulp, paths, config.transforms );
	_updateTheme();
	
});

gulp.task('sass', function() {
	
	clearConsole()
	
	gulp.src(paths.sassEntry)
		.pipe(sass({
			sourcemapPath: "/"
		}))
		.on('error', function (err) { console.log(err.message); })
		.pipe(replace(/\/Library\/WebServer\/cubic-sites\/vail\/fa-content\/themes\/vos\//g, '../../'))
		.pipe(gulp.dest( paths.css ));
	
	_updateTheme();
	
	
});

gulp.task('build', function() {
	
	gulp.start('bundle');
	gulp.start('minify');
	
});

gulp.task('minify', function() {

	gulp.src( paths.build + paths.bundleName )
	.pipe(sourcemaps.init({loadMaps: true}))
		.pipe( uglify() )
		.pipe( rename( paths.minName ) )
		.pipe( gulp.dest( paths.build ))
	.pipe( sourcemaps.write('.'))
	.pipe( gulp.dest( paths.build ));
		
});

gulp.task('jshint', function() {

	var r = react();
	clearConsole();
	
	return gulp.src( paths.js )
		.pipe( r )
		.on('error', function( error ) {

			gutil.log( "Error in plug-in:", gutil.colors.red.bold( error.plugin ) );
			gutil.log( gutil.colors.red( error.message ) );
			gutil.log( gutil.colors.red( error.fileName ) );
			
			r.end();
			gutil.beep();
			
		})
	    .pipe( jshint( process.cwd() + '/.jshintrc' ) )
	    .pipe( jshint.reporter('jshint-stylish') );		
		
});

gulp.task('iconfont', function(){
	
	var fontName = 'cubic-icons';
	var template = 'fontawesome-style';
	
	return gulp.src( paths.svg )
	
		.pipe(iconfont({
			fontName: fontName,		//required
			appendCodepoints: true	//recommended option
		}))
		.on('codepoints', function(codepoints, options) {
			
			// CSS templating
			var options = {
				glyphs: codepoints,
				fontName: fontName,
				fontPath: './',	// set path to font (from your CSS file if relative)
				className: 'icon'			// set class name in your CSS
			};
			
			// Export CSS
			gulp.src(paths.svgTemplates + template + '.css')
				.pipe(consolidate('lodash', options))
				.pipe(rename({ basename:fontName }))
				.pipe(gulp.dest( paths.svgBuild )); // set path to export your CSS

			// Export HTML
			gulp.src(paths.svgTemplates + template + '.html')
				.pipe(consolidate('lodash', options))
				.pipe(rename({ basename:fontName }))
				.pipe(gulp.dest( paths.svgBuild )); // set path to export your sample HTML
			  
		})
		.pipe(gulp.dest( paths.svgBuild ));
});

module.exports = gulp;