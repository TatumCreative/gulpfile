/*

	This file assumes that it's updating a sparse PHP file with only one number in it.
	It reads in the number, increments it, and writes it back out.

*/

var gutil = require('gulp-util');

module.exports = function updateVersionPhp( filepath ) {
	
	var fs = require('fs');
	
	fs.readFile( filepath, 'utf8', function( err, data ) {
	
		if(err) {
			throw new Error(err);
		}
	
		var numberMatch = /\b[0-9]+\b/;
	
		var matches = data.match( numberMatch );
	
		if( matches.length === 0 ) throw new Error( "The read-in file does not contain a number." );
		if( matches.length > 1 ) throw new Error( "The read-in file contains more than 1 number." );
	
		var number = +matches[0];
	
		var result = data.replace( numberMatch, number+1 );
	
		fs.writeFile( filepath, result, 'utf8', function (err) {
			if (err) {
				throw new Error(err);
			}
			
			gutil.log( "PHP theme file update: ", filepath );
		});
	
	});
	
}
