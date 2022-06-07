/* global describe, it */
import {assert} from "chai";
import {JSDOM} from "jsdom";
import {gridWithoutNewlines} from "./grid.mjs";
import Grid from "../build/grid.mjs";
import UI from "../build/ui.mjs";

describe( "UI", () =>
{
	describe( ".getModalRenderer()", () =>
	{
		describe( "#error", () =>
		{
			it( "should render the error modal template", () =>
			{
				const error = new Error( "Lorem ipsum dolor sit amet" );
				const context = {
					error,
				};

				const render = UI.getModalRenderer( "error" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elError = document.querySelector( ".spellcheck-error" );

				assert.equal(
					elError.constructor.name,
					"HTMLDivElement"
				);
				assert.equal(
					document.querySelector( ".spellcheck-error__message p" ).innerHTML,
					error.message,
				);
				assert.isNull(
					document.querySelector( ".spellcheck-error__details" )
				);
			});

			it( "should split error.message into paragraph elements by line", () =>
			{
				const error = new Error( "Lorem ipsum dolor sit amet\nConsectetur adipiscing elit" );
				const context = {
					error,
				};

				const render = UI.getModalRenderer( "error" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elErrorMessageChildren = document.querySelectorAll( ".spellcheck-error__message p" );

				assert.equal( elErrorMessageChildren.length, 2 );
				assert.equal( elErrorMessageChildren[0].innerHTML, "Lorem ipsum dolor sit amet" );
				assert.equal( elErrorMessageChildren[1].innerHTML, "Consectetur adipiscing elit" );
			});

			it( "should render error__details if error.details is defined", () =>
			{
				const error = new Error( "Lorem ipsum dolor sit amet" );
				error.details = "Sed do eiusmod tempor incididunt";

				const context = {
					error,
				};

				const render = UI.getModalRenderer( "error" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elError = document.querySelector( ".spellcheck-error" );

				assert.equal(
					document.querySelector( ".spellcheck-error__details .spellcheck-error__details-contents" ).innerHTML,
					error.details,
				);
			});
		});
		});
	});
});
