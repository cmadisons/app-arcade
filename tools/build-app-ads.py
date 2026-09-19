#!/usr/bin/env python3
"""Builds app-ads.js from tools/app-ads.template.js.

The Ship Life and Zelda ad scenes are copied from ~/square-recipe-app.html so there is
only one copy of them. Their CSS animation classes are renamed with an aa- prefix so
they can't clash with the styles of the app the ad is shown on.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
square = open(os.path.expanduser('~/square-recipe-app.html'), encoding='utf-8').read()
start = square.index('// ===== Zelda ad pictures')
end = square.index('// ===== Ads: 3-minute timer')
scenes = square[start:end]

for c in ['glow', 'bob', 'flash', 'spin', 'rain']:
    scenes = scenes.replace('class="%s"' % c, 'class="aa-%s"' % c)
scenes = scenes.replace("'rain')", "'aa-rain')")
scenes = scenes.replace('id="sky"', 'id="aa-sky"').replace('url(#sky)', 'url(#aa-sky)')
scenes = '\n'.join('  ' + line if line else line for line in scenes.rstrip().split('\n'))

tpl = open(os.path.join(HERE, 'app-ads.template.js'), encoding='utf-8').read()
assert '/*SCENES*/' in tpl
out = tpl.replace('/*SCENES*/', scenes)
open(os.path.join(REPO, 'app-ads.js'), 'w', encoding='utf-8').write(out)
print('app-ads.js', len(out), 'bytes')
