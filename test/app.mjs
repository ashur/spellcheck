/* global describe, it */
import {assert} from "chai";
import App from "../src/scripts/app.mjs";

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

	describe( ".grid", () =>
	{
		it( "should be set by constructor", () =>
		{
			let app = new App( { grid: validGrid() } );

			assert.isObject( app.grid );
			assert.hasAllKeys( app.grid, ["wordLengths", "distributions"] );
			assert.hasAllKeys( app.grid.distributions, ["C", "E", "I", "N", "T", "V", "Z"] );
		});
	});

	describe( ".gridRemaining()", () =>
	{
		it( "should return an object identical to .grid if words array is empty", () =>
		{
			let app = new App( { grid: validGrid() } );
			let gridRemaining = app.gridRemaining([]);

			assert.isObject( gridRemaining );
			assert.deepEqual( gridRemaining, app.grid );

			assert.equal( gridRemaining.distributions["C"][4], app.grid.distributions["C"][4] );
			assert.equal( gridRemaining.distributions["T"][4], app.grid.distributions["T"][4] );
		});

		it( "should subtract from .grid totals for each word length", () =>
		{
			let app = new App( { grid: validGrid() } );
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
			let oneRow = () => new App( { grid: "invalid grid" } );
			let twoRows = () => new App( { grid: "invalid\ngrid" } );

			assert.throws( oneRow, "Invalid grid string: Expecting 3 or more lines, found 1" );
			assert.throws( twoRows, "Invalid grid string: Expecting 3 or more lines, found 2" );
		});

		it( "should throw an Error if any row has a different column count", () =>
		{
			let grid = `		 4	  5	  6	  7	  8	  9	 11	  Σ
C:	  1	  2
E:	  -	  1	  2	  1	  -	  -	  -	  4`
			let fn = () => new App( { grid: grid } );

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
	});
});
