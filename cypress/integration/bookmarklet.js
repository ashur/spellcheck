/* global cy, describe, it */
const bookmarkletContent = require( "../../src/_data/bookmarkletContent" );

describe( "Android bookmarklet", () =>
{
	it( "should use bookmarkletContent as its value", () => {
		cy.visit( "http://localhost:8080/android" );

		cy.get( "input.install__bookmarklet" )
		  .invoke( "attr", "value" )
		  .should( "eq", bookmarkletContent );
	});
});

describe( "Desktop bookmarklet", () =>
{
	it( "should use bookmarkletContent as its href", () => {
		cy.visit( "http://localhost:8080/" );

		cy.get( "#install-desktop a.install__bookmarklet-desktop" )
		  .invoke( "attr", "href" )
		  .should( "eq", bookmarkletContent );
	});
});

describe( "iOS bookmarklet", () =>
{
	it( "should use bookmarkletContent as its value", () => {
		cy.visit( "http://localhost:8080/ios" );

		cy.get( "input.install__bookmarklet" )
		  .invoke( "attr", "value" )
		  .should( "eq", bookmarkletContent );
	});
});
