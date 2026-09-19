#!/bin/sh
# Copies the live files from ~ into this repo (they are edited in ~, where they run locally).
cd "$(dirname "$0")"
cp ~/app-arcade.html ~/square-recipe-app.html ~/recipe-app.html .
mkdir -p square-recipe-ads && cp ~/square-recipe-ads/*.webm ~/square-recipe-ads/poster-*.jpg square-recipe-ads/
mkdir -p strike-zone && cp ~/strike-zone/index.html strike-zone/
