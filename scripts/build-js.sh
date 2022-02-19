SPELLCHECK_DEBUG=$DEBUG

if [ -n "$BRANCH" ]; then
	if [ $BRANCH != "main" ]; then
		SPELLCHECK_URL=$DEPLOY_PRIME_URL
	else
		SPELLCHECK_URL=$URL
	fi
elif [ -n "$DEV_URL" ]; then
	SPELLCHECK_URL=$DEV_URL
else
	echo "💥 Missing URL\n"
	exit 1
fi

echo "⚙️  Build settings..."
echo
echo "  SPELLCHECK_DEBUG=$SPELLCHECK_DEBUG"
echo "  SPELLCHECK_URL=$SPELLCHECK_URL"

echo
echo "☕️ Building script..."
npx esbuild src/scripts/init.mjs --bundle --outfile=dist/init.js \
	--define:SPELLCHECK_DEBUG="\"$SPELLCHECK_DEBUG\"" \
	--define:SPELLCHECK_URL="\"$SPELLCHECK_URL\""

echo
echo "☕️ Building minified script..."
npx esbuild src/scripts/init.mjs --bundle --minify --sourcemap --outfile=dist/init.min.js \
	--define:SPELLCHECK_DEBUG="\"$SPELLCHECK_DEBUG\"" \
	--define:SPELLCHECK_URL="\"$SPELLCHECK_URL\""
