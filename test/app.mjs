/* global describe, it */
import {assert} from "chai";
import App from "../build/app.mjs";
import {gridWithNewlines} from "./grid.mjs";

describe( "App", () =>
{
	describe.skip( ".flags", () =>
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
});
