var browserify	= require('browserify'),
	watchify	= require('watchify'),
	reactify	= require('reactify'),
	glslify		= require('glslify'),
	source		= require('vinyl-source-stream');
	
module.exports = function bundle( gulp, paths, transforms, enableWatching ) {
	
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
		
		if( transforms ) {
			transforms.forEach( function( transform ) {
			
				bundler.transform( require( transform ) )
					.on('error', function(err){
				    	console.log( transform + " transform error", err.message );
				    	this.end();
				    })
				;
			
			});
		}
				
		return bundler
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