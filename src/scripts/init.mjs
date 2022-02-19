import App from "./app.mjs";
import UI from "./ui.mjs";

(async () =>
{
	if( !window.spellcheckApp )
	{
		try
		{
			UI.addStyles( SPELLCHECK_URL, SPELLCHECK_DEBUG === "true" );

			let hintsLink = document.querySelector( ".pz-toolbar-button__hints" )
				|| document.querySelector( ".pz-dropdown__menu-item[href]" )

			if( !hintsLink || !hintsLink.href )
			{
				window.spellcheckApp.showErrorModal( "Spell Check was unable to locate today’s grid.", `Could not locate "Today’s Hints" menu item` );
			}

			console.log( "⬇️ Spell Check: Fetching today’s grid" );
			let remoteGrid = await App.fetchGrid( hintsLink.href );

			window.spellcheckApp = new App({
				grid: remoteGrid
			});

			window.spellcheckApp.showGridModal();
		}
		catch( error )
		{
			console.log( error );

			App.showErrorModal( "Spell Check was unable to fetch today’s grid.", error.message );
		}
	}
	else
	{
		window.spellcheckApp.showGridModal();
	}

	if( !window.spellcheckUi )
	{
		window.spellcheckUi = UI;
	}
})();
