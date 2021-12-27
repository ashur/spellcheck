class App
{
	/**
	 * @param {Object} [options]
	 * @param {Object} [options.grid]
	 */
	constructor({ grid } = {})
	{
		this.grid = App.parseGrid( grid );
	}

	async getGrid( url )
	{
		try
		{
			let html = await fetch( url );
			console.log( html );

			return html;
		}
		catch( error )
		{
			// ...
		}
	}

	/**
	 * @param {string}
	 * @returns {Object}
	 */
	static parseGrid( grid )
	{
		let result = {};

		let gridRows = grid
			.split( "\n" )
			.map( row => row.replace( /\s+/g, "\t" ).split( "\t" ) );

		// Validate parse results
		if( gridRows.length !== 9 )
		{
			throw new Error( "Invalid grid string: Unexpected row count" );
		}

		gridRows.forEach( gridRow =>
		{
			if( gridRow.length !== 9 )
			{
				throw new Error( "Invalid grid string: Unexpected column count" );
			}
		});

		let wordLengths = gridRows[0].slice( 1, 8 );

		for( let l=1; l<8; l++ )
		{
			let letter = gridRows[l][0].replace( ":", "" ).toUpperCase();
			let letterCounts = gridRows[l].slice( 1, 8 );

			if( !result[letter] )
			{
				result[letter] = {};
			}

			letterCounts.forEach( (value, index) =>
			{
				let letterCount = value === "-" ? 0 : parseInt( value );
				result[letter][wordLengths[index]] = letterCount;
			});
		}

		return result;
	}
}

export default App;
