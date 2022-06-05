/* global describe, it */
import {assert} from "chai";
import App, {APP_VERSION} from "../build/app.mjs";
import {MockLocalStorage} from "./storage.mjs";

const hintsUrl = "https://www.nytimes.com/2022/06/05/crosswords/spelling-bee-forum.html";

describe( "App", () =>
{
	describe( ".getInstance()", () =>
	{
		it( "should return an instance of App", async () =>
		{
			App.fetchHints = mockFetchHints();
			const mockStorage = MockLocalStorage();

			const app = await App.getInstance( hintsUrl, mockStorage );
			assert.instanceOf( app, App );
		});

		it( "should not fetch hints if app version and grid date match storage", async () =>
		{
			let didFetch = false;
			const callback = () => {
				didFetch = true;
			};

			App.fetchHints = mockFetchHints( callback );

			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "spellcheck", JSON.stringify(
				{
					grid: {
						date: "2022-06-05",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			assert.isFalse( didFetch );
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
					grid: {
						date: "2022-06-05",
					},
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
					grid: {
						date: "2022-06-04",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			assert.isTrue( didFetch );
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
					grid: {
						date: "2022-06-04",
					},
					version: APP_VERSION,
				}
			));

			const app = await App.getInstance( hintsUrl, mockStorage );

			const {grid: storageGrid} = JSON.parse( mockStorage.getItem( "spellcheck" ) );
			assert.deepEqual( storageGrid, latestGrid );
		});
	});
});

/**
 * @param {Function} callback
 * @param {Object} [grid]
 * @return {Function}
 */
function mockFetchHints( callback, grid = {} )
{
	return () => {
		if( callback )
		{
			callback();
		}

		return {
			grid: grid,
		}
	};
}
