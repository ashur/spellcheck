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
		let gridRemaining = {
			distributions: {},
			wordLengths: this.grid.wordLengths,
		};

		Object.keys( this.grid.distributions ).forEach( letter =>
		{
			gridRemaining.distributions[letter] = Object.assign( {}, this.grid.distributions[letter] );
		});

		words.forEach( word =>
		{
			let letter = word[0].toUpperCase();
			let length = word.length;
			if( gridRemaining.distributions[letter] && gridRemaining.distributions[letter][length] )
			{
				gridRemaining.distributions[letter][length]--;
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
		let result = {
			distributions: {},
			wordLengths: 0,
		};

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
		result.wordLengths = wordLengths.map( wordLength => parseInt( wordLength ) );

		for( let l=1; l<8; l++ )
		{
			let letter = gridRows[l][0].replace( ":", "" ).toUpperCase();
			let letterCounts = gridRows[l].slice( 1, 8 );

			if( !result.distributions[letter] )
			{
				result.distributions[letter] = {};
			}

			letterCounts.forEach( (value, index) =>
			{
				let letterCount = value === "-" ? 0 : parseInt( value );
				result.distributions[letter][wordLengths[index]] = letterCount;
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
