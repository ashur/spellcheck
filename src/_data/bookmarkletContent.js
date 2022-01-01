const metadata = require( "./metadata" );

let url = metadata.env.url;
let bookmarklet = `javascript:void%20function(){var%20url=%22${url}/init.js%22;document.querySelector(%22script[src='%22+url+%22']%22)%3FspellcheckApp.showGridModal():(script=document.createElement(%22script%22),script.src=url,document.querySelector(%22head%22).appendChild(script))}();`

module.exports = bookmarklet;
