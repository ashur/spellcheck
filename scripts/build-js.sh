SPELLCHECK_DEBUG=$DEBUG
SPELLCHECK_URL=$URL

if [ -n "$BRANCH" ]; then
	if [ $BRANCH != "main" ]; then
		SPELLCHECK_URL=$DEPLOY_PRIME_URL
	fi
elif [ -z "$URL" ]; then
	echo "💥 Missing URL\n"
	exit 1
fi

ESBUILD_MINIFY=""
if [ "$NODE_ENV" = "production" ]; then
	ESBUILD_MINIFY="--minify"
fi

echo "⚙️  Build settings..."
echo
echo "  ESBUILD_MINIFY=$ESBUILD_MINIFY"
echo "  SPELLCHECK_DEBUG=$SPELLCHECK_DEBUG"
echo "  SPELLCHECK_URL=$SPELLCHECK_URL"

echo
echo "☕️ Building script..."
npx esbuild src/scripts/init.mjs --bundle $ESBUILD_MINIFY --outfile=dist/init.js \
	--define:SPELLCHECK_DEBUG="\"$SPELLCHECK_DEBUG\"" \
	--define:SPELLCHECK_URL="\"$SPELLCHECK_URL\""
