#!/bin/bash
# 
# @file
# Copy distribution files to /dist
# 
test -d "$7/dist" || mkdir -p "$7/dist"
cp "$7/LoftToggler.js" "$7/dist/"
cp "$7/LoftToggler.min.js" "$7/dist/"
