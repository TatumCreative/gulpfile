/*

	TODO
	This file assumes that it's updating an HTML file. It finds the opening and closing tag, then updates the number found in it
	It reads in the number, increments it, and writes it back out.

	<!--version-->
		<link href='script.js?v=5' />
	<!--/version-->

*/
//
// var fs = require('fs');
//
// fs.readFile( filepath, 'utf8', function( err, data ) {
//
// 	if(err) {
// 		throw new Error(err);
// 	}
//
// 	var psuedoTagMatcher = /\<!--version--\>(.*?)\<!--\/version--\>/g;
// 	var versionNumberMatcher = /v=([0-9]*)/g;
//
// 	var pseudoTag, tagContents,;
//
//
// 	while( pseudoTag = psuedoTagMatcher.exec( data ) ) {
//
// 		if( pseudoTag.length === 2 ) {
//
// 			tagContents = pseudoTag[1];
//
// 			tagContents.replace(
//
// 		}
//
// 	}
//
//
// 	while (match !== null) {
// 		// matched text: match[0]
// 		// match start: match.index
// 		// capturing group n: match[n]
// 		match = myRegexp.exec(myString);
// 	}
//
// 	var matches = data.match( numberMatch );
//
// 	if( matches.length === 0 ) {
// 		throw new Error( "The read-in file does not contain a number." );
// 	}
// 	if( matches.length > 1 ) {
// 		throw new Error( "The read-in file contains more than 1 number." );
// 	}
//
// 	var number = +matches[0];
//
// 	var result = data.replace( numberMatch, number+1 );
//
// 	fs.writeFile( filepath, result, 'utf8', function (err) {
// 		if (err) {
// 			throw new Error(err);
// 		}
// 	});
//
// });