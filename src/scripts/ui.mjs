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
		let styles = `
		.spellcheck .sb-modal-table td,
		.spellcheck .sb-modal-table th {
			text-align: center;
			height: 2em;
			vertical-align: middle;
		}
		.spellcheck .sb-modal-table tr + tr {
			border-top: solid #dcdcdc 1px;
		}
		.spellcheck .sb-modal-table th {
			font-weight: bold;
			min-width: 2em;
		}
		.spellcheck .sb-modal-table td {
			font-size: 1.125em;
		}
		.spellcheck .sb-modal-table td .checked {
			border: solid #009340;
			border-width: 0 3px 3px 0;
			display: inline-block;
			height: 17px;
			margin-top: 10px;
			transform: rotate(45deg) translate(-3px, -3px);
			width: 8.5px;
		}
		.spellcheck.sb-modal-wrapper a {
			color: #2860d8;
			text-decoration: underline;
		}
		.spellcheck .sb-modal-content .sb-modal-body .sb-modal-message.sc-modal-reminder {
			border: 1px solid #dcdcdc;
			border-radius: 6px;
			font-size: 0.875em;
			margin-top: 3em;
			padding: 1em;
		}
		.spellcheck .sb-modal-wrapper details {
			font-size: 0.875em;
		}
		.spellcheck .sc-details {
			font-family: monospace;
		}
		`;

		let stylesheet = document.createElement( "style" );
		stylesheet.type = "text/css"
		stylesheet.innerText = styles;

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

		let modalHeader = `<h3 class="sb-modal-title">${title}</h3>`;
		if( subtitle )
		{
			modalHeader += `<h4 class="sb-modal-subtitle">${subtitle}</h4>`;
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

					<p class="sb-modal-message sc-modal-reminder">Just a reminder, Spell Check isn’t affiliated with or endorsed by the <span style="white-space: nowrap">New York Times</span>. <a href="https://spellcheck.fun">More info</a></p>
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
