import "./spellcheck.css";

let handleKeydown = (event) =>
{
	if( event.key === "Escape" )
	{
		hideModal();
	}
};

let hideModal = () =>
{
	document.querySelector( ".sb-modal-system" ).classList.remove( "sb-modal-open", "spellcheck" );
	document.querySelector( ".sb-modal-wrapper" ).innerHTML = "";

	document.removeEventListener( "keydown", handleKeydown );
};

let UI = {
	/**
	 * @param {string} url
	 * @param {boolean} debug
	 */
	addStyles: (url, debug) =>
	{
		let stylesheetUrl = url + "/init.min.css";
		if( debug ) {
			stylesheetUrl += `?${Date.now()}`;
		}

		let stylesheet = document.createElement( "link" );
		stylesheet.rel = "stylesheet";
		stylesheet.type = "text/css";
		stylesheet.href = stylesheetUrl;

		console.log( "🎨 Spell Check: Adding styles" );
		document.head.appendChild( stylesheet );
	},

	showModal: ({title, subtitle, body} = {}) =>
	{
		if( !document.querySelector( "#js-hook-pz-moment__game.on-stage" ) )
		{
			console.log( "🙈 Spell Check: Puzzle is not currently visible" );
			return;
		}

		let modalHeader = `<h3 class="sb-modal-title spellcheck__heading">${title}</h3>`;
		if( subtitle )
		{
			modalHeader += `<h4 class="sb-modal-subtitle spellcheck__subheading">${subtitle}</h4>`;
		}

		let modalWrapper = `<div role="button" class="sb-modal-frame help">
			<div class="sb-modal-top">
				<div role="button" class="sb-modal-close">×</div>
			</div>

			<div class="sb-modal-content">
				<div class="sb-modal-header">
					${modalHeader}
				</div>
				<div class="sb-modal-body">
					${body}

					<p class="sb-modal-message spellcheck__reminder">Just a reminder, <a class="spellcheck__link" href="https://spellcheck.fun">Spell Check</a> isn’t affiliated with or endorsed by the <span style="white-space: nowrap">New York Times</span>.</p>
				</div>
			</div>
		</div>`

		document.querySelector( ".sb-modal-system" ).classList.add( "sb-modal-open", "spellcheck" );
		document.querySelector( ".sb-modal-wrapper" ).innerHTML = modalWrapper;
		document.querySelector( ".sb-modal-close" ).addEventListener( "click", hideModal );

		document.addEventListener( "keydown", handleKeydown );
	},
}

export default UI;
