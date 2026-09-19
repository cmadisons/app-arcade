// Turns a "Recipe: ..." issue into an entry in recipes.js.
// The issue body has a ```json block made by the Square Recipe Box's "Share with everyone" button.
const fs = require('fs');
const ev = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const issue = ev.issue;
const out = (k, v) => fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}<<EOF\n${v}\nEOF\n`);
function fail(msg) { out('ok', 'no'); out('message', msg); console.log(msg); process.exit(0); }

const m = (issue.body || '').match(/```json\s*([\s\S]*?)```/);
if (!m) fail("I couldn't find the recipe in this issue. Please use the **👥 Share with everyone** button in the Square Recipe Box.");
let r; try { r = JSON.parse(m[1]); } catch (e) { fail('The recipe data in this issue is broken. Please share it again from the Square Recipe Box.'); }

// keep only plain text of sensible sizes; strip anything that looks like HTML and any control characters
const txt = (v, n) => String(v == null ? '' : v).replace(/<[^>]*>/g, '').replace(/[\x00-\x1f\x7f]/g, ' ').trim().slice(0, n);
const title = txt(r.title, 80);
if (!title) fail('The recipe needs a name.');
const items = (Array.isArray(r.items) ? r.items : []).slice(0, 60).map(it => ({
  name: txt(it && it.name, 80),
  amount: txt(it && it.amount, 40),
  optional: !!(it && it.optional),
  uses: (Array.isArray(it && it.uses) ? it.uses : []).slice(0, 10)
    .map(u => ({ step: txt(u && u.step, 20), text: txt(u && u.text, 300) })).filter(u => u.text)
})).filter(it => it.name);
if (!items.length) fail('The recipe needs at least one ingredient.');

const file = 'recipes.js';
const list = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\s*window\.SHARED_RECIPES\s*=\s*/, '').replace(/;\s*$/, ''));
if (list.some(x => x.issue === issue.number)) fail('This recipe was already added.');
const base = 'u-' + (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'recipe');
let id = base, n = 2;
while (list.some(x => x.id === id)) id = base + '-' + n++;
const CATS = ['chicken', 'beef', 'pork', 'pasta', 'drinks', 'dessert', 'other'];
list.push({ id, title, makes: txt(r.makes, 60), category: CATS.includes(r.category) ? r.category : 'other', items, by: '@' + issue.user.login, issue: issue.number, added: new Date().toISOString().slice(0, 10) });
fs.writeFileSync(file, 'window.SHARED_RECIPES = ' + JSON.stringify(list, null, 1) + ';\n');
out('ok', 'yes'); out('title', title); out('id', id);
