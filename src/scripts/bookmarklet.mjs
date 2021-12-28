import App from "./app.mjs";
import UI from "./ui.mjs";

(async () =>
{
	if( !window.spellcheck )
	{
		let gridStatic = `		  4	  5	  6	  7	  8	  9	  Σ
A:	  3	  4	  2	  1	  -	  -	 10
G:	  4	  3	  2	  2	  -	  -	 11
L:	  3	  1	  -	  -	  1	  -	  5
M:    7	  8	  3	  -	  -	  1	 19
R:	  2	  1	  -	  -	  -	  -	  3
Σ:	 19	 17	  7	  3	  1	  1	 48`;

		try
		{
			UI.addStyles();

			let hintsLink = document.querySelector( ".pz-toolbar-button__hints" )
				|| document.querySelector( ".pz-dropdown__menu-item[href]" )

			if( !hintsLink || !hintsLink.href )
			{
				window.spellcheckApp.showErrorModal( "Spell Check was unable to locate today’s grid.", `Could not locate "Today’s Hints" menu item` );
			}

			let grid = await App.fetchGrid( hintsLink.href );

			window.spellcheckApp = new App({
				grid: grid
			});
		}
		catch( error )
		{
			console.log( error );

			App.showErrorModal( "Spell Check was unable to fetch today’s grid.", error.message );
		}
	}

	if( !window.spellcheckUi )
	{
		window.spellcheckUi = UI;
	}

	window.spellcheckApp.showGridModal();
})();
