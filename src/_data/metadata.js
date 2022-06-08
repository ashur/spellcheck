let url = process.env.URL;
if( process.env.BRANCH && process.env.BRANCH !== 'main' )
{
	// Use branch deploy URL if we're not on `main`
	url = process.env.DEPLOY_PRIME_URL;
}

module.exports = {
	env: {
		url: url || "http://localhost:8080",
	},
	site: {
		title: "Spell Check",
		description: "Check your Spelling Bee progress without leaving the puzzle",
	},
}
