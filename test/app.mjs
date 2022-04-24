/* global describe, it */
import {assert} from "chai";
import App from "../build/app.mjs";

describe( "App", () =>
{
	let validGrid = () => `         4	  5	  6	  7	  8	  9	 11	  Σ
C:	  1	  2	  -	  1	  -	  -	  -	 4
E:	  -	  1	  2	  1	  -	  -	  -	  4
I:	  -	  1	  4	  1	  -	  3	  1	 10
N:	  3	  1	  -	  1	  1	  -	  -	  6
T:	  2	  1	  -	  -	  -	  -	  -	  3
V:	  3	  -	  -	  -	  -	  -	  -	 3
Z:	  3	  -	  -	  -	  -	  -	  -	  3
Σ:	 12	  6	  6	  4	  1	  3	  1	 33`;

	describe( ".flags", () =>
	{
		it( "should be set by constructor", () =>
		{
			let flags = 'REMINDER=true,GRID_RESET=true';
			let app = new App( { flags: flags } );

			assert.isObject( app.flags );
			assert.deepEqual( app.flags, {
				REMINDER: 'true',
				GRID_RESET: 'true',
			} );
		});
	});


	describe( ".grid", () =>
	{
		it( "should be set by constructor", () =>
		{
			let grid = App.parseGrid( validGrid() );
			let app = new App( { grid: grid } );

			assert.isObject( app.grid );
			assert.hasAllKeys( app.grid, ["wordLengths", "distributions"] );
			assert.hasAllKeys( app.grid.distributions, ["C", "E", "I", "N", "T", "V", "Z"] );
		});
	});

	describe( ".gridRemaining()", () =>
	{
		it( "should return an object identical to .grid if words array is empty", () =>
		{
			let app = new App({
				grid: App.parseGrid( validGrid() )
			});
			let gridRemaining = app.gridRemaining([]);

			assert.isObject( gridRemaining );
			assert.deepEqual( gridRemaining, app.grid );

			assert.equal( gridRemaining.distributions["C"][4], app.grid.distributions["C"][4] );
			assert.equal( gridRemaining.distributions["T"][4], app.grid.distributions["T"][4] );
		});

		it( "should subtract from .grid totals for each word length", () =>
		{
			let app = new App({
				grid: App.parseGrid( validGrid() )
			});
			let gridRemaining = app.gridRemaining([
				"cart",
				"tort",
			]);

			assert.equal( gridRemaining.distributions["C"][4], app.grid.distributions["C"][4] - 1, "Remaining 4-letter C words" );
			assert.equal( gridRemaining.distributions["T"][4], app.grid.distributions["T"][4] - 1, "Remaining 4-letter T words" );
		});
	});

	describe( ".parseGrid()", () =>
	{
		it( "should throw an Error if grid string doesn't produce 3 or more rows", () =>
		{
			let oneRow = () => App.parseGrid( "invalid grid" );
			let twoRows = () => App.parseGrid( "invalid\ngrid" );

			assert.throws( oneRow, "Invalid grid string: Expecting 3 or more lines, found 1" );
			assert.throws( twoRows, "Invalid grid string: Expecting 3 or more lines, found 2" );
		});

		it( "should throw an Error if any row has a different column count", () =>
		{
			let grid = `		 4	  5	  6	  7	  8	  9	 11	  Σ
C:	  1	  2
E:	  -	  1	  2	  1	  -	  -	  -	  4`
			let fn = () => App.parseGrid( grid );

			assert.throws( fn, "Invalid grid string: Expecting 9 columns on line 2, found 3" );
		});

		it( "should contain .distributions property that uses grid letters as keys", () =>
		{
			let parseResult = App.parseGrid( validGrid() );

			assert.isObject( parseResult );
			assert.hasAllKeys( parseResult, ["wordLengths", "distributions"] );

			assert.hasAllKeys( parseResult.distributions, ["C", "E", "I", "N", "T", "V", "Z"] );

			assert.equal( parseResult.distributions["C"][4], 1 );
			assert.equal( parseResult.distributions["C"][5], 2 );
			assert.equal( parseResult.distributions["C"][6], 0 );
			assert.equal( parseResult.distributions["C"][7], 1 );
			assert.equal( parseResult.distributions["C"][8], 0 );
			assert.equal( parseResult.distributions["C"][9], 0 );
			assert.equal( parseResult.distributions["C"][11], 0 );

			assert.equal( parseResult.distributions["I"][4], 0 );
			assert.equal( parseResult.distributions["I"][5], 1 );
			assert.equal( parseResult.distributions["I"][6], 4 );
			assert.equal( parseResult.distributions["I"][7], 1 );
			assert.equal( parseResult.distributions["I"][8], 0 );
			assert.equal( parseResult.distributions["I"][9], 3 );
			assert.equal( parseResult.distributions["I"][11], 1 );
		});

		it( "should be include .wordLengths property", () =>
		{
			let parseResult = App.parseGrid( validGrid() );
			assert.deepEqual( parseResult.wordLengths, [4,5,6,7,8,9,11] );
		});

		it( "should support a format without newlines", () =>
		{
			let weirdGrid = `          4\t  5\t  6\t  7\t  8\t  9\t  ΣA:\t  3\t  4\t  2\t  1\t  -\t  -\t 10G:\t  4\t  3\t  2\t  2\t  -\t  -\t 11L:\t  3\t  1\t  -\t  -\t  1\t  -\t  5M:    7\t  8\t  3\t  -\t  -\t  1\t 19R:\t  2\t  1\t  -\t  -\t  -\t  -\t  3Σ:\t 19\t 17\t  7\t  3\t  1\t  1\t 48`;

			let parseResult = App.parseGrid( weirdGrid );

			assert.isObject( parseResult );
			assert.hasAllKeys( parseResult, ["wordLengths", "distributions"] );
			assert.hasAllKeys( parseResult.distributions, ["A", "G", "L", "M", "R"] );
		});

		it( "should support the grid that broke parsing on 2022-01-25", () =>
		{
			// This grid definition has an unexpected extra space
			// "2 Σ:" is usually "2Σ:"

			let gridString = "          4\t  5\t  6\t  8\t  ΣB:\t  7\t  3\t  4\t  -\t 14E:\t  1\t  1\t  -\t  -\t  2H:\t  1\t  2\t  2\t  2\t  7N:\t  1\t  1\t  -\t  -\t  2O:\t  2\t  -\t  -\t  -\t  2 Σ:\t 12\t  7\t  6\t  2\t 27";

			let parseResult = App.parseGrid( gridString );

			assert.isObject( parseResult );
			assert.hasAllKeys( parseResult, ["wordLengths", "distributions"] );
			assert.hasAllKeys( parseResult.distributions, ["B", "E", "H", "N", "O"] );
		});

		it( "should support the grid that broke parsing on 2022-01-25 in Safari", () =>
		{
			// Apparently Safari preserves newlines in .innerText, so the
			// fix for 2022-01-25 requires special handling

			let gridString = "          4	  5	  6	  8	  Σ\n"
				+ "B:	  7	  3	  4	  -	 14\n"
				+ "E:	  1	  1	  -	  -	  2\n"
				+ "H:	  1	  2	  2	  2	  7\n"
				+ "N:	  1	  1	  -	  -	  2\n"
				+ "O:	  2	  -	  -	  -	  2 \n"
				+ "Σ:	 12	  7	  6	  2	 27"
			;

			let parseResult = App.parseGrid( gridString );

			assert.isObject( parseResult );
			assert.hasAllKeys( parseResult, ["wordLengths", "distributions"] );
			assert.hasAllKeys( parseResult.distributions, ["B", "E", "H", "N", "O"] );
		});
	});

	describe( ".parseMetadata()", () =>
	{
		it( "should return the number of pangrams", () =>
		{
			const metadataString = "WORDS: 30, POINTS: 115, PANGRAMS: 1 (1 Perfect)";
			const parseResult = App.parseMetadata( metadataString );

			assert.deepEqual( parseResult, { pangrams: 1 } );
		});

		it( "should return 'pangrams: 0' if metadata string is improperly formattted", () =>
		{
			const metadataString = "";
			const parseResult = App.parseMetadata( metadataString );

			assert.deepEqual( parseResult, { pangrams: 0 } );
		});
	});
});
