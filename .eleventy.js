module.exports = eleventyConfig =>
{
	eleventyConfig.addPassthroughCopy({
		"src/static": "/"
	});

	return {
		dir: {
			input: "src",
			output: "dist",
			layouts: "_layouts",
		},
		htmlTemplateEngine: "njk",
	};
};