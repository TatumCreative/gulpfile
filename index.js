var gulp		= require('gulp'),
	browserify	= require('browserify'),
	watchify	= require('watchify'),
	reactify	= require('reactify'),
	source		= require('vinyl-source-stream'),
	minifyify	= require('minifyify'),
	sourcemaps	= require('gulp-sourcemaps'),
	uglify		= require('gulp-uglify'),
	rename		= require('gulp-rename'),
	gutil		= require('gulp-util'),
	jshint		= require('gulp-jshint'),
	react		= require('gulp-react'),
	sass		= require('gulp-ruby-sass'),
	replace		= require('gulp-replace'),
	iconfont	= require('gulp-iconfont'),
	plumber		= require('gulp-plumber'),
	consolidate	= require('gulp-consolidate');


var paths = (function() {

	var packageJson = JSON.parse(
		require('fs').readFileSync( "package.json", 'utf8' )
	);

	return packageJson.gulpfilePaths;
	
})();

function _clearConsole() {
	if( !noClearing ) {
		console.log('\033[2J');
	}
}
var noClearing = false; //kind of hacky, but whatever

function _bundle( enableWatching ) {
	
	var bundler, performBundle;
	
	bundler = browserify(paths.entry, {
		//Source maps
		debug: true, 
		
		//watchify args
		cache: {},
		packageCache: {},
		fullPaths: true
	});
	
	if( enableWatching ) {
		bundler = watchify( bundler );
	}
	
	performBundle = function() {
		
		//gulp.start('jshint');
		var stream;
		
		return bundler
			.transform(reactify)
			.on('error', function(err){
		    	console.log("Browserify transform error", err.message);
		    	this.end();
		    })
			.bundle()
			.on('error', function(err){
		    	console.log("Browserify bundle error", err.message);
		    	this.end();
		    })
			.pipe( source( paths.bundleName ))
			.pipe( gulp.dest( paths.build ));
		
	};

	bundler.on('update', performBundle);
	
	return performBundle();
	
}

gulp.task('default', ['watch']);

gulp.task('watch', function() {
	
	gulp.watch( paths.sass, ['sass'] );
	gulp.watch( paths.js, ['browserify'] );
	
	_clearConsole();
	noClearing = true;
	
	gulp.start( 'browserify' );
	gulp.start( 'sass' );
	
	setTimeout(function() {
		noClearing = false;
	}, 2000);
	
});

gulp.task('browserify', ['jshint'], function() {
	_bundle();
});

gulp.task('sass', function() {
	
	_clearConsole()
	
	gulp.src(paths.sassEntry)
		.pipe(sass({
			sourcemapPath: "/"
		}))
		.on('error', function (err) { console.log(err.message); })
		.pipe(replace(/\/Library\/WebServer\/cubic-sites\/vail\/fa-content\/themes\/vos\//g, '../../'))
		.pipe(gulp.dest( paths.css ));
	
	// gulp-sass
	// gulp.src( paths.sassEntry )
	//     .pipe(sourcemaps.init({includeContent: truef, sourceRoot: '/sass'}))
	// 		.pipe(sass())
	// 	.pipe(sourcemaps.write( '.' ))
	//     .pipe(gulp.dest( paths.css ));
	
	gutil.beep();
		
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
	
	_clearConsole()
	
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
