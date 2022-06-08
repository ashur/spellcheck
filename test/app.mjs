/* global describe, it */
import {assert} from "chai";
import App, {APP_VERSION} from "../build/app.mjs";
import Grid from "../build/grid.mjs";
import {gridWithoutNewlines} from "./grid.mjs";
import {MockLocalStorage} from "./storage.mjs";
import TLL from "../build/tll.mjs";
import {tllWithoutNewlines} from "./tll.mjs";

const hintsUrl = "https://www.nytimes.com/2022/06/05/crosswords/spelling-bee-forum.html";

describe( "App", () =>
{
	describe( ".getInstance()", () =>
	{
		it( "should return an instance of App", async () =>
		{
			App.fetchHints = mockFetchHints();
			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-05",
						gridText: gridWithoutNewlines(),
					}),
					tll: {
						counts: TLL.parseText( tllWithoutNewlines() ).counts,
						date: "2022-06-05",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );
			assert.instanceOf( app, App );
			assert.instanceOf( app.grid, Grid );
			assert.instanceOf( app.tll, TLL );
		});

		it( "should not fetch hints if app version and grid and TLL dates match storage", async () =>
		{
			let didFetch = false;
			const callback = () => {
				didFetch = true;
			};

			App.fetchHints = mockFetchHints( callback );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-05",
						gridText: gridWithoutNewlines(),
					}),
					tll: {
						counts: TLL.parseText( tllWithoutNewlines() ).counts,
						date: "2022-06-05",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			assert.isFalse( didFetch );
			assert.instanceOf( app.grid, Grid );
			assert.instanceOf( app.tll, TLL );
		});

		it( "should fetch hints if app version doesn't match storage", async () =>
		{
			let didFetch = false;
			const callback = () => {
				didFetch = true;
			};

			App.fetchHints = mockFetchHints( callback );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-05",
						gridText: gridWithoutNewlines(),
					}),
					tll: TLL.getInstance({
						date: "2022-06-05",
						tllText: tllWithoutNewlines(),
					}),
					version: "0.1.23",
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			assert.isTrue( didFetch );
		});

		it( "should fetch hints if grid date doesn't match URL", async () =>
		{
			let didFetch = false;
			const callback = () => {
				didFetch = true;
			};

			App.fetchHints = mockFetchHints( callback );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-04",
						gridText: gridWithoutNewlines(),
					}),
					tll: {
						counts: TLL.parseText( tllWithoutNewlines() ).counts,
						date: "2022-06-05",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			assert.isTrue( didFetch );
		});

		it( "should fetch hints if TLL date doesn't match URL", async () =>
		{
			let didFetch = false;
			const callback = () => {
				didFetch = true;
			};

			App.fetchHints = mockFetchHints( callback );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-04",
						gridText: gridWithoutNewlines(),
					}),
					tll: {
						counts: TLL.parseText( tllWithoutNewlines() ).counts,
						date: "2022-06-04",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			assert.isTrue( didFetch );

			assert.instanceOf( app.grid, Grid );
			assert.equal( app.grid.date, "2022-06-05" );

			assert.instanceOf( app.tll, TLL );
			assert.equal( app.tll.date, "2022-06-05" );
		});

		it( "should write latest grid to storage if fetched", async () =>
		{
			const latestGrid = {
				date: "2022-06-05",
			};
			App.fetchHints = mockFetchHints( null, latestGrid );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-04",
						gridText: gridWithoutNewlines(),
					}),
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			const {grid: storageGrid} = JSON.parse( mockStorage.getItem( "spellcheck" ) );
			assert.deepEqual( storageGrid, latestGrid );
		});

		it( "should write latest TLL to storage if fetched", async () =>
		{
			const latestGrid = {
				date: "2022-06-05",
			};
			const latestTLL = {
				counts: {},
				date: "2022-06-05",
			};
			App.fetchHints = mockFetchHints( null, latestGrid, latestTLL );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: Grid.getInstance({
						date: "2022-06-04",
						gridText: gridWithoutNewlines(),
					}),
					tll: {
						counts: TLL.parseText( tllWithoutNewlines() ).counts,
						date: "2022-06-04",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			const {tll: storageTLL} = JSON.parse( mockStorage.getItem( "spellcheck" ) );
			assert.deepEqual( storageTLL, latestTLL );
		});
	});
});

/**
 * @param {Function} callback
 * @param {Object} [grid]
 * @param {Object} [tll]
 * @return {Function}
 */
function mockFetchHints( callback, grid, tll )
{
	return () => {
		if( callback )
		{
			callback();
		}

		return {
			grid: grid || Grid.getInstance({
				date: "2022-06-05",
				gridText: gridWithoutNewlines(),
			}),
			tll: tll || new TLL({
				counts: TLL.parseText( tllWithoutNewlines() ).counts,
				date: "2022-06-05",
			}),
		}
	};
}
