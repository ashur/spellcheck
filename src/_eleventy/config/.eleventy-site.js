const addRemoteData = require( "@aaashur/eleventy-plugin-add-remote-data" );

module.exports = eleventyConfig =>
{
	/* Files */
	eleventyConfig.addPassthroughCopy({
		"src/static": "/"
	});

	eleventyConfig.ignores.add( "src/bookmarklet/**/*.njk" );

	/* Filters */
	eleventyConfig.addFilter( "cssmin", require( "../filters/cssmin" ) );

	/* Plugins */
	eleventyConfig.addPlugin( addRemoteData, {
		data: {
			robots: "https://api.ashur.cab/robots/v2.json",
		},
	} );

	return {
		dir: {
			input: "src",
			output: "dist",
			layouts: "_layouts",
		},
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	};
};
