module.exports = (eleventyConfig) =>
{
	/* Filters */
	eleventyConfig.addFilter('cssmin', require('../filters/cssmin'));

	return {
		dir: {
			input: './src/bookmarklet',
			output: './build'
		},

		htmlTemplateEngine: "njk",
		templateFormats: ["js", "njk"],
	};
};
