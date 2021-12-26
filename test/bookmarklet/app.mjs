/* global describe, it */
import {assert} from "chai";
import App from "../../src/bookmarklet/app.mjs";

describe( "App", () =>
{
	let validGrid = `         4	  5	  6	  7	  8	  9	 11	  Σ
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
			let app = new App( { grid: validGrid } );

			assert.isObject( app.grid );
			assert.hasAllKeys( app.grid, ["C", "E", "I", "N", "T", "V", "Z"] );
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

		it( "should be return object with grid letters as keys", () =>
		{
			let parseResult = App.parseGrid( validGrid );

			assert.isObject( parseResult );
			assert.hasAllKeys( parseResult, ["C", "E", "I", "N", "T", "V", "Z"] );

			assert.equal( parseResult["C"][4], 1 );
			assert.equal( parseResult["C"][5], 2 );
			assert.equal( parseResult["C"][6], 0 );
			assert.equal( parseResult["C"][7], 1 );
			assert.equal( parseResult["C"][8], 0 );
			assert.equal( parseResult["C"][9], 0 );
			assert.equal( parseResult["C"][11], 0 );

			assert.equal( parseResult["I"][4], 0 );
			assert.equal( parseResult["I"][5], 1 );
			assert.equal( parseResult["I"][6], 4 );
			assert.equal( parseResult["I"][7], 1 );
			assert.equal( parseResult["I"][8], 0 );
			assert.equal( parseResult["I"][9], 3 );
			assert.equal( parseResult["I"][11], 1 );
		});
	});
});
