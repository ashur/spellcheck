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
				height: 2em;
				vertical-align: middle;
			}
			.sb-modal-table tr + tr {
				border-top: solid #dcdcdc 1px;
			}
			.sb-modal-table th {
				font-weight: bold;
				min-width: 2em;
			}
			.sb-modal-table td {
				font-size: 1.125em;
			}
			.sb-modal-table td .checked {
				border: solid #00ae4c;
				border-width: 0 3px 3px 0;
				display: inline-block;
				height: 17px;
				margin-top: 10px;
				transform: rotate(45deg) translate(-3px, -3px);
				width: 8.5px;
			}
			.sb-modal-wrapper--inverted .sb-input-bright {
				filter: invert(1);
				font-weight: bold;
			}
			.sb-modal-wrapper a {
				color: #2860d8;
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

					<p class="sb-modal-message sc-modal-reminder">Just a reminder, Spell Check isn’t affiliated with or endorsed by the <span style="white-space: nowrap">New York Times</span>. <a href="#">More info</a></p>
				</div>
			</div>
		</div>`

		document.querySelector( ".sb-modal-system" ).classList.add( "sb-modal-open" );
		// document.querySelector( ".sb-modal-wrapper" ).classList.add( "sb-modal-wrapper--inverted" );
		document.querySelector( ".sb-modal-wrapper" ).innerHTML = modalWrapper;
		document.querySelector( ".sb-modal-close" ).addEventListener( "click", hideModal );

		document.addEventListener( "keydown", handleKeydown );
	},
}

export default UI;
