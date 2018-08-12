#!/usr/bin/env sh

# Script takes a name from the clipboard, base64 encodes it and stores the result back on the clipbard

export IMG="$(pbpaste)"

node -e 'process.stdout.write(new Buffer(process.env.IMG).toString("base64"))' | pbcopy

echo "INPUT: $IMG"
echo "ENCODED: $(pbpaste)"