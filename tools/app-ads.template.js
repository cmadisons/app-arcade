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

/*SCENES*/

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
    /* bars the apps already pin to the bottom move up above ours */
    'body.aa-on .player, body.aa-on .bar{bottom:40px!important}',
    '.aa-bar{position:fixed;left:0;right:0;bottom:0;height:40px;z-index:2147483000;background:#5a3417;color:#fbf1e4;display:flex;align-items:center;justify-content:center;gap:8px;font:700 14px/1 "Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;box-shadow:0 -3px 10px rgba(0,0,0,.2)}',
    '.aa-bar .aa-line{position:absolute;left:0;top:0;height:7px;width:100%;background:rgba(255,255,255,.2)}',
    '.aa-bar .aa-line b{display:block;height:100%;width:0;background:#f2cf4a;transition:width .25s linear}',
    '.aa-bar .aa-clock{margin-top:5px;font-size:17px;font-weight:800;background:#fbf1e4;color:#5a3417;padding:2px 8px}',
    '.aa-bar .aa-lbl{margin-top:5px}',
    '.aa-bar .aa-arc{position:absolute;left:0;top:7px;bottom:0;display:flex;align-items:center;padding:0 12px;background:#7a4a24;color:#fbf1e4;text-decoration:none;font-weight:800;font-size:15px}',
    '.aa-bar .aa-arc:hover{background:#94602f}',
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
    '.aa-test{margin-top:12px;font-size:12.5px;color:#8a6a50;background:#fbf1e4;padding:8px 10px}',
    '@media (max-width:640px){.aa-plans{grid-template-columns:1fr}.aa-bar .aa-upg{font-size:11px;padding:3px 7px}.aa-bar .aa-lbl{display:none}.aa-big{width:78px;height:78px}.aa-bar{font-size:12px;justify-content:flex-end;padding-right:10px}.aa-bar .aa-arc{font-size:13px}}'
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
    var bar = document.createElement('div'); bar.className = 'aa-bar';
    bar.innerHTML = '<div class="aa-line"><b></b></div><a class="aa-arc" href="' + ARCADE + '">🕹️ Arcade</a><span class="aa-lbl">⏱ Next ad in</span><b class="aa-clock">0:30</b><button type="button" class="aa-upg">⭐ Upgrade</button>';
    var shop = document.createElement('div'); shop.className = 'aa-shop'; shop.hidden = true; shop.setAttribute('role', 'dialog'); shop.setAttribute('aria-label', 'Upgrade');
    shop.innerHTML = '<div class="aa-panel"><button type="button" class="aa-x">✕</button>' +
      '<h3>⭐ Upgrade</h3><p>Fewer ads: one every <b>5 minutes</b> instead of every 3, in every arcade app.</p><div class="aa-plans">' +
      '<div class="aa-plan"><b>1 month</b><div class="aa-price">$1<small>/month</small></div><div class="aa-save"></div><button type="button" data-buy="month">Get 1 month</button></div>' +
      '<div class="aa-plan best"><b>1 year</b><div class="aa-price">$10<small>/year</small></div><div class="aa-save">Save $2 (2 months free)</div><button type="button" data-buy="year">Get 1 year</button></div></div>' +
      '<h3 class="aa-h3p">💎 Premium</h3><p><b>No ads at all</b> in every arcade app, plus <b>2 new recipes every month</b> in the Square Recipe Box.</p><div class="aa-plans">' +
      '<div class="aa-plan prem"><b>1 month</b><div class="aa-price">$3<small>/month</small></div><div class="aa-save"></div><button type="button" data-buy="pmonth">Get 1 month</button></div>' +
      '<div class="aa-plan prem best"><b>1 year</b><div class="aa-price">$30<small>/year</small></div><div class="aa-save">Save $6 (2 months free)</div><button type="button" data-buy="pyear">Get 1 year</button></div></div>' +
      '<div class="aa-status" hidden></div><button type="button" class="aa-off" hidden>Turn off my ⭐ / 💎 and go back to normal</button>' +
      '<div class="aa-test">🧪 <b>Test mode.</b> Buying gives you the upgrade on this device without charging anything.</div></div>';
    document.body.appendChild(shop);
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
      if (pr) s2.textContent = '💎 Premium until ' + fmtDate(until('premiumUntil')) + ': no ads in any arcade app. Buying again adds more time.';
      else if (on) s2.textContent = '✅ Upgraded until ' + fmtDate(until('upgradeUntil')) + '. Ads come every 5 minutes. Buying again adds more time.';
      b.textContent = pr ? '💎 Premium' : on ? '⭐ Upgraded' : '⭐ Upgrade'; b.classList.toggle('on', on || pr);
      shop.querySelector('.aa-test').hidden = !!(PAY.month && PAY.year && PAY.pmonth && PAY.pyear);
    }
    function grant(plan){
      var k = PLANS[plan].key, wasBasic = !upgraded() && !premium();
      try { localStorage.setItem('squarebox:' + k, String(Math.max(Date.now(), until(k)) + PLANS[plan].days * 86400000)); } catch(e){}
      if (k === 'upgradeUntil' && wasBasic && waitTotal === 3 * 60 * 1000) { nextAt += 2 * 60 * 1000; waitTotal = 5 * 60 * 1000; }   // stretch this wait to 5 minutes
      paintShop(); tick();
    }
    bar.querySelector('.aa-upg').addEventListener('click', function(){ paintShop(); shop.hidden = false; });
    shop.addEventListener('click', function(e){
      if (e.target === shop || e.target.closest('.aa-x')) { shop.hidden = true; return; }
      if (e.target.closest('.aa-off')) {
        try { localStorage.removeItem('squarebox:upgradeUntil'); localStorage.removeItem('squarebox:premiumUntil'); } catch(e2){}
        if (waitTotal > 3 * 60 * 1000) { nextAt -= waitTotal - 3 * 60 * 1000; waitTotal = 3 * 60 * 1000; }
        if (nextAt < Date.now()) { nextAt = Date.now() + 3 * 60 * 1000; waitTotal = 3 * 60 * 1000; }
        paintShop(); tick(); return;
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
