let handleKeydown = (event) =>
{
	if( event.key === "Escape" )
	{
		hideModal();
	}
};

let hideModal = () =>
{
	document.querySelector( ".sb-modal-system" ).classList.remove( "sb-modal-open" );
	document.querySelector( ".sb-modal-wrapper" ).classList.remove( "sb-modal-wrapper--inverted" );
	document.querySelector( ".sb-modal-wrapper" ).innerHTML = "";

	document.removeEventListener( "keydown", handleKeydown );
};

let UI = {
	addStyles: () =>
	{
		let styles = `
			.sb-modal-wrapper--inverted {
				filter: invert(1);
			}
			.sb-modal-table td, .sb-modal-table th {
				text-align: center;
			}
			.sb-modal-table th {
				font-weight: bold;
				min-width: 2em;
			}
			.sb-modal-wrapper--inverted .sb-input-bright {
				filter: invert(1);
				font-weight: bold;
			}
			.sb-modal-wrapper--inverted a {
				color: inherit;
				text-decoration: underline;
			}

			.sb-modal-content .sb-modal-body .sb-modal-message.sc-modal-reminder {
				font-size: 0.875em;
				margin-top: 3em;
			}`;

		let stylesheet = document.createElement( "style" );
		stylesheet.type = "text/css"
		stylesheet.innerText = styles;

		console.log( "🎨 Adding styles" );
		document.head.appendChild( stylesheet );
	},

	showModal: ({title, subtitle, body} = {}) =>
	{
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

					<p class="sb-modal-message sc-modal-reminder">Just a reminder, Spell Check isn’t affiliated with or endorsed by the New York Times.</p>
				</div>
			</div>
		</div>`

		document.querySelector( ".sb-modal-system" ).classList.add( "sb-modal-open" );
		document.querySelector( ".sb-modal-wrapper" ).classList.add( "sb-modal-wrapper--inverted" );
		document.querySelector( ".sb-modal-wrapper" ).innerHTML = modalWrapper;
		document.querySelector( ".sb-modal-close" ).addEventListener( "click", hideModal );

		document.addEventListener( "keydown", handleKeydown );
	},
}

export default UI;
