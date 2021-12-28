import UI from "./ui.mjs";

class App
{
	/**
	 * @param {Object} [options]
	 * @param {Object} [options.grid]
	 */
	constructor({ grid } = {})
	{
		this.grid = grid;
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
	 * @param {string} gridString
	 * @returns {Object}
	 */
	static parseGrid( gridString )
	{
		let result = {
			distributions: {},
			wordLengths: 0,
		};

		// Insert newlines if they're missing — ex., when fetched with `fetch()`
		if( !gridString.includes( "\n" ) )
		{
			gridString = gridString.replace( /(.\:)/g, "\n$&" );
		}

		let gridRows = gridString
			.split( "\n" )
			.map( row => row.replace( /\s+/g, "\t" ).split( "\t" ) );

		if( gridRows.length < 3)
		{
			throw new Error( `Invalid grid string: Expecting 3 or more lines, found ${gridRows.length}` );
		}

		gridRows.forEach( (gridRow, index) =>
		{
			let expectedColummns = gridRows[0].length;
			if( gridRow.length !== expectedColummns )
			{
				throw new Error( `Invalid grid string: Expecting ${expectedColummns} columns on line ${index+1}, found ${gridRow.length}` );
			}
		});

		let letterCount = gridRows.length - 1;
		let wordLengths = gridRows[0].slice( 1, gridRows[0].length - 1 );
		result.wordLengths = wordLengths.map( wordLength => parseInt( wordLength ) );

		for( let l=1; l<letterCount; l++ )
		{
			let letter = gridRows[l][0].replace( ":", "" ).toUpperCase();
			let letterCounts = gridRows[l].slice( 1, gridRows[0].length - 1 );

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
