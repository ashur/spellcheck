echo "☕️ Building script..."
npx esbuild src/scripts/init.mjs --bundle --outfile=dist/init.js

echo "☕️ Building minified script..."
npx esbuild src/scripts/init.mjs --bundle --minify --sourcemap --outfile=dist/init.min.js
