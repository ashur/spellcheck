SPELLCHECK_URL=$DEPLOY_PRIME_URL

echo "⚙️  Build settings..."
echo
echo "  DEBUG=$DEBUG"
echo "  SPELLCHECK_URL=$SPELLCHECK_URL"

echo
echo "☕️ Building script..."
npx esbuild src/scripts/init.mjs --bundle --outfile=dist/init.js --define:SPELLCHECK_URL="\"$SPELLCHECK_URL\"" --define:SPELLCHECK_DEBUG="\"$DEBUG\""

echo
echo "☕️ Building minified script..."
npx esbuild src/scripts/init.mjs --bundle --minify --sourcemap --outfile=dist/init.min.js --define:SPELLCHECK_URL="\"$SPELLCHECK_URL\"" --define:SPELLCHECK_DEBUG="\"$DEBUG\""
