/* global describe, it */
import {assert} from "chai";
import Storage from "../build/storage.mjs";

describe( "Storage", () =>
{
	describe( ".getItem()", () =>
	{
		it( "should get item from scoped storage item 'spellcheck'", () =>
		{
			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "red", "apple" );

			const storage = new Storage( mockStorage );
			storage.setItem( "green", "grape" );

			const {green, red} = JSON.parse( mockStorage.data.spellcheck );

			assert.isUndefined( storage.getItem( "red" ) );
			assert.equal( "grape", storage.getItem( "green" ) );
		});
	});

	describe( ".getUnscopedData()", () =>
	{
		it( "should return JSON-parsed value from unscoped data", () =>
		{
			const unscopedData = { words: ["hello"] };
			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "sb-today", JSON.stringify( unscopedData ) );

			const storage = new Storage( mockStorage );

			assert.deepEqual( unscopedData, storage.getUnscopedData( "sb-today" ) );
		});

		it( "should return original value if it cannot be parsed from JSON", () =>
		{
			const unscopedData = "hello";
			const mockStorage = MockLocalStorage();
			mockStorage.setItem( "sb-today", JSON.stringify( unscopedData ) );

			const storage = new Storage( mockStorage );

			assert.deepEqual( unscopedData, storage.getUnscopedData( "sb-today" ) );
		});
	});

	describe( ".removeAllItems()", () =>
	{
		it( "should remove all items from scoped storage", () =>
		{
			const mockStorage = MockLocalStorage();
			const storage = new Storage( mockStorage );

			storage.setItem( "red", "strawberry" );
			storage.setItem( "green", "grape" );

			assert.equal( "strawberry", storage.getItem( "red" ) );
			assert.equal( "grape", storage.getItem( "green" ) );

			storage.removeAllItems();

			assert.isUndefined( storage.getItem( "red" ) );
			assert.isUndefined( storage.getItem( "green" ) );
		});
	});

	describe( ".removeItem()", () =>
	{
		it( "should remove item from scoped storage item 'spellcheck'", () =>
		{
			const mockStorage = MockLocalStorage();
			const storage = new Storage( mockStorage );

			storage.setItem( "red", "strawberry" );
			assert.equal( "strawberry", storage.getItem( "red" ) );

			storage.removeItem( "red" );
			assert.isUndefined( storage.getItem( "red" ) );
		});
	});

	describe( ".setItem()", () =>
	{
		it( "should set item as property of a scoped storage item 'spellcheck'", () =>
		{
			const mockStorage = MockLocalStorage();
			const storage = new Storage( mockStorage );


			assert.isUndefined( mockStorage.data.spellcheck );
			storage.setItem( "red", "apple" );

			const {red} = JSON.parse( mockStorage.data.spellcheck );

			assert.equal( red, "apple" );
		});

		it( "should preserve other existing items", () =>
		{
			const mockStorage = MockLocalStorage();
			const storage = new Storage( mockStorage );

			storage.setItem( "red", "apple" );
			storage.setItem( "green", "grape" );

			const {green, red} = JSON.parse( mockStorage.data.spellcheck );

			assert.equal( red, "apple" );
			assert.equal( green, "grape" );
		});
	});
});

const MockLocalStorage = () => ({

	data: {},

	getItem( key )
	{
		return this.data[key];
	},

	removeItem( key )
	{
		delete this.data[key];
	},

	setItem( key, value )
	{
		this.data[key] = value.toString();
	},
});
