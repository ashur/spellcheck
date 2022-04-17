const {minify} = require( "html-minifier" );

/**
 * @param {string} html
 * @returns {string}
 */
module.exports = html =>
{
	if( html && process.env.NODE_ENV === "production" )
	{
		console.log( "🗜 Minifying HTML" );

		return minify( html );
	}

	return html;
};
