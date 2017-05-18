#!/bin/bash
# 
# @file
# Copy distribution files to /dist
# 
# Allow time for all CodeKit to minify.
while [ ! -f "$7/LoftToggler.min.js" ]; do
  sleep 1
done

test -h "$7/dist" && rm "$7/dist"
test -d "$7/dist" || mkdir -p "$7/dist"

cp "$7/LoftToggler.js" "$7/dist/"
cp "$7/LoftToggler.min.js" "$7/dist/"
