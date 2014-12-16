#gulpfile

A personal configuration for gulp, using the package.json to declaratively configure.

##To install:
	npm install git://github.com/TatumCreative/gulpfile.git#v1.0.2 --save-dev

##package.json gulpfilePaths property

	"gulpfilePaths": {
	  "entry"             : "./js/main.js",
	  "js"                : ["js/**/*.js", "js/**/*.jsx", "gulpfile.js"],
	  "hint"              : ["assets/build/bundle.js", "gulpfile.js"],
	  "build"             : "./assets/build/",
	  "bundleName"        : "bundle.js",
	  "minName"           : "bundle.min.js",
	  "mapName"           : "bundle.min.map"  ,
	  "sass"              : "sass/**/*.scss",
	  "sassEntry"	        : "sass/main.scss",
	  "css"               : "./assets/build",
	  "svg"               : "./assets/svg/*.svg",
	  "svgBuild"          : "./assets/fonts/icons",
	  "svgTemplates"      : "./assets/svg/templates/"
	},
