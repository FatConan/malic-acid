npx esbuild --bundle src/index.js --format=esm --outdir=dist --external:jquery --external:underscore --external:jquery-ui --minify --sourcemap
npx webpack