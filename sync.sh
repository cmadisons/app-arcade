#!/bin/sh
# Copies the live files from ~ into this repo (they are edited in ~, where they run locally).
cd "$(dirname "$0")"
cp ~/app-arcade.html ~/square-recipe-app.html ~/recipe-app.html ~/ad-builder.html ~/video-studio.html ~/trick-maker.html ~/swear-jar.html .
mkdir -p square-recipe-ads && cp ~/square-recipe-ads/*.webm ~/square-recipe-ads/poster-*.jpg square-recipe-ads/
mkdir -p strike-zone && cp ~/strike-zone/index.html strike-zone/
cp ~/swear-jar.html swear-gray-jar.html
# Lights, Cards, Magic: the public copy hides the street address (user chose this 2026-10-09)
sed 's|<b>Where?</b><br>364 Green Acre Drive|<b>Where?</b><br>Email me to find out|' ~/lights-cards-magic.html > lights-cards-magic.html
if grep -q 'Green Acre' lights-cards-magic.html; then echo "ERROR: street address still in public lights-cards-magic.html"; rm lights-cards-magic.html; exit 1; fi
