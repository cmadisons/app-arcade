/* App Arcade ads — one file that puts the ads and the big clock on every arcade app.
   Each app loads it with one line (data-app = its id, so it never shows its own ad):
     <script src="https://cmadisons.github.io/app-arcade/app-ads.js" data-app="baseball" defer></script>
   BUILT FILE: edit tools/app-ads.template.js, then run tools/build-app-ads.py
   (the Ship Life / Zelda scenes are copied in from square-recipe-app.html). */
(function(){
  if (window.__appArcadeAds) return; window.__appArcadeAds = true;
  var me = document.currentScript, APP = (me && me.getAttribute('data-app')) || '';
  var BASE = 'https://cmadisons.github.io/app-arcade/';
  var LOCAL = location.protocol === 'file:';
  var ARCADE = LOCAL ? 'file:///Users/themadison/app-arcade.html' : BASE + 'app-arcade.html';
  var V = BASE + 'square-recipe-ads/';

  // same plans as the Square Recipe Box: ⭐ Upgrade = an ad every 5 minutes, 💎 Premium = no ads
  function until(k){ try { return +localStorage.getItem('squarebox:' + k) || 0; } catch(e){ return 0; } }
  function premium(){ return until('premiumUntil') > Date.now(); }
  function upgraded(){ return until('upgradeUntil') > Date.now(); }
  function adEvery(){ return (upgraded() ? 5 : 3) * 60 * 1000; }
  // Same reset switch as the Square Recipe Box (bump both together).
  var STORE_RESET = 1;
  try { if (+localStorage.getItem('squarebox:storeReset') !== STORE_RESET) {
    localStorage.removeItem('squarebox:upgradeUntil'); localStorage.removeItem('squarebox:premiumUntil');
    localStorage.setItem('squarebox:storeReset', String(STORE_RESET)); } } catch(e){}
  // To charge REAL money, paste the same Stripe Payment Links as in square-recipe-app.html.
  // Each link's "after payment" URL should be the Square Recipe Box with ?paid=month|year|pmonth|pyear.
  var PAY = { month: '', year: '', pmonth: '', pyear: '' };
  var PLANS = { month: { key: 'upgradeUntil', days: 31 }, year: { key: 'upgradeUntil', days: 366 },
                pmonth: { key: 'premiumUntil', days: 31 }, pyear: { key: 'premiumUntil', days: 366 } };
  var AD_FIRST = 30 * 1000, AD_MIN = 45, AD_MAX = 60;

  // ===== Zelda ad pictures (drawn in code, 200 x 120) =====
  function sky(a, b){ return '<defs><linearGradient id="aa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="200" height="120" fill="url(#aa-sky)"/>'; }
  function svg(inner){ return '<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>'; }
  function link(x, y, s, sword){
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-4 0 L-3 -10 L-1 -10 L-1 0 Z M1 0 L1 -10 L3 -10 L4 0 Z" fill="#5a3a1a"/>' +
      '<path d="M-6 -10 L-5 -22 L5 -22 L6 -10 Z" fill="' + (sword === false ? '#d9c9a8' : '#2f6fd0') + '"/>' +
      '<circle cx="0" cy="-26" r="4.5" fill="#f2c9a0"/>' +
      '<path d="M-5 -26 Q0 -34 5 -26 L5 -24 Q0 -29 -5 -24 Z M4 -27 L9 -24 L4 -24 Z" fill="#e8c44a"/>' +
      (sword === false ? '' :
      '<line x1="5" y1="-18" x2="15" y2="-35" stroke="#dfeeff" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="3" y1="-16" x2="7" y2="-20" stroke="#4a2f7a" stroke-width="2.4"/>' +
      '<path d="M-10 -21 L-5 -21 L-5 -12 L-7.5 -9 L-10 -12 Z" fill="#8a5a2a" stroke="#4a3010" stroke-width=".6"/>') +
      '</g>';
  }
  // a Blight Ganon: [color, weapon]
  function blight(x, y, s, c, weapon){
    var w = {
      water: '<line x1="10" y1="-30" x2="34" y2="-58" stroke="#8fd6ff" stroke-width="2.2"/><path d="M31 -62 L36 -56 L38 -64 Z M36 -56 L40 -58 L38 -64" fill="#8fd6ff"/>',
      fire: '<path d="M10 -30 L42 -62 L46 -58 L14 -26 Z" fill="#ff8a2a" stroke="#ffd08a" stroke-width=".8"/><line x1="8" y1="-24" x2="16" y2="-32" stroke="#3a1a0a" stroke-width="3"/>',
      wind: '<rect x="8" y="-34" width="26" height="9" fill="#3a4a5a" stroke="' + c + '" stroke-width="1.2"/><circle cx="34" cy="-29.5" r="3.5" fill="' + c + '" class="aa-glow"/>',
      thunder: '<path d="M10 -30 Q30 -48 26 -64 Q36 -46 14 -26 Z" fill="#fff2a0" stroke="#ffd400" stroke-width=".8"/><circle cx="-16" cy="-26" r="8" fill="#3a3010" stroke="' + c + '" stroke-width="1.5"/>'
    }[weapon];
    return '<g class="aa-bob"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-7 0 L-5 -14 M7 0 L5 -14" stroke="#1a1020" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M-13 -12 L-10 -34 Q0 -46 10 -34 L13 -12 Z" fill="#1a1020" stroke="' + c + '" stroke-width="1.4"/>' +
      '<path d="M-8 -30 Q0 -24 8 -30 M-9 -20 Q0 -14 9 -20" stroke="' + c + '" stroke-width="1.2" fill="none" class="aa-glow"/>' +
      '<path d="M-10 -32 L-18 -18" stroke="#1a1020" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M10 -32 L12 -28" stroke="#1a1020" stroke-width="3.5" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-44" r="7" fill="#2a1a30" stroke="' + c + '" stroke-width="1.2"/>' +
      '<circle cx="0" cy="-44" r="3" fill="' + c + '" class="aa-glow"/>' + w +
      '</g></g>';
  }
  function drops(n, color, x0, x1, y0, y1, len, cls){
    var o = '<g class="' + (cls || '') + '" stroke="' + color + '" stroke-width="1" opacity=".55">';
    for (var k = 0; k < n; k++) {
      var x = x0 + ((k * 37) % (x1 - x0)), y = y0 + ((k * 53) % (y1 - y0));
      o += '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 2) + '" y2="' + (y + len) + '"/>';
    }
    return o + '</g>';
  }
  var STONE = '#8f887c', MAL = '#ff3b6b';
  var FIGHT = '<small>What the fight could look like</small>';
  var ZELDA = [
    { cap: 'Wake up in the Shrine of Resurrection', svg: svg(sky('#050a14', '#10233a') +
      '<path d="M0 0 H200 V120 H0 Z M22 120 V55 Q100 -12 178 55 V120 Z" fill="#1b2433" fill-rule="evenodd"/>' +
      '<path d="M84 18 L66 92 H134 L116 18 Z" fill="#4dd6ff" opacity=".1"/>' +
      '<g fill="#ff9a3c" class="aa-glow"><circle cx="40" cy="66" r="2.5"/><circle cx="160" cy="66" r="2.5"/><circle cx="62" cy="36" r="2.5"/><circle cx="138" cy="36" r="2.5"/></g>' +
      '<g class="aa-glow" stroke="#4dd6ff" stroke-width="1.5" fill="none"><ellipse cx="100" cy="44" rx="13" ry="7"/><path d="M100 53 V62 M90 34 L93 38 M110 34 L107 38 M100 31 V36"/><circle cx="100" cy="44" r="3" fill="#4dd6ff"/></g>' +
      '<rect x="48" y="97" width="104" height="10" fill="#2a3446"/>' +
      '<rect x="54" y="90" width="92" height="8" fill="#4dd6ff" opacity=".45" class="aa-glow"/>' +
      '<g class="aa-bob">' + link(100, 96, 1.15, false) + '</g>') },

    { cap: 'Divine Beast Vah Ruta', svg: svg(sky('#4f6f96', '#a8c4dc') + drops(40, '#eef6ff', 0, 200, 0, 90, 6, 'aa-rain') +
      '<rect y="92" width="200" height="28" fill="#2f6f9a"/><path d="M0 95 Q10 92 20 95 T40 95 T60 95 T80 95 T100 95 T120 95 T140 95 T160 95 T180 95 T200 95" stroke="#8fd0f0" fill="none"/>' +
      '<g fill="' + STONE + '"><rect x="68" y="70" width="10" height="26"/><rect x="84" y="72" width="10" height="24"/><rect x="110" y="72" width="10" height="24"/><rect x="126" y="70" width="10" height="26"/>' +
      '<ellipse cx="100" cy="62" rx="46" ry="21"/><circle cx="146" cy="50" r="16"/><path d="M130 40 Q118 44 124 64 L136 58 Z" fill="#7a746a"/>' +
      '<path d="M158 56 Q172 50 170 30 Q169 22 176 18 L180 22 Q175 26 176 32 Q178 54 162 64 Z"/></g>' +
      '<g stroke="' + MAL + '" stroke-width="1.3" fill="none" class="aa-glow"><path d="M62 58 H96 L104 50 H132 M70 68 H128"/><circle cx="150" cy="47" r="3" fill="' + MAL + '"/></g>' +
      '<g stroke="#bfe8ff" stroke-width="2" fill="none" class="aa-glow"><path d="M178 18 Q188 6 196 14 M178 18 Q182 4 170 2"/></g>' +
      '<path d="M90 42 L94 30 L106 30 L110 42" fill="#6f695f"/>') },

    { cap: FIGHT + 'Waterblight Ganon', svg: svg(sky('#07121e', '#123a55') +
      '<rect y="96" width="200" height="24" fill="#0c2233"/><path d="M0 96 H200" stroke="#4dd6ff" stroke-width=".8" opacity=".5"/>' +
      '<g fill="#bfeaff" opacity=".85" stroke="#fff" stroke-width=".6"><rect x="84" y="80" width="14" height="14" transform="rotate(10 91 87)"/><rect x="168" y="62" width="12" height="12" transform="rotate(-15 174 68)"/><rect x="100" y="30" width="10" height="10" class="aa-bob"/></g>' +
      drops(20, '#8fd6ff', 0, 200, 0, 60, 5, 'aa-rain') +
      link(50, 98, 1.3) + blight(140, 98, 1.35, '#4dd6ff', 'water')) },

    { cap: 'Divine Beast Vah Rudania', svg: svg(sky('#2a0806', '#b0401a') +
      '<path d="M0 120 L50 50 L75 62 L120 18 L200 88 V120 Z" fill="#3b2a24"/>' +
      '<path d="M120 18 L112 50 L118 70 L108 120 M120 18 L130 60 L126 120" stroke="#ff7a1a" stroke-width="3" fill="none" class="aa-glow"/>' +
      '<g class="aa-bob" opacity=".5" fill="#6a5a5a"><circle cx="118" cy="12" r="6"/><circle cx="126" cy="6" r="5"/><circle cx="112" cy="5" r="4"/></g>' +
      '<g transform="rotate(-28 95 62)"><g fill="' + STONE + '">' +
      '<ellipse cx="95" cy="62" rx="34" ry="10"/><ellipse cx="134" cy="60" rx="10" ry="7"/><path d="M62 62 Q40 60 26 72 Q44 66 62 68 Z"/>' +
      '<path d="M76 70 L70 80 M88 71 L86 82 M104 71 L106 82 M116 70 L122 80" stroke="' + STONE + '" stroke-width="5"/>' +
      '<path d="M72 54 L76 44 L80 54 M86 53 L90 42 L94 53 M100 53 L104 42 L108 53 M114 54 L118 45 L122 55"/></g>' +
      '<g stroke="' + MAL + '" stroke-width="1.2" fill="none" class="aa-glow"><path d="M68 62 H122"/><circle cx="138" cy="58" r="2.2" fill="' + MAL + '"/></g></g>') },

    { cap: FIGHT + 'Fireblight Ganon', svg: svg(sky('#140303', '#5a1a0a') +
      '<rect y="96" width="200" height="24" fill="#2a0c06"/><path d="M0 96 H200" stroke="#ff7a1a" stroke-width=".8" opacity=".6"/>' +
      '<g class="aa-glow"><circle cx="92" cy="40" r="7" fill="#ff8a2a"/><circle cx="92" cy="40" r="3.5" fill="#ffe08a"/><circle cx="178" cy="26" r="5" fill="#ff8a2a"/><circle cx="178" cy="26" r="2.5" fill="#ffe08a"/></g>' +
      '<path d="M20 96 Q24 86 28 96 Q31 88 34 96 M160 96 Q164 84 168 96 Q171 88 174 96" fill="#ff7a1a" class="aa-glow"/>' +
      link(50, 98, 1.3) + blight(140, 98, 1.35, '#ff7a1a', 'fire')) },

    { cap: 'Divine Beast Vah Medoh', svg: svg(sky('#3f86d2', '#cfe6ff') +
      '<g fill="#fff" opacity=".9"><ellipse cx="30" cy="96" rx="34" ry="9"/><ellipse cx="170" cy="100" rx="40" ry="10"/><ellipse cx="160" cy="24" rx="18" ry="5"/></g>' +
      '<g class="aa-bob"><g fill="' + STONE + '">' +
      '<path d="M86 52 L20 30 L28 40 L16 44 L30 50 L22 58 L84 62 Z"/><path d="M114 52 L180 30 L172 40 L184 44 L170 50 L178 58 L116 62 Z"/>' +
      '<ellipse cx="100" cy="57" rx="18" ry="11"/><circle cx="100" cy="42" r="8"/><path d="M96 44 L100 54 L104 44 Z" fill="#6f695f"/>' +
      '<path d="M92 66 L86 82 L100 74 L114 82 L108 66 Z"/></g>' +
      '<g stroke="' + MAL + '" stroke-width="1.2" fill="none" class="aa-glow"><path d="M36 40 L84 54 M164 40 L116 54 M90 58 H110"/><circle cx="100" cy="41" r="2.4" fill="' + MAL + '"/></g></g>') },

    { cap: FIGHT + 'Windblight Ganon', svg: svg(sky('#0e1826', '#2d4460') +
      '<rect y="96" width="200" height="24" fill="#18222e"/><path d="M0 96 H200" stroke="#9fe3c8" stroke-width=".8" opacity=".5"/>' +
      '<g stroke="#9fe3c8" stroke-width="1.4" fill="none" opacity=".75"><path class="aa-spin" d="M84 60 m-10 0 a10 4 0 1 0 20 0 a8 3 0 1 0 -16 0 a6 2 0 1 0 12 0"/><path d="M78 92 Q84 70 80 56 M90 92 Q86 72 92 56" /></g>' +
      '<g stroke="#9fe3c8" stroke-width="1.4" fill="none" opacity=".6"><path class="aa-spin" d="M184 40 m-8 0 a8 3 0 1 0 16 0 a6 2 0 1 0 -12 0"/></g>' +
      link(46, 98, 1.3) + blight(140, 98, 1.35, '#9fe3c8', 'wind')) },

    { cap: 'Divine Beast Vah Naboris', svg: svg(sky('#e39850', '#ffd79a') +
      '<path d="M0 100 Q40 88 80 98 T160 94 T200 96 V120 H0 Z" fill="#e6b86a"/><path d="M0 110 Q50 100 110 110 T200 106 V120 H0 Z" fill="#d4a050"/>' +
      '<path d="M60 0 L54 14 L62 14 L52 32" stroke="#fff6a0" stroke-width="2" fill="none" class="aa-flash"/><path d="M150 0 L156 12 L148 12 L158 28" stroke="#fff6a0" stroke-width="2" fill="none" class="aa-flash"/>' +
      '<g fill="' + STONE + '"><path d="M72 58 L70 98 M84 60 L86 98 M116 60 L114 98 M128 58 L130 98" stroke="' + STONE + '" stroke-width="4"/>' +
      '<path d="M64 60 Q66 48 80 48 Q86 30 96 46 Q104 30 114 46 Q126 44 134 52 L136 62 Z"/>' +
      '<path d="M132 56 Q146 40 144 22 L152 18 Q160 22 158 28 L150 28 Q152 46 138 62 Z"/></g>' +
      '<g stroke="' + MAL + '" stroke-width="1.2" fill="none" class="aa-glow"><path d="M68 58 H134 M82 50 L96 56 L110 50"/><circle cx="153" cy="23" r="2" fill="' + MAL + '"/></g>' +
      '<path d="M96 46 L96 30 M114 46 L114 32" stroke="#fff6a0" stroke-width="1.5" class="aa-flash"/>') },

    { cap: FIGHT + 'Thunderblight Ganon', svg: svg(sky('#141000', '#3d3515') +
      '<rect y="96" width="200" height="24" fill="#241e08"/><path d="M0 96 H200" stroke="#ffd400" stroke-width=".8" opacity=".5"/>' +
      '<path d="M96 0 L88 30 L98 30 L84 70" stroke="#fff6a0" stroke-width="2.5" fill="none" class="aa-flash"/>' +
      '<g fill="#ffd400" class="aa-glow"><circle cx="100" cy="90" r="2.5"/><circle cx="176" cy="88" r="2.5"/><circle cx="24" cy="92" r="2"/></g>' +
      link(50, 98, 1.3) + blight(140, 98, 1.35, '#ffd400', 'thunder')) },

    { cap: 'Hyrule Castle', svg: svg(sky('#1a0716', '#6b1a3a') +
      '<g class="aa-spin" opacity=".55"><path d="M100 40 m-60 0 a60 30 0 1 0 120 0 a50 24 0 1 0 -100 0 a40 18 0 1 0 80 0" stroke="#ff3b6b" stroke-width="3" fill="none"/></g>' +
      '<g fill="#241320">' +
      '<rect x="88" y="28" width="24" height="70"/><path d="M86 28 L100 8 L114 28 Z"/>' +
      '<rect x="62" y="48" width="16" height="50"/><path d="M60 48 L70 32 L80 48 Z"/><rect x="122" y="48" width="16" height="50"/><path d="M120 48 L130 32 L140 48 Z"/>' +
      '<rect x="42" y="64" width="12" height="34"/><path d="M40 64 L48 52 L56 64 Z"/><rect x="146" y="64" width="12" height="34"/><path d="M144 64 L152 52 L160 64 Z"/>' +
      '<rect x="40" y="80" width="120" height="20"/></g>' +
      '<g fill="#ff6a8a" class="aa-glow"><rect x="97" y="40" width="6" height="8"/><rect x="68" y="58" width="4" height="6"/><rect x="128" y="58" width="4" height="6"/><rect x="97" y="60" width="6" height="8"/></g>' +
      '<path d="M0 100 Q60 92 100 100 T200 98 V120 H0 Z" fill="#2c3a24"/>' + link(28, 114, .6)) },

    { cap: FIGHT + 'Calamity Ganon', svg: svg(sky('#0e0207', '#4a0a1a') +
      '<g fill="#2a0a14"><rect x="14" y="10" width="10" height="90"/><rect x="176" y="10" width="10" height="90"/></g>' +
      '<rect y="98" width="200" height="22" fill="#1e0610"/>' +
      '<g class="aa-bob"><g stroke="#1a0508" stroke-width="3" fill="none" stroke-linecap="round">' +
      '<path d="M122 60 L96 72 L88 98 M122 60 L104 80 L104 98 M138 60 L164 72 L172 98 M138 60 L156 80 L156 98"/>' +
      '<path d="M124 46 L100 30 L90 14 M136 46 L160 30 L170 14 M124 52 L96 50 L84 40 M136 52 L164 50 L176 40"/></g>' +
      '<g stroke="#ff3b6b" stroke-width="1" fill="none" class="aa-glow"><path d="M122 60 L96 72 L88 98 M138 60 L164 72 L172 98 M124 46 L100 30 M136 46 L160 30"/></g>' +
      '<ellipse cx="130" cy="56" rx="14" ry="12" fill="#1a0508" stroke="#ff3b6b" stroke-width="1.2"/>' +
      '<path d="M120 36 Q130 22 140 36 L138 50 L122 50 Z" fill="#3a0a18" stroke="#ff3b6b" stroke-width="1.2"/>' +
      '<circle cx="130" cy="42" r="3.5" fill="#ff3b6b" class="aa-glow"/>' +
      '<path d="M90 14 L84 4 M170 14 L178 4" stroke="#ff9ab0" stroke-width="1.6"/></g>' +
      '<path d="M126 44 L50 80" stroke="#ff3b6b" stroke-width="2" class="aa-flash"/>' +
      link(40, 100, 1.3)) }
  ];


  // ===== Ship Life ad pictures (blocky, like Minecraft) =====
  function steve(x, y, s, shirt){
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<rect x="-4" y="-12" width="3.8" height="12" fill="#3a3a8a"/><rect x=".2" y="-12" width="3.8" height="12" fill="#3a3a8a"/>' +
      '<rect x="-4" y="-24" width="8" height="12" fill="' + (shirt || '#2fb5b5') + '"/>' +
      '<rect x="-7.5" y="-24" width="3.5" height="11" fill="#c9926b"/><rect x="4" y="-24" width="3.5" height="11" fill="#c9926b"/>' +
      '<rect x="-4" y="-32" width="8" height="8" fill="#c9926b"/><rect x="-4" y="-32" width="8" height="2.5" fill="#4a2f1a"/>' +
      '<rect x="-2.5" y="-28" width="1.5" height="1.2" fill="#3a3a8a"/><rect x="1" y="-28" width="1.5" height="1.2" fill="#3a3a8a"/></g>';
  }
  function stars(n){ var o = '<g fill="#fff">'; for (var k = 0; k < n; k++) o += '<rect x="' + ((k * 47) % 200) + '" y="' + ((k * 29) % 120) + '" width="1.2" height="1.2" opacity="' + (.4 + (k % 3) * .2) + '"/>'; return o + '</g>'; }
  function checker(y, h, a, b){ var o = ''; for (var i = 0; i < 20; i++) for (var j = 0; j < h / 10; j++) o += '<rect x="' + i * 10 + '" y="' + (y + j * 10) + '" width="10" height="10" fill="' + ((i + j) % 2 ? a : b) + '"/>'; return o; }
  var SHIP = [
    { cap: 'Do your chores in town: mow the lawn, wash the dishes, find the penny', svg: svg(sky('#6fb3ff', '#bfe0ff') +
      '<rect x="120" y="30" width="60" height="50" fill="#b08a5a"/><path d="M114 32 L150 8 L186 32 Z" fill="#8a3a2a"/><rect x="144" y="56" width="12" height="24" fill="#5a3a1a"/><rect x="128" y="42" width="10" height="10" fill="#bfe8ff"/><rect x="162" y="42" width="10" height="10" fill="#bfe8ff"/>' +
      checker(80, 40, '#5bbf3a', '#4aa82e') + '<rect x="18" y="66" width="22" height="16" fill="#2e8b2e"/><rect x="24" y="62" width="12" height="6" fill="#3a9a3a"/>' +
      '<g class="aa-bob">' + steve(78, 104, 1.3) + '<rect x="88" y="94" width="14" height="8" fill="#d62d20"/><rect x="84" y="86" width="2" height="10" fill="#333"/><circle cx="90" cy="103" r="2" fill="#222"/><circle cx="100" cy="103" r="2" fill="#222"/></g>' +
      '<text x="190" y="112" font-size="9" font-weight="700" fill="#fff" text-anchor="end">$94.99</text>') },
    { cap: 'Board a giant space ship with 14 floors', svg: svg(sky('#020414', '#101a3a') + stars(40) +
      '<g class="aa-bob"><path d="M20 70 L40 40 H160 L186 62 L160 90 H40 Z" fill="#8a93a3"/><path d="M40 40 H160 L186 62 H20 Z" fill="#a8b1c0" opacity=".6"/>' +
      '<g fill="#ffd84a" class="aa-glow">' + (function(){ var o=''; for (var r = 0; r < 4; r++) for (var c = 0; c < 12; c++) o += '<rect x="' + (48 + c * 9) + '" y="' + (50 + r * 9) + '" width="4" height="4"/>'; return o; })() + '</g>' +
      '<path d="M20 58 L6 54 L6 76 L20 72 Z" fill="#ff8a2a" class="aa-glow"/></g>') },
    { cap: 'Ride the elevator to new floors', svg: svg(sky('#2a2f3a', '#3c4250') +
      '<rect x="50" y="10" width="100" height="104" fill="#5c6474"/><rect x="60" y="30" width="80" height="84" fill="#1a1d24"/>' +
      '<rect x="60" y="30" width="28" height="84" fill="#9aa3b2"/><rect x="112" y="30" width="28" height="84" fill="#9aa3b2"/>' +
      '<rect x="85" y="14" width="30" height="12" fill="#111"/><text x="100" y="24" font-size="10" font-weight="700" fill="#ff5a3a" text-anchor="middle" class="aa-glow">5 ▲</text>' +
      steve(100, 112, 1.6)) },
    { cap: 'Play Snake, Pac-Man and Galaga in the arcade on floor 2', svg: svg(sky('#140a2a', '#2a1450') +
      '<rect y="104" width="200" height="16" fill="#3a1a5a"/>' +
      [[20, '#1a1a1a', '<rect x="30" y="40" width="4" height="4" fill="#3f3"/><rect x="34" y="40" width="4" height="4" fill="#3f3"/><rect x="38" y="40" width="4" height="4" fill="#3f3"/><rect x="38" y="44" width="4" height="4" fill="#3f3"/><rect x="48" y="52" width="3" height="3" fill="#f33" class="aa-glow"/>'],
       [80, '#000', '<path d="M100 48 L92 44 A8 8 0 1 0 92 52 Z" fill="#ffd400" class="aa-glow"/><g fill="#ffd9a0"><circle cx="106" cy="48" r="1"/><circle cx="112" cy="48" r="1"/></g><path d="M86 42 h6 v8 h-6 z" fill="#f33"/>'],
       [140, '#000', '<path d="M160 58 L156 64 H164 Z" fill="#fff"/><g fill="#f3f" class="aa-glow"><rect x="148" y="40" width="5" height="4"/><rect x="158" y="40" width="5" height="4"/><rect x="168" y="40" width="5" height="4"/></g><rect x="159.5" y="48" width="1" height="4" fill="#ff0"/>']].map(function(m){
        return '<rect x="' + m[0] + '" y="24" width="40" height="80" fill="#5a2a8a"/><rect x="' + (m[0] + 4) + '" y="32" width="32" height="30" fill="' + m[1] + '"/>' + m[2] + '<rect x="' + (m[0] + 6) + '" y="70" width="28" height="8" fill="#3a1a5a"/><circle cx="' + (m[0] + 14) + '" cy="74" r="2" fill="#f33"/>';
       }).join('')) },
    { cap: 'Win pets at the prize counter: lion, dog, cat and dolphin', svg: svg(sky('#ffe7b0', '#ffd08a') +
      '<rect y="96" width="200" height="24" fill="#c98a4b"/>' +
      '<g class="aa-bob"><rect x="14" y="70" width="30" height="18" fill="#d9a441"/><rect x="36" y="56" width="18" height="18" fill="#b5761e"/><rect x="40" y="60" width="12" height="12" fill="#d9a441"/><rect x="18" y="88" width="5" height="8" fill="#d9a441"/><rect x="36" y="88" width="5" height="8" fill="#d9a441"/></g>' +
      '<g><rect x="64" y="76" width="26" height="12" fill="#8a5a2a"/><rect x="84" y="66" width="12" height="12" fill="#8a5a2a"/><rect x="92" y="70" width="5" height="3" fill="#222"/><rect x="66" y="88" width="4" height="8" fill="#8a5a2a"/><rect x="84" y="88" width="4" height="8" fill="#8a5a2a"/></g>' +
      '<g class="aa-bob"><rect x="108" y="80" width="20" height="10" fill="#9a9a9a"/><rect x="124" y="72" width="10" height="10" fill="#9a9a9a"/><path d="M124 72 l2 -4 l2 4 M130 72 l2 -4 l2 4" stroke="#9a9a9a" stroke-width="2"/><rect x="110" y="90" width="3" height="6" fill="#9a9a9a"/><rect x="122" y="90" width="3" height="6" fill="#9a9a9a"/></g>' +
      '<rect x="140" y="84" width="54" height="12" fill="#4dbde8"/><g class="aa-bob"><path d="M150 82 Q166 64 184 80 L190 74 L188 86 Q166 92 150 82 Z" fill="#6f8fa8"/></g>' +
      '<text x="100" y="20" font-size="10" font-weight="700" fill="#8a3a0a" text-anchor="middle">10 tickets each</text>') },
    { cap: 'Swim timed laps in the pool on floor 3', svg: svg(sky('#d8f0ff', '#bfe0f0') +
      '<rect x="10" y="40" width="180" height="70" fill="#3fb6e8"/>' +
      '<g stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3"><line x1="10" y1="63" x2="190" y2="63"/><line x1="10" y1="86" x2="190" y2="86"/></g>' +
      drops(12, '#fff', 20, 180, 45, 105, 2, 'aa-rain') +
      '<g class="aa-bob">' + steve(110, 80, 1.1).replace('translate(110 80) scale(1.1)', 'translate(110 76) scale(1.1) rotate(-80)') + '</g>' +
      '<rect x="150" y="10" width="40" height="16" fill="#111"/><text x="170" y="22" font-size="10" font-weight="700" fill="#3f3" text-anchor="middle">0:14.8</text>') },
    { cap: 'Race cars on the track on floor 6', svg: svg(sky('#3a3a3a', '#555') +
      '<rect y="30" width="200" height="80" fill="#2a2a2a"/><g stroke="#fff" stroke-width="2" stroke-dasharray="10 8"><line x1="0" y1="56" x2="200" y2="56"/><line x1="0" y1="83" x2="200" y2="83"/></g>' +
      '<g class="aa-bob"><rect x="120" y="36" width="34" height="14" fill="#d62d20"/><rect x="128" y="32" width="16" height="6" fill="#bfe8ff"/><path d="M110 40 h8 M106 46 h12" stroke="#ffd84a" stroke-width="2" class="aa-flash"/></g>' +
      '<rect x="60" y="63" width="34" height="14" fill="#2f6fd0"/><rect x="68" y="59" width="16" height="6" fill="#bfe8ff"/>' +
      '<rect x="30" y="90" width="34" height="14" fill="#3fa34d"/><rect x="38" y="86" width="16" height="6" fill="#bfe8ff"/>' +
      '<text x="6" y="22" font-size="9" font-weight="700" fill="#ffd84a">GAS 250 · BOOST x2 · LAP 3/5</text>') },
    { cap: 'Lightsaber fights on May the Fourth, at the events on floor 7', svg: svg(sky('#050510', '#1a1a3a') + stars(30) +
      '<rect y="100" width="200" height="20" fill="#2a2a3a"/>' +
      steve(70, 100, 1.8, '#eee') + '<line x1="84" y1="62" x2="104" y2="30" stroke="#3fa9ff" stroke-width="3" stroke-linecap="round" class="aa-glow"/>' +
      steve(135, 100, 1.8, '#222') + '<line x1="121" y1="62" x2="100" y2="30" stroke="#ff3a3a" stroke-width="3" stroke-linecap="round" class="aa-glow"/>' +
      '<circle cx="102" cy="31" r="4" fill="#fff" class="aa-flash"/>') },
    { cap: 'Fight the waves, then Arachnes and the dragon', svg: svg(sky('#0a0014', '#2a0a3a') +
      '<rect y="100" width="200" height="20" fill="#1a1a1a"/>' +
      '<g class="aa-bob"><path d="M100 30 L60 14 L74 36 L40 40 L96 50 Z M130 30 L170 14 L156 36 L190 40 L134 50 Z" fill="#2a1a3a"/><rect x="92" y="34" width="46" height="22" fill="#1a0a2a"/><rect x="136" y="30" width="22" height="14" fill="#1a0a2a"/><rect x="150" y="34" width="4" height="3" fill="#c04dff" class="aa-glow"/><path d="M92 44 L70 60 L76 62" stroke="#1a0a2a" stroke-width="4" fill="none"/></g>' +
      '<g fill="#3fa34d"><rect x="120" y="80" width="8" height="20"/><rect x="118" y="72" width="12" height="10"/></g><g fill="#ddd"><rect x="150" y="80" width="6" height="20"/><rect x="148" y="72" width="10" height="10"/></g>' +
      steve(50, 100, 1.4) + '<line x1="60" y1="80" x2="74" y2="68" stroke="#ccc" stroke-width="2"/>' +
      '<text x="6" y="14" font-size="9" font-weight="700" fill="#fff">WAVE 3</text>') },
    { cap: 'Team up with Ben: his bombs fill the floor with green gas', svg: svg(sky('#0e1a10', '#1e3a22') +
      '<rect y="100" width="200" height="20" fill="#2a3a2a"/>' +
      '<g class="aa-glow" fill="#6fe36f" opacity=".45"><ellipse cx="140" cy="96" rx="50" ry="12"/><ellipse cx="120" cy="88" rx="26" ry="10"/><ellipse cx="160" cy="86" rx="24" ry="9"/></g>' +
      '<g fill="#3fa34d"><rect x="130" y="80" width="8" height="20"/><rect x="128" y="72" width="12" height="10"/></g><g fill="#3fa34d"><rect x="160" y="80" width="8" height="20"/><rect x="158" y="72" width="12" height="10"/></g>' +
      steve(40, 100, 1.5, '#2e7a2e') + steve(70, 100, 1.5) + '<circle cx="90" cy="60" r="4" fill="#222" class="aa-bob"/><text x="44" y="46" font-size="9" font-weight="700" fill="#bff5bf" text-anchor="middle">Ben</text>') }
  ];

  var ADS = [
    { id:'square', title:'Square Recipe Box', text:'Every ingredient in the order you use it, and what you do with it. Make your own!', bg:'#5a3417', fg:'#fbf1e4', video: V + 'square.webm', len: 52 },
    { id:'recipe', title:'Recipe Box', text:'The full recipes: double amounts, checkmarks, step timers and speaker mode.', bg:'#c98a4b', fg:'#fff', video: V + 'recipe.webm', len: 53 },
    { id:'baseball', title:'All Live Baseball', text:'Live games, stats, playoffs, levels and the Baseball Pass.', bg:'#1f3d7a', fg:'#fff', video: V + 'baseball.webm', len: 55 },
    { id:'hedgehog', title:'Whack-a-Hedgehog', text:'How fast can you whack them? Catch Sonic for a reward.', bg:'#4f7a1a', fg:'#fff', video: V + 'hedgehog.webm', len: 57 },
    { id:'walkup', title:'Walk Up Songs', text:'Every player, and the song they walk up to.', bg:'#7b3fa0', fg:'#fff', video: V + 'walkup.webm', len: 57 },
    { id:'lego', title:'LEGO Pic', text:'Drop in a photo and get it back as LEGO bricks.', bg:'#d62d20', fg:'#fff', video: V + 'lego.webm', len: 53 },
    { id:'ship', title:'Ship Life', bg:'#101a33', fg:'#ffd84a', slides: SHIP, len: 60 },
    { id:'zelda', title:'Zelda BOTW', bg:'#0f2a2a', fg:'#e8d9a0', slides: ZELDA, len: 60 }
  ].filter(function(a){ return a.id !== APP; });

  // ---------- look ----------
  var css = [
    'body.aa-on{padding-bottom:40px!important}',
    /* room for the 🕹️ Arcade button in the top-left corner (not on full-screen games) */
    'body.aa-on:not(.aa-full){padding-top:44px!important}',
    /* bars the apps already pin to the bottom move up above ours */
    'body.aa-on .player, body.aa-on .bar{bottom:40px!important}',
    '.aa-bar{position:fixed;left:0;right:0;bottom:0;height:40px;z-index:2147483000;background:#5a3417;color:#fbf1e4;display:flex;align-items:center;justify-content:center;gap:8px;font:700 14px/1 "Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;box-shadow:0 -3px 10px rgba(0,0,0,.2)}',
    '.aa-bar .aa-line{position:absolute;left:0;top:0;height:7px;width:100%;background:rgba(255,255,255,.2)}',
    '.aa-bar .aa-line b{display:block;height:100%;width:0;background:#f2cf4a;transition:width .25s linear}',
    '.aa-bar .aa-clock{margin-top:5px;font-size:17px;font-weight:800;background:#fbf1e4;color:#5a3417;padding:2px 8px}',
    '.aa-bar .aa-lbl{margin-top:5px}',
    '.aa-arc{position:fixed;left:0;top:0;z-index:2147483000;background:#5a3417;color:#fbf1e4;text-decoration:none;font:800 20px/1 "Helvetica Neue",Arial,sans-serif;padding:9px 14px;box-shadow:3px 3px 0 rgba(0,0,0,.25)}',
    '.aa-arc:hover{background:#7a4a24}',
    /* the hedgehog game's own "← Home" link sat in that corner */
    '#home-link{display:none!important}',
    '.aa-big{position:fixed;right:10px;top:50%;transform:translateY(-50%);width:110px;height:110px;z-index:2147483000;pointer-events:none;filter:drop-shadow(3px 3px 0 rgba(0,0,0,.3))}',
    '.aa-big svg{display:block;width:100%;height:100%}',
    '.aa-big .hs{transition:transform .25s cubic-bezier(.4,2.2,.6,1);transform-origin:60px 60px}',
    'body.aa-prem .aa-big{display:none}',
    '.aa-ad{position:fixed;inset:0;z-index:2147483647;background:var(--ad-bg);color:var(--ad-fg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:56px 4vw 30px;text-align:center;font-family:"Helvetica Neue",Arial,sans-serif}',
    '.aa-ad[hidden]{display:none}',
    '.aa-ad .aa-tag{position:absolute;top:14px;left:16px;font-size:15px;font-weight:800;letter-spacing:.6px;opacity:.8}',
    '.aa-ad .aa-left{position:absolute;top:10px;right:14px;font-size:22px;font-weight:800;font-variant-numeric:tabular-nums;background:rgba(0,0,0,.35);border:2px solid currentColor;padding:3px 12px}',
    '.aa-ad .aa-stage{height:min(54vh,56vw);aspect-ratio:200/120;max-width:92vw;border:3px solid rgba(255,255,255,.4);background:#000;overflow:hidden}',
    '.aa-ad .aa-stage svg,.aa-ad .aa-stage video{display:block;width:100%;height:100%;object-fit:cover}',
    '.aa-ad .aa-cap{font-weight:700;font-size:clamp(15px,2.4vw,21px);max-width:900px}',
    '.aa-ad .aa-cap small{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.5px;opacity:.75}',
    '.aa-ad .aa-dots{display:flex;gap:5px}.aa-ad .aa-dots i{width:8px;height:8px;background:currentColor;opacity:.3}.aa-ad .aa-dots i.on{opacity:1}',
    '.aa-ad h2{margin:0;font-size:clamp(22px,4.5vw,38px);color:inherit}',
    '.aa-ad .aa-go{display:inline-block;text-decoration:none;font-weight:800;font-size:clamp(16px,2.4vw,22px);padding:10px 24px;background:var(--ad-fg);color:var(--ad-bg)}',
    '.aa-ad .aa-adbar{position:absolute;left:0;right:0;bottom:0;height:12px;background:rgba(255,255,255,.18)}',
    '.aa-ad .aa-adbar b{display:block;height:100%;width:100%;background:var(--ad-fg);transition:width .25s linear}',
    '.aa-glow{animation:aa-glow 1.1s ease-in-out infinite alternate}@keyframes aa-glow{from{opacity:.45}to{opacity:1}}',
    '.aa-bob{animation:aa-bob 2.2s ease-in-out infinite}@keyframes aa-bob{50%{transform:translateY(-3px)}}',
    '.aa-flash{animation:aa-flash 1.4s steps(1) infinite}@keyframes aa-flash{0%,55%,75%{opacity:0}60%,80%{opacity:1}}',
    '.aa-spin{transform-box:fill-box;transform-origin:center;animation:aa-spin 2.5s linear infinite}@keyframes aa-spin{to{transform:rotate(360deg)}}',
    '.aa-rain{animation:aa-rain .6s linear infinite}@keyframes aa-rain{from{transform:translate(0,-12px)}to{transform:translate(-4px,0)}}',
    '.aa-bar .aa-upg{position:absolute;right:8px;top:12px;border:none;background:#f2cf4a;color:#3a2d00;font:800 13px "Helvetica Neue",Arial,sans-serif;padding:4px 10px;cursor:pointer}',
    '.aa-bar .aa-upg.on{background:#fbf1e4;color:#5a3417}',
    '.aa-shop{position:fixed;inset:0 0 40px 0;z-index:2147483001;background:rgba(40,25,12,.6);display:flex;align-items:center;justify-content:center;padding:16px;font-family:"Helvetica Neue",Arial,sans-serif;color:#3b2a1e}',
    '.aa-shop[hidden]{display:none}',
    '.aa-panel{position:relative;width:100%;max-width:540px;max-height:100%;overflow:auto;background:#fffaf4;border:4px solid #5a3417;box-shadow:8px 8px 0 rgba(0,0,0,.3);padding:18px;text-align:left}',
    '.aa-panel h3{margin:0 0 4px;color:#5a3417;font-size:24px}.aa-panel .aa-h3p{margin-top:18px;color:#6a2fa0}',
    '.aa-panel p{margin:0 0 12px;color:#8a6a50;font-size:15px}',
    '.aa-panel .aa-x{position:absolute;top:8px;right:8px;border:2px solid #5a3417;background:#fff;color:#5a3417;font-weight:800;padding:2px 10px;cursor:pointer}',
    '.aa-plans{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.aa-plan{border:3px solid #ecd3b5;background:#fff;padding:14px 12px;text-align:center;display:flex;flex-direction:column;gap:6px}',
    '.aa-plan.best{border-color:#f2cf4a;background:#fdf7dc}.aa-plan.prem{border-color:#d9c2f0;background:#faf5ff}.aa-plan.prem.best{border-color:#9b59d0;background:#f3e8ff}',
    '.aa-price{font-size:30px;font-weight:800;color:#5a3417}.aa-price small{font-size:14px;color:#8a6a50}',
    '.aa-save{font-size:12px;font-weight:800;color:#3f6b31;min-height:1.2em}',
    '.aa-plan button{border:none;background:#5a3417;color:#fbf1e4;font-weight:800;font-size:16px;padding:9px;cursor:pointer}',
    '.aa-plan.best button{background:#d9b21f;color:#3a2d00}.aa-plan.prem button{background:#6a2fa0;color:#fff}',
    '.aa-status{margin-top:14px;padding:10px 12px;background:#eef5ea;border-left:4px solid #5b8c4a;font-weight:700;color:#3f6b31}',
    '.aa-off{margin-top:8px;border:2px solid #8a6a50;background:#fff;color:#8a6a50;font-weight:700;padding:5px 10px;cursor:pointer}',
    '.aa-perks{margin:0 0 12px;padding-left:20px;color:#5a3417;font-size:14px;line-height:1.5}',
    '.aa-test{margin-top:12px;font-size:12.5px;color:#8a6a50;background:#fbf1e4;padding:8px 10px}',
    '@media (max-width:640px){.aa-plans{grid-template-columns:1fr}.aa-bar .aa-upg{font-size:11px;padding:3px 7px}.aa-bar .aa-lbl{display:none}.aa-big{width:78px;height:78px}.aa-bar{font-size:12px;justify-content:flex-end;padding-right:10px}.aa-arc{font-size:15px;padding:7px 10px}}'
  ].join('\n');

  function clockFace(){
    var f = ['<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="58" fill="#5a3417"/><circle cx="60" cy="60" r="53" fill="#fffaf4"/>',
      '<circle class="aa-ring" cx="60" cy="60" r="50.5" fill="none" stroke="#f2cf4a" stroke-width="4" transform="rotate(-90 60 60)" stroke-dasharray="317.3" stroke-dashoffset="0"/>'];
    for (var k = 0; k < 60; k++) {
      var a = k * 6 * Math.PI / 180, big = k % 5 === 0, r1 = big ? 43.5 : 46;
      f.push('<line x1="' + (60 + r1 * Math.sin(a)).toFixed(2) + '" y1="' + (60 - r1 * Math.cos(a)).toFixed(2) + '" x2="' + (60 + 48.5 * Math.sin(a)).toFixed(2) + '" y2="' + (60 - 48.5 * Math.cos(a)).toFixed(2) + '" stroke="#5a3417" stroke-width="' + (big ? 2 : .8) + '"/>');
    }
    for (var n = 1; n <= 12; n++) {
      var b = n * 30 * Math.PI / 180;
      f.push('<text x="' + (60 + 36 * Math.sin(b)).toFixed(2) + '" y="' + (60 - 36 * Math.cos(b)).toFixed(2) + '" font-size="8.5" font-weight="800" fill="#3b2a1e" text-anchor="middle" dominant-baseline="central" font-family="Helvetica Neue, Arial, sans-serif">' + (n * 5) + '</text>');
    }
    f.push('<g class="hs"><line x1="60" y1="36" x2="60" y2="18" stroke="#d62d20" stroke-width="2.4" stroke-linecap="round"/><path d="M57 20 L60 14 L63 20 Z" fill="#d62d20"/></g>');
    f.push('<circle cx="60" cy="60" r="24" fill="#fffaf4" stroke="#5a3417" stroke-width="2"/>');
    f.push('<text class="aa-dig" x="60" y="61" font-size="15" font-weight="800" fill="#3b2a1e" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif">0:30</text>');
    f.push('<text x="60" y="71" font-size="5.2" font-weight="800" fill="#9a5b22" text-anchor="middle" font-family="Helvetica Neue, Arial, sans-serif">TILL NEXT AD</text></svg>');
    return f.join('');
  }

  function start(){
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    document.body.classList.add('aa-on');
    if (APP === 'zelda') document.body.classList.add('aa-full');
    var bar = document.createElement('div'); bar.className = 'aa-bar';
    bar.innerHTML = '<div class="aa-line"><b></b></div><span class="aa-lbl">⏱ Next ad in</span><b class="aa-clock">0:30</b><button type="button" class="aa-upg">⭐ Upgrade</button>';
    var shop = document.createElement('div'); shop.className = 'aa-shop'; shop.hidden = true; shop.setAttribute('role', 'dialog'); shop.setAttribute('aria-label', 'Upgrade');
    shop.innerHTML = '<div class="aa-panel"><button type="button" class="aa-x">✕</button>' +
      '<h3>⭐ Upgrade</h3><p>Fewer ads: one every <b>5 minutes</b> instead of every 3, in every arcade app.</p><div class="aa-plans">' +
      '<div class="aa-plan"><b>1 month</b><div class="aa-price">$1<small>/month</small></div><div class="aa-save"></div><button type="button" data-buy="month">Get 1 month</button></div>' +
      '<div class="aa-plan best"><b>1 year</b><div class="aa-price">$10<small>/year</small></div><div class="aa-save">Save $2 (2 months free)</div><button type="button" data-buy="year">Get 1 year</button></div></div>' +
      '<h3 class="aa-h3p">💎 Premium</h3><p><b>No ads and more:</b></p><ul class="aa-perks"><li>No ads in any arcade app</li><li>▢ Square Recipe Box: 2 new recipes every month</li><li>📖 Recipe Box: the pasta, muffin and porridge recipes</li><li>⚾ All Live Baseball: a video of every pitch, hit and play</li><li>🎵 Walk Up Songs: every player who played this season</li><li>🦔 Whack-a-Hedgehog: every hammer, mode and grid unlocked</li><li>🚀 Ship Life: start with all the floors (a choice in the mod)</li></ul><div class="aa-plans">' +
      '<div class="aa-plan prem"><b>1 month</b><div class="aa-price">$3<small>/month</small></div><div class="aa-save"></div><button type="button" data-buy="pmonth">Get 1 month</button></div>' +
      '<div class="aa-plan prem best"><b>1 year</b><div class="aa-price">$30<small>/year</small></div><div class="aa-save">Save $6 (2 months free)</div><button type="button" data-buy="pyear">Get 1 year</button></div></div>' +
      '<div class="aa-status" hidden></div><button type="button" class="aa-off" hidden>Turn off my ⭐ / 💎 and go back to normal</button>' +
      '<div class="aa-test">🧪 <b>Test mode.</b> Buying gives you the upgrade on this device without charging anything.</div></div>';
    document.body.appendChild(shop);
    // top-left corner of every app: the 🕹️ Arcade button
    var arc = document.createElement('a'); arc.className = 'aa-arc'; arc.href = ARCADE; arc.textContent = '🕹️ Arcade';
    document.body.appendChild(arc);
    var big = document.createElement('div'); big.className = 'aa-big'; big.setAttribute('aria-label', 'Time till the next ad'); big.innerHTML = clockFace();
    var ad = document.createElement('div'); ad.className = 'aa-ad'; ad.hidden = true; ad.setAttribute('role', 'dialog'); ad.setAttribute('aria-label', 'Ad');
    ad.innerHTML = '<span class="aa-tag">AD</span><span class="aa-left"></span><div class="aa-stage"></div><div class="aa-cap"></div><div class="aa-dots"></div><h2></h2><a class="aa-go" target="_blank" rel="noopener">🕹️ Open Arcade →</a><div class="aa-adbar"><b></b></div>';
    document.body.appendChild(bar); document.body.appendChild(big); document.body.appendChild(ad);

    var nextAt = Date.now() + AD_FIRST, waitTotal = AD_FIRST, lastAd = -1, slideIv = null, adIv = null, secAngle = null, lastSec = null;
    function mmss(sec){ return Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2); }
    function paintBig(sec, total){
      if (sec === lastSec) return; lastSec = sec;
      var target = (sec % 60) * 6;
      if (secAngle === null) secAngle = target; else { var d = ((target - secAngle) % 360 + 540) % 360 - 180; secAngle += d; }
      big.querySelector('.hs').style.transform = 'rotate(' + secAngle + 'deg)';
      big.querySelector('.aa-ring').setAttribute('stroke-dashoffset', (317.3 * (1 - sec / total)).toFixed(1));
      big.querySelector('.aa-dig').textContent = mmss(sec);
    }
    function showAd(){
      // a random ad (never the same twice in a row, never this app's own), a random 45-60 seconds, no skipping
      var pick; do { pick = Math.floor(Math.random() * ADS.length); } while (ADS.length > 1 && pick === lastAd);
      lastAd = pick;
      var a = ADS[pick], most = Math.max(AD_MIN, Math.min(AD_MAX, a.len)), dur = AD_MIN + Math.floor(Math.random() * (most - AD_MIN + 1));
      var stage = ad.querySelector('.aa-stage'), cap = ad.querySelector('.aa-cap'), dots = ad.querySelector('.aa-dots');
      ad.style.setProperty('--ad-bg', a.bg); ad.style.setProperty('--ad-fg', a.fg);
      ad.querySelector('h2').textContent = a.title;
      ad.querySelector('.aa-go').href = ARCADE + '#' + a.id;
      clearInterval(slideIv);
      if (a.slides) {
        var n = 0;
        dots.style.display = ''; dots.innerHTML = a.slides.map(function(){ return '<i></i>'; }).join('');
        var paintSlide = function(){ stage.innerHTML = a.slides[n].svg; cap.innerHTML = a.slides[n].cap; dots.querySelectorAll('i').forEach(function(d, k){ d.classList.toggle('on', k === n); }); };
        paintSlide();
        slideIv = setInterval(function(){ if (n < a.slides.length - 1) { n++; paintSlide(); } }, dur * 1000 / a.slides.length);
      } else {
        dots.style.display = 'none'; cap.textContent = a.text;
        stage.innerHTML = '<video muted autoplay playsinline preload="auto"></video>';
        var v = stage.querySelector('video'); v.src = a.video; var pr = v.play(); if (pr && pr.catch) pr.catch(function(){});
      }
      var end = Date.now() + dur * 1000, left = ad.querySelector('.aa-left'), abar = ad.querySelector('.aa-adbar b');
      var paint = function(){
        var ms = Math.max(0, end - Date.now()), sec = Math.ceil(ms / 1000);
        left.textContent = '⏱ ' + mmss(sec); abar.style.width = (sec / dur * 100) + '%';
        if (ms <= 0) { clearInterval(adIv); clearInterval(slideIv); ad.hidden = true; stage.innerHTML = ''; nextAt = Date.now() + adEvery(); waitTotal = adEvery(); tick(); }
      };
      ad.hidden = false; paint();
      clearInterval(adIv); adIv = setInterval(paint, 200);
    }
    function tick(){
      var lbl = bar.querySelector('.aa-lbl'), clk = bar.querySelector('.aa-clock'), line = bar.querySelector('.aa-line b');
      if (!ad.hidden) { lbl.textContent = '▶ Ad playing (can\'t skip)'; clk.hidden = true; line.style.width = '100%'; return; }
      document.body.classList.toggle('aa-prem', premium());
      if (premium()) { lbl.textContent = '💎 Premium: no ads'; clk.hidden = true; line.style.width = '100%'; return; }
      var ms = Math.max(0, nextAt - Date.now()), sec = Math.ceil(ms / 1000), total = waitTotal / 1000;
      lbl.textContent = (upgraded() ? '⭐' : '⏱') + ' Next ad in'; clk.hidden = false; clk.textContent = mmss(sec);
      paintBig(sec, total);
      line.style.width = ((total - sec) / total * 100) + '%';
      if (ms <= 0) { showAd(); tick(); }
    }
    // ---------- the store ----------
    function fmtDate(t){ return new Date(t).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }); }
    function paintShop(){
      var on = upgraded(), pr = premium(), s2 = shop.querySelector('.aa-status'), b = bar.querySelector('.aa-upg');
      s2.hidden = !on && !pr; shop.querySelector('.aa-off').hidden = !on && !pr;
      if (pr) s2.textContent = '💎 Premium until ' + fmtDate(until('premiumUntil')) + ': no ads and all the extras in every arcade app. Buying again adds more time.';
      else if (on) s2.textContent = '✅ Upgraded until ' + fmtDate(until('upgradeUntil')) + '. Ads come every 5 minutes. Buying again adds more time.';
      b.textContent = pr ? '💎 Premium' : on ? '⭐ Upgraded' : '⭐ Upgrade'; b.classList.toggle('on', on || pr);
      shop.querySelector('.aa-test').hidden = !!(PAY.month && PAY.year && PAY.pmonth && PAY.pyear);
    }
    function grant(plan){
      var k = PLANS[plan].key, wasBasic = !upgraded() && !premium();
      try { localStorage.setItem('squarebox:' + k, String(Math.max(Date.now(), until(k)) + PLANS[plan].days * 86400000)); } catch(e){}
      if (k === 'upgradeUntil' && wasBasic && waitTotal === 3 * 60 * 1000) { nextAt += 2 * 60 * 1000; waitTotal = 5 * 60 * 1000; }   // stretch this wait to 5 minutes
      paintShop(); tick(); changed();
    }
    function changed(){ try { window.dispatchEvent(new Event('arcade-premium-change')); } catch(e){} }
    bar.querySelector('.aa-upg').addEventListener('click', function(){ paintShop(); shop.hidden = false; });
    window.appArcadeOpenStore = function(){ paintShop(); shop.hidden = false; };   // apps can open the store (e.g. a locked Premium tile)
    shop.addEventListener('click', function(e){
      if (e.target === shop || e.target.closest('.aa-x')) { shop.hidden = true; return; }
      if (e.target.closest('.aa-off')) {
        try { localStorage.removeItem('squarebox:upgradeUntil'); localStorage.removeItem('squarebox:premiumUntil'); } catch(e2){}
        if (waitTotal > 3 * 60 * 1000) { nextAt -= waitTotal - 3 * 60 * 1000; waitTotal = 3 * 60 * 1000; }
        if (nextAt < Date.now()) { nextAt = Date.now() + 3 * 60 * 1000; waitTotal = 3 * 60 * 1000; }
        paintShop(); tick(); changed(); return;
      }
      var b = e.target.closest('[data-buy]'); if (!b) return;
      if (PAY[b.dataset.buy]) { location.href = PAY[b.dataset.buy]; return; }   // real Stripe checkout
      grant(b.dataset.buy);                                                      // test mode
    });
    paintShop();
    setInterval(tick, 250); tick();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
