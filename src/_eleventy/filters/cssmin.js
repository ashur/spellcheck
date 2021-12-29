const CleanCSS = require( "clean-css" );

/**
 * @param {string} css
 * @returns {string}
 */
module.exports = css =>
{
	if( css && process.env.NODE_ENV === "production" )
	{
		let options = {
			level: {
				2: {
					all: true,
				},
			},
		};

		console.log( "🗜 Minifying CSS" );

		return new CleanCSS( options )
			.minify( css ).styles;
	}

	return css;
};
