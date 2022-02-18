echo "⚙️  Build settings..."
echo
echo "  DEBUG=$DEBUG"
echo "  URL=$URL"

echo
echo "☕️ Building script..."
npx esbuild src/scripts/init.mjs --bundle --outfile=dist/init.js --define:SPELLCHECK_URL="\"$URL\"" --define:SPELLCHECK_DEBUG="\"$DEBUG\""

echo
echo "☕️ Building minified script..."
npx esbuild src/scripts/init.mjs --bundle --minify --sourcemap --outfile=dist/init.min.js
