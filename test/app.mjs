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
		it( "should throw an Error if grid string doesn't produce 9 rows", () =>
		{
			let fn = () => new App( { grid: "invalid grid" } );

			assert.throws( fn, "Invalid grid string: Unexpected row count" );
		});

		it( "should throw an Error if grid string doesn't produce 9 columns", () =>
		{
			let fn = () => new App( { grid: "\t1\t2\t3\t4\t5\t6\t7\t8\nA\nB\nC\nD\nE\nF\nG\nH" } );

			assert.throws( fn, "Invalid grid string: Unexpected column count" );
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
