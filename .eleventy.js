module.exports = eleventyConfig =>
{
	/* Files */
	eleventyConfig.addPassthroughCopy({
		"src/static": "/"
	});

	/* Filters */
	eleventyConfig.addFilter( "cssmin", require( "./src/_eleventy/filters/cssmin" ) );

	return {
		dir: {
			input: "src",
			output: "dist",
			layouts: "_layouts",
		},
		htmlTemplateEngine: "njk",
	};
};
