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

	/**
	 * @param {string} url
	 * @return {Object}
	 */
	static async fetchGrid( url )
	{
		let gridUrl = new URL( url );
		let today = gridUrl.pathname
			.split( "/" )
			.slice( 1, 4 )
			.join( "-" );

		let localData = App.getLocalData();

		// We already fetched today's grid
		if( localData.today === today )
		{
			return localData.grid;
		}

		try
		{
			let response = await fetch( url );
			let div = document.createElement( "html" );
			div.innerHTML = await response.text();

			let gridElement = div.querySelector( ".StoryBodyCompanionColumn p:nth-child(5)" );
			if( gridElement )
			{
				localData.grid = App.parseGrid( gridElement.innerText );
				localData.today = today;

				App.setLocalData( localData );
			}
			else
			{
				throw new Error( "There was a problem fetching today’s grid" );
			}
		}
		catch( error )
		{
			if( error.isSpellCheckError )
			{
				console.log( error.details );
			}

			throw new Error( "There was a problem parsing today’s grid" );
		}

		return localData.grid;
	}

	/**
	 * @returns {Object}
	 */
	static getLocalData()
	{
		let localData = localStorage.getItem( "spellcheck" );
		if( localData )
		{
			return JSON.parse( localData );
		}
		else
		{
			return {};
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

	/**
	 * @param {Object} data
	 */
	static setLocalData( data )
	{
		localStorage.setItem( "spellcheck", JSON.stringify( data ) );
	}

	/**
	 * @param {string} errorMessage
	 * @param {string} [details] - ex., .message from a thrown Error
	 */
	static showErrorModal( errorMessage, details )
	{
		let body = errorMessage
			.split( "\n" )
			.map( line => `<p class="sb-modal-message">${line}</p>` )
			.join( "\n" );

		body += `<p class="sb-modal-message">Please click or tap the Spell Check bookmarklet to try again, or <a href="#">report the issue</a>.</p>`;

		if( details )
		{
			body += `<details class=""><summary>More details</summary><span class="sc-details">${details}</span></details>`;
		}

		UI.showModal({
			title: "Spell Check",
			subtitle: "An unexpected problem occurred.",
			body: body,
		});
	}

	/**
	 * Show the grid modal
	 */
	showGridModal()
	{
		let {words} = JSON.parse( localStorage.getItem( "sb-today" ) );
		let gridRemaining = this.gridRemaining( words );

		let wordLengths = this.grid.wordLengths
			.map( wordLength =>
			{
				return `<th>${wordLength}</th>`
			})
			.join( "\n" );

		let wordLengthRow = `
			<tr>
				<th></th>
				${wordLengths}
			</tr>`;

		let distributionRows = Object.keys( gridRemaining.distributions )
			.map( letter =>
			{
				let distributionRow = `
				<tr>
					<th>${letter}</th>`;

				Object.keys( gridRemaining.distributions[letter] ).forEach( wordLength =>
				{
					let classList = [];
					let originalValue = this.grid.distributions[letter][wordLength]
					let currentValue = gridRemaining.distributions[letter][wordLength];

					if( currentValue === 0 )
					{
						if( originalValue === 0 )
						{
							currentValue = "-";
						}
						else
						{
							currentValue = '<span class="checked"><span class="visually-hidden">0</span></span>';
						}
					}

					distributionRow += `<td class="${classList.join( " " )}">${currentValue}</td>`;
				});

				distributionRow += "</tr>";

				return distributionRow;
			})
			.join( "\n" );

		let body = `
			<table class="sb-modal-table">
				<tbody>
					${wordLengthRow}
					${distributionRows}
				</tbody>
			</table>
		`;

		UI.showModal({
			title: "Spell Check",
			subtitle: "Words remaining in today’s puzzle.",
			body: body,
		});
	}
}

export default App;
