import UI from "./ui.mjs";

class App
{
	/**
	 * @param {Object} [options]
	 * @param {string} [options.grid] - String representation of today's grid
	 */
	constructor({ grid } = {})
	{
		this.grid = App.parseGrid( grid );
	}

	async fetchGrid( url )
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
	 * @param {Array} [words=[]}
	 */
	gridRemaining( words=[] )
	{
		let gridRemaining = {};
		Object.keys( this.grid ).forEach( gridLetter =>
		{
			gridRemaining[gridLetter] = Object.assign( {}, this.grid[gridLetter] );
		});

		words.forEach( word =>
		{
			let letter = word[0].toUpperCase();
			let length = word.length;
			if( gridRemaining[letter] && gridRemaining[letter][length] )
			{
				gridRemaining[letter][length]--;
			}
		});

		return gridRemaining;
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

	showModal()
	{
		let body = "";

		UI.showModal({
			title: "Spell Check",
			subtitle: "Remaining words in today’s puzzle.",
			body: body,
		});
	}
}

export default App;