/* global describe, it */
import {assert} from "chai";
import {JSDOM} from "jsdom";
import {gridWithoutNewlines} from "./grid.mjs";
import Grid from "../build/grid.mjs";
import UI from "../build/ui.mjs";
import TLL from "../build/tll.mjs";
import {tllWithoutNewlines} from "./tll.mjs";

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

		describe( "#main", () =>
		{
			it( "should render the main modal template", () =>
			{
				const context = {
					grid: Grid.getInstance({
						date: "2022-06-05",
						gridText: gridWithoutNewlines(),
					}),
					tll: TLL.getInstance({
						date: "2022-06-05",
						tllText: tllWithoutNewlines(),
					}),
				};

				const render = UI.getModalRenderer( "main" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elCarousel = document.querySelector(".spellcheck-carousel");
				const elCarouselCards = elCarousel.querySelector(".spellcheck-carousel__cards");
				const elCarouselDots = elCarousel.querySelector(".spellcheck-carousel__dots");

				assert.equal( elCarouselCards.childElementCount, 2, "Number of carousel cards" );
				assert.equal( elCarouselDots.constructor.name, "HTMLDivElement" );
			});

			it( "should render grid word lengths as table column headings", () =>
			{
				const context = {
					grid: Grid.getInstance({
						date: "2022-06-05",
						gridText: gridWithoutNewlines(),
					}),
					tll: TLL.getInstance({
						date: "2022-06-05",
						tllText: tllWithoutNewlines(),
					}),
				};

				const render = UI.getModalRenderer( "main" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elFirstTableRow = document.querySelector( ".spellcheck-carousel .spellcheck-grid .spellcheck-card tr:first-of-type" );
				assert.equal( elFirstTableRow.childElementCount, context.grid.wordLengths.length + 1 )

				elFirstTableRow.childNodes.forEach( (childNode, index) =>
				{
					assert.equal( childNode.tagName, "TH" );

					if( index > 0 )
					{
						assert.equal( childNode.innerHTML, context.grid.wordLengths[index - 1] );
					}
					else
					{
						assert.equal( childNode.innerHTML, "", "First column heading should be empty" );
					}
				});
			});

			it( "should render table rows for each grid distribution", () =>
			{
				const words = ['cite', 'certain'];
				const context = {
					grid: new Grid({
						date: "2022-06-05",

						distributions: {
							C: {
								'4': 2, // remaining = 1
								'6': 0, // remaining = 0
								'7': 1, // remaining = 0
							}
						},

						wordLengths: [4, 7],
					}),
					tll: TLL.getInstance({
						date: "2022-06-05",
						tllText: tllWithoutNewlines(),
					}),
					words,
				};

				const render = UI.getModalRenderer( "main" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elTableRow = document.querySelector( ".spellcheck-carousel .spellcheck-grid .spellcheck-card tr:nth-of-type(2)" )

				assert.equal( elTableRow.childNodes[0]?.innerHTML, "C", "Row heading" );
				assert.equal( elTableRow.childNodes[1]?.innerHTML, 1, "Number of 4-letter C words remaining" );
				assert.equal( elTableRow.childNodes[2]?.innerHTML, "-", "No 6-letter C words possible" );
				assert.isTrue(
					elTableRow.childNodes[3]?.childNodes[0]?.classList?.contains( "spellcheck-checkmark" ),
					"Completed item contains checkmark"
				);
			});

			it( "should render TLL rows for each letter", () =>
			{
				const words = ['cite', 'certain'];
				const context = {
					grid: new Grid({
						date: "2022-06-05",

						distributions: {
							C: {
								'4': 2, // remaining = 1
								'6': 0, // remaining = 0
								'7': 1, // remaining = 0
							},
							E: {
								'4': 2,
								'6': 0,
								'7': 1,
							},
						},

						wordLengths: [4, 6, 7],
					}),
					tll: TLL.getInstance({
						counts: {
							"CE": 2, // remaining = 1
							"CI": 1, // remaining = 0

							"EC": 1, // remaining = 1
						},
						date: "2022-06-05",
					}),
					words,
				};

				const render = UI.getModalRenderer( "main" );
				const dom = new JSDOM( render( context ) );
				const {document} = dom.window;

				const elList = document.querySelector( ".spellcheck-carousel .spellcheck-tll .spellcheck-tll__list" );
				assert.equal( elList.childElementCount, context.tll.remaining([]).length );

				const elListItem__CE = elList.childNodes[0].childNodes[0];
				assert.isFalse(
					elListItem__CE.classList.contains( "spellcheck-tll__list-item--checked"),
					"'CE' list item has checked class",
				);
				assert.equal(
					elListItem__CE.querySelector( ".spellcheck-tll__count" ).innerHTML,
					1,
				);

				const elListItem__CI = elList.childNodes[0].childNodes[2];
				assert.isTrue(
					elListItem__CI.classList.contains( "spellcheck-tll__list-item--checked"),
					"'CI' list item has checked class",
				);

				assert.isTrue(
					elListItem__CI.querySelector( ".spellcheck-tll__count" )
						.childNodes[0]
						.classList.contains( "spellcheck-checkmark" ),
					"'CI' list item has checkmark"
				);
			});
		});
	});
});
