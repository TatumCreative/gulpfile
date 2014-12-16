var browserify	= require('browserify'),
	watchify	= require('watchify'),
	reactify	= require('reactify'),
	source		= require('vinyl-source-stream');
	
module.exports = function bundle( gulp, paths, useReact, enableWatching ) {
	
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
		
		if( useReact ) {
			
			bundler.transform( reactify )
				.on('error', function(err){
			    	console.log("Browserify transform error", err.message);
			    	this.end();
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