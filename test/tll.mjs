/* global describe, it */
import {assert} from "chai";
import TLL from "../build/tll.mjs";

export const tllWithNewlines = () => `CO-9
EF-3
FE-4 FI-7 FO-5
IN-5
NO-2
OF-2
TI-1 TO-1`;

export const tllWithoutNewlines = () => tllWithNewlines().replace(/\n/g, "");

describe( "TLL", () =>
{
	describe( ".counts", () =>
	{
		it( "should be set from constructor options", () =>
		{
			const {counts} = TLL.parseText( tllWithoutNewlines() );

			const tll = new TLL({
				counts,
				date: "2022-06-05",
			});

			assert.equal( tll.counts, counts );
		});

		it( "should throw Error if counts is undefined", () =>
		{
			const fn = () => new TLL({
				date: "2022-06-05"
			});
			assert.throws( fn, "Required property 'counts' is undefined" );
		});
	});

	describe( ".date", () =>
	{
		it( "should be set from constructor options", () =>
		{
			const date = "2022-06-05";
			const tll = new TLL({
				counts: TLL.parseText( tllWithoutNewlines() ).counts,
				date,
			});

			assert.equal( tll.date, date );
		});

		it( "should throw Error if date is undefined", () =>
		{
			const fn = () => new TLL({
				counts: TLL.parseText( tllWithoutNewlines() ).counts,
			});

			assert.throws( fn, "Required property 'date' is undefined" );
		});
	});

	describe( ".getInstance()", () =>
	{
		it( "should parse tllText if defined", () =>
		{
			const tll = TLL.getInstance({
				tllText: tllWithoutNewlines(),
				date: "2022-06-05",
			});

			assert.isObject( tll.counts );
			assert.hasAllKeys( tll.counts, [
				"CO",
				"EF",
				"FE", "FI", "FO",
				"IN",
				"NO",
				"OF",
				"TI", "TO",
			]);
		});

		it( "should use counts value if tllText is undefined", () =>
		{
			const tll = TLL.getInstance({
				counts: TLL.parseText( tllWithoutNewlines() ).counts,
				date: "2022-06-05",
			});

			assert.isObject( tll.counts );
			assert.hasAllKeys( tll.counts, [
				"CO",
				"EF",
				"FE", "FI", "FO",
				"IN",
				"NO",
				"OF",
				"TI", "TO",
			]);
		});
	});

	describe( ".parseText()", () =>
	{
		it( "should contain two-letter pairs and counts", () =>
		{
			const {counts} = TLL.parseText( tllWithNewlines() );

			assert.deepEqual( counts, {
				"CO": 9,
				"EF": 3,
				"FE": 4, "FI": 7, "FO": 5,
				"IN": 5,
				"NO": 2,
				"OF": 2,
				"TI": 1, "TO": 1,
			});
		});

		it( "should return empty object if tllText doesn't match expected format", () =>
		{
			const invalidTllValues = [
				"invalid tll format",
				undefined,
			];

			invalidTllValues.forEach( (value) =>
			{
				const {counts} = TLL.parseText( value );
				assert.deepEqual( counts, {}, `value: ${value}` );
			});
		});

		it( "should support a format without newlines", () =>
		{
			const {counts} = TLL.parseText( tllWithoutNewlines() );

			assert.deepEqual( counts, {
				"CO": 9,
				"EF": 3,
				"FE": 4, "FI": 7, "FO": 5,
				"IN": 5,
				"NO": 2,
				"OF": 2,
				"TI": 1, "TO": 1,
			});
		});
	});

	describe( ".remaining()", () =>
	{
		it( "should return TLL totals less the counts for any matching words", () =>
		{
			const words = [
				"color",
				"coffee",
				"timid",
			];

			const tll = new TLL({
				counts: TLL.parseText( tllWithoutNewlines() ).counts,
				date: "2022-06-05",
			});

			const result = tll.remaining( words );

			assert.deepEqual( result, [
				[{"CO": 7}],
				[{"EF": 3}],
				[{"FE": 4}, {"FI": 7}, {"FO": 5}],
				[{"IN": 5}],
				[{"NO": 2}],
				[{"OF": 2}],
				[{"TI": 0}, {"TO": 1}],
			] );
		});
	});
});
