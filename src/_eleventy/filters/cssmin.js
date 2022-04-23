const CleanCSS = require( "clean-css" );

/**
 * @param {string} css
 * @returns {string}
 */
module.exports = css =>
{
	if( css && process.env.NODE_ENV === "production" )
	{
		console.log( "🗜 Minifying CSS" );

		return new CleanCSS( {} )
			.minify( css.val || css ).styles;
	}

	return css;
};
