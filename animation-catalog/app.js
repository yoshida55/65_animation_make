// ============================================================
// STATE
// ============================================================
const state = {
  filter: 'all',
  search: '',
  editingId: null,
};

let settings = { model: 'gemini3', apiKey: '' };
let attachedFileData = null; // { base64, mimeType, name }
let attachedMdText   = null; // MDファイルのテキスト内容
let mdImportEntries  = [];   // MD一括インポート用エントリ
let _aiPreviewCss    = '';   // AI生成時のpreviewCss一時保持

// 詳細モーダル用
let currentDetailAnim = null;
let currentCodeType   = 'css';

// フォーム用
let currentImplTab = 'css';
let formImplData   = { css: {}, aos: {}, gsap: {} };

// ============================================================
// INIT
// ============================================================
function init() {
  loadSettings();
  renderGrid();
  document.getElementById('searchInput').addEventListener('input', e => {
    state.search = e.target.value.toLowerCase().trim();
    renderGrid();
  });
}

// ============================================================
// DATA ACCESS
// ============================================================
function getCustomAnimations() {
  try { return JSON.parse(localStorage.getItem('customAnimations') || '[]'); }
  catch { return []; }
}

function saveCustomAnimations(arr) {
  localStorage.setItem('customAnimations', JSON.stringify(arr));
}

function getAllAnimations() {
  return [...PRESET_ANIMATIONS, ...getCustomAnimations()];
}

// ============================================================
// GRID RENDER
// ============================================================
let _animMap = {};
let _cardIframeCache = {};
let _cardObserver = null;
let _selectedCardId = null;

function selectCard(id, cardEl) {
  // 前の選択を解除
  if (_selectedCardId && _selectedCardId !== id) {
    const prev = document.querySelector(`.anim-card[data-id="${_selectedCardId}"]`);
    if (prev) {
      prev.classList.remove('card-selected');
      const pIframe = prev.querySelector('.card-iframe');
      if (pIframe && pIframe.contentWindow) {
        try { pIframe.contentWindow.postMessage({type:'hoverOff'}, '*'); } catch(e) {}
      }
    }
  }

  if (_selectedCardId === id) {
    // 同じカードを再クリック → 選択解除
    cardEl.classList.remove('card-selected');
    _selectedCardId = null;
    const iframe = cardEl.querySelector('.card-iframe');
    if (iframe && iframe.contentWindow) {
      try { iframe.contentWindow.postMessage({type:'hoverOff'}, '*'); } catch(e) {}
    }
    return;
  }

  // 新しいカードを選択
  _selectedCardId = id;
  cardEl.classList.add('card-selected');
  const iframe = cardEl.querySelector('.card-iframe');
  if (iframe && iframe.contentWindow) {
    try { iframe.contentWindow.postMessage({type:'hoverOn'}, '*'); } catch(e) {}
  }
}

function cardHoverOn(id) {
  const iframe = document.querySelector(`.card-iframe[data-anim-id="${id}"]`);
  if (iframe && iframe.contentWindow) {
    try { iframe.contentWindow.postMessage({type:'hoverOn'}, '*'); } catch(e) {}
  }
}

function cardHoverOff(id) {
  const iframe = document.querySelector(`.card-iframe[data-anim-id="${id}"]`);
  if (iframe && iframe.contentWindow) {
    try { iframe.contentWindow.postMessage({type:'hoverOff'}, '*'); } catch(e) {}
  }
}

// 相対パスの src/href → 色違いグラデーションプレースホルダーに変換（srcdocで読めないため）
// ============================================================
// CODE SANITIZER（全角スペース+インラインメモ → 正式コメントに変換）
// ============================================================
function sanitizeCss(code) {
  if (!code) return code;
  return code
    .split('\n')
    .map(line =>
      // 全角スペース以降のテキストを /* */ コメントに変換
      line.replace(/　+(.+)/, (_, note) => ` /* ${note.trim()} */`)
    )
    .join('\n');
}

function sanitizeJs(code) {
  if (!code) return code;
  return code
    .split('\n')
    .map(line =>
      // 全角スペース以降のテキストを // コメントに変換
      line.replace(/　+(.+)/, (_, note) => ` // ${note.trim()}`)
    )
    .join('\n');
}

// ============================================================
// CDN 自動検出（コードからライブラリを特定してCDNタグを補完）
// ============================================================
const _CDN_MAP = [
  {
    detect: (h, j) => /slick/i.test(h) || /\.slick\s*\(/.test(j),
    cdn: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"></script>`
  },
  {
    detect: (h, j) => /data-aos/i.test(h) || /AOS\.init/.test(j),
    cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>`
  },
  {
    detect: (_h, j) => /gsap\.|TweenMax|TweenLite|ScrollTrigger/.test(j),
    cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>`
  },
  {
    detect: (h, j) => /swiper/i.test(h) || /new\s+Swiper/.test(j),
    cdn: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>`
  },
  {
    detect: (_h, j) => /\banime\s*\(|anime\./.test(j),
    cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>`
  },
  {
    detect: (_h, j) => /particlesJS|tsParticles/.test(j),
    cdn: `<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>`
  },
];
function detectCdn(html, js) {
  const parts = [];
  _CDN_MAP.forEach(lib => {
    if (lib.detect(html || '', js || '')) parts.push(lib.cdn);
  });
  return parts.join('\n');
}

const _PLACEHOLDER_COLORS = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#ef4444','#3b82f6','#10b981'];
function buildSafeHtml(html) {
  if (!html) return '';
  let idx = 0;
  return html.replace(
    /\bsrc=(['"]?)(?!data:|https?:\/\/|\/\/)[^'">\s]+\1/g,
    (_match, q) => {
      const c = _PLACEHOLDER_COLORS[idx++ % _PLACEHOLDER_COLORS.length];
      const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${c}"/></svg>`);
      return `src=${q}data:image/svg+xml,${svg}${q}`;
    }
  );
}

// :hover → .force-hover 変換（ビルド時・srcdoc内で確実に動作）
function generateForceHoverCss(css) {
  if (!css || !css.includes(':hover')) return '';
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = [];
  const rx = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = rx.exec(clean)) !== null) {
    const sel = m[1].trim();
    if (!sel.includes(':hover') || sel.startsWith('@')) continue;
    out.push(sel.replace(/:hover/g, '.force-hover') + '{' + m[2] + '}');
  }
  return out.join('\n');
}

// CSS transition系を @keyframes infinite に変換（ビルド時・タイマー不要）
function generateInfiniteLoopCss(css) {
  if (!css || !css.includes('transition')) return '';
  const ACTIVE = ['is-visible','active','animated','show','visible','in-view'];
  let out = '', ki = 0;
  const rules = {};
  // コメント除去してルール解析
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rx = /([.#][^{,]+)\{([^}]*)\}/g;
  let m;
  while ((m = rx.exec(clean)) !== null) {
    rules[m[1].trim()] = m[2];
  }
  Object.entries(rules).forEach(([sel, body]) => {
    // シンプルな単一クラスセレクタのみ対象（.element-name）
    if (!/^\.[a-zA-Z][\w-]+$/.test(sel)) return;
    if (!body.includes('transition')) return;
    // activeクラス付きのルールを探す（.element.is-visible 等）
    const activeSel = ACTIVE.map(ac => sel + '.' + ac).find(s => rules[s]);
    if (!activeSel) return;
    // プロパティ解析
    const parse = s => {
      const p = {};
      s.split(';').forEach(r => {
        const i = r.indexOf(':');
        if (i > 0) p[r.slice(0, i).trim()] = r.slice(i + 1).trim();
      });
      return p;
    };
    const base = parse(body);
    const act  = parse(rules[activeSel]);
    // 変化するプロパティだけ抽出
    let from = '', to = '';
    Object.keys(act).forEach(p => {
      if (base[p] != null && base[p] !== act[p]) {
        from += p + ':' + base[p] + ';';
        to   += p + ':' + act[p]  + ';';
      }
    });
    if (!from) return;
    // 0%,100%:hidden → 15%,85%:visible の3秒ループ keyframes生成
    const kn = '_lp' + ki++;
    out += `@keyframes ${kn}{0%,100%{${from}}15%,85%{${to}}}\n`;
    out += `${sel}{animation:${kn} 3s ease-in-out infinite!important;transition:none!important}\n`;
  });
  return out;
}

function buildCardPreviewSrcdoc(anim) {
  const impls  = anim.implementations || {};
  const impl   = impls.css || impls.aos || impls.gsap || Object.values(impls)[0];
  if (!impl) return '';

  const isAos  = (impl.cdn || '').includes('aos') || (impl.html || '').includes('data-aos');
  const cdnSafe = (impl.cdn || '')
    .replace(/\/>/g, '>')
    .replace(/<\\\/script>/gi, '</script>');

  const aosFixJs = isAos
    ? `<script>
if(typeof AOS!=='undefined')AOS.init({duration:800,offset:0,once:false});
// data-aos-delay を animation-delay に反映
setTimeout(function(){
  document.querySelectorAll('[data-aos][data-aos-delay]').forEach(function(el){
    var d=parseInt(el.getAttribute('data-aos-delay'))||0;
    if(d>0)el.style.animationDelay=(d/1000)+'s';
  });
},100);
<\/script>`
    : '';

  // IntersectionObserver即時発火＋定期ループ（カードプレビュー用）
  const loopScript = `<script>
(function(){
  var _t=[],LOOP=3000,PAUSE=400;
  var RMCLS=['is-visible','active','animated','show','in-view','visible'];
  window.IntersectionObserver=function(cb){
    var o={cb:cb,els:[]};_t.push(o);
    return{
      observe:function(el){
        o.els.push(el);
        setTimeout(function(){cb([{isIntersecting:true,target:el,intersectionRatio:1}]);},80);
      },
      unobserve:function(){},
      disconnect:function(){o.els=[];}
    };
  };
  setInterval(function(){
    // ① AOS系リセット
    document.querySelectorAll('[data-aos]').forEach(function(el){el.classList.remove('aos-animate');});
    setTimeout(function(){
      document.querySelectorAll('[data-aos]').forEach(function(el){el.classList.add('aos-animate');});
    },PAUSE);
    // ② IntersectionObserver系（AOS以外のクラスベース）
    _t.forEach(function(o){
      o.els.forEach(function(el){RMCLS.forEach(function(c){el.classList.remove(c);});});
      setTimeout(function(){
        o.els.forEach(function(el){o.cb([{isIntersecting:true,target:el,intersectionRatio:1}]);});
      },PAUSE);
    });
  },LOOP);

  // ホバーアニメーション用: :hover → .force-hover のCSS自動生成
  setTimeout(function(){
    var style=document.createElement('style');
    var rules=[];
    try{
      Array.from(document.styleSheets).forEach(function(sheet){
        try{
          Array.from(sheet.cssRules||[]).forEach(function(rule){
            if(rule.selectorText&&rule.selectorText.includes(':hover')){
              var sel=rule.selectorText.replace(/:hover/g,'.force-hover');
              rules.push(sel+'{'+rule.style.cssText+'}');
            }
          });
        }catch(e){}
      });
    }catch(e){}
    style.textContent=rules.join('\n');
    document.head.appendChild(style);
  },300);

  // 親フレームからのhoverOn/hoverOffメッセージで強制ホバー状態を切替
  window.addEventListener('message',function(e){
    if(!e.data)return;
    if(e.data.type==='hoverOn'){
      document.querySelectorAll('body *').forEach(function(el){el.classList.add('force-hover');});
    }else if(e.data.type==='hoverOff'){
      document.querySelectorAll('.force-hover').forEach(function(el){el.classList.remove('force-hover');});
    }
  });
})();
<\/script>`;

  // ── previewCss が存在すれば常に優先使用 ──
  // AIが生成したpreviewCssは常にカードプレビューとして使う（条件なし）
  let rawPreviewCss      = (anim.previewCss || '').trim();
  const hasHoverTrigger  = (impl.css || '').includes(':hover');
  const hasJsTrigger     = /scroll|\.on\(|\.click|\.toggle|\.hover|IntersectionObserver|classList/.test(impl.js || '');

  // previewCssが空かつJSトリガー系のみ → 自動フォールバック（フェードアップで代替表示）
  // CSSホバー系は実HTMLをスケール表示するので除外
  if (!rawPreviewCss && hasJsTrigger && !hasHoverTrigger) {
    const kn = `_fb_${anim.id.replace(/[^a-zA-Z0-9]/g,'')}`;
    rawPreviewCss = `@keyframes ${kn}{0%,100%{opacity:0;transform:translateY(10px)}40%,70%{opacity:1;transform:translateY(0)}}`+
                   `.preview-el{animation:${kn} 2.5s ease-in-out infinite;}`;
  }

  const usePreviewCss    = !!rawPreviewCss; // previewCssがあれば必ず使う（トリガー種別問わず）

  if (usePreviewCss) {
    // #prev-${id} セレクタをそのまま使えるよう body 内に同 id の div を置く
    const previewWrap = `<div id="prev-${anim.id}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">` +
                        `<div class="preview-el"></div></div>`;
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;height:100%;overflow:hidden;background:#f8fafc}
  .preview-el{width:56px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:4px}
  ${rawPreviewCss}
</style></head><body>${previewWrap}</body></html>`;
  }

  // ── 通常アニメーション（AOS / CSS transition / @keyframes） ──
  // 外部画像URL → 視認可能なストライプグラデーション置換（srcdocでは相対/外部URLが読み込めないため）
  const safeCss = sanitizeCss(impl.css || '')
    .replace(/url\((['"]?)(?!data:)[^)'"]*\1\)/g,
             'repeating-linear-gradient(135deg, #94a3b8 0, #cbd5e1 12px, #94a3b8 24px)')
    // 大きいrem/em単位のbackground-sizeをカードプレビューで見える大きさに変換
    .replace(/\bbackground-size\s*:\s*[\d.]+(?:rem|em)\s+[\d.]+(?:rem|em)/g,
             'background-size: 30px 30px');

  // :hover → .force-hover（ビルド時変換・postMessageで確実に発火）
  const forceHoverCss = generateForceHoverCss(safeCss);
  // CSS transition → @keyframes infinite（ビルド時変換・タイマー不要）
  const loopCss = generateInfiniteLoopCss(safeCss);
  // 純粋な @keyframes アニメーションも infinite に（AOS以外）
  const infiniteCss = `body *:not([data-aos]){animation-iteration-count:infinite!important}`;
  // AOS アニメーション → @keyframes 無限ループ（タイマー不依存、純CSS）
  const aosLoopCss = `[data-aos].aos-animate{transition:none!important;animation-fill-mode:both!important;animation-duration:3s!important;animation-iteration-count:infinite!important;animation-timing-function:ease-in-out!important}
[data-aos=fade].aos-animate{animation-name:_al_f!important}@keyframes _al_f{0%,100%{opacity:0}20%,80%{opacity:1}}
[data-aos=fade-up].aos-animate{animation-name:_al_fu!important}@keyframes _al_fu{0%,100%{opacity:0;transform:translate3d(0,40px,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-down].aos-animate{animation-name:_al_fdo!important}@keyframes _al_fdo{0%,100%{opacity:0;transform:translate3d(0,-40px,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-left].aos-animate{animation-name:_al_fl!important}@keyframes _al_fl{0%,100%{opacity:0;transform:translate3d(40px,0,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-right].aos-animate{animation-name:_al_frt!important}@keyframes _al_frt{0%,100%{opacity:0;transform:translate3d(-40px,0,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-up-right].aos-animate{animation-name:_al_fur!important}@keyframes _al_fur{0%,100%{opacity:0;transform:translate3d(-40px,40px,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-up-left].aos-animate{animation-name:_al_ful!important}@keyframes _al_ful{0%,100%{opacity:0;transform:translate3d(40px,40px,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-down-right].aos-animate{animation-name:_al_fdr!important}@keyframes _al_fdr{0%,100%{opacity:0;transform:translate3d(-40px,-40px,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=fade-down-left].aos-animate{animation-name:_al_fdl!important}@keyframes _al_fdl{0%,100%{opacity:0;transform:translate3d(40px,-40px,0)}20%,80%{opacity:1;transform:translate3d(0,0,0)}}
[data-aos=zoom-in].aos-animate{animation-name:_al_zi!important}@keyframes _al_zi{0%,100%{opacity:0;transform:scale(.6)}20%,80%{opacity:1;transform:scale(1)}}
[data-aos=zoom-in-up].aos-animate{animation-name:_al_ziu!important}@keyframes _al_ziu{0%,100%{opacity:0;transform:scale(.6) translate3d(0,40px,0)}20%,80%{opacity:1;transform:scale(1) translate3d(0,0,0)}}
[data-aos=zoom-in-down].aos-animate{animation-name:_al_zid!important}@keyframes _al_zid{0%,100%{opacity:0;transform:scale(.6) translate3d(0,-40px,0)}20%,80%{opacity:1;transform:scale(1) translate3d(0,0,0)}}
[data-aos=zoom-out].aos-animate{animation-name:_al_zo!important}@keyframes _al_zo{0%,100%{opacity:0;transform:scale(1.2)}20%,80%{opacity:1;transform:scale(1)}}
[data-aos=flip-left].aos-animate{animation-name:_al_fll!important}@keyframes _al_fll{0%,100%{opacity:0;transform:perspective(2500px) rotateY(-100deg)}20%,80%{opacity:1;transform:perspective(2500px) rotateY(0deg)}}
[data-aos=flip-right].aos-animate{animation-name:_al_flr!important}@keyframes _al_flr{0%,100%{opacity:0;transform:perspective(2500px) rotateY(100deg)}20%,80%{opacity:1;transform:perspective(2500px) rotateY(0deg)}}
[data-aos=flip-up].aos-animate{animation-name:_al_flu!important}@keyframes _al_flu{0%,100%{opacity:0;transform:perspective(2500px) rotateX(-100deg)}20%,80%{opacity:1;transform:perspective(2500px) rotateX(0deg)}}
[data-aos=flip-down].aos-animate{animation-name:_al_fld!important}@keyframes _al_fld{0%,100%{opacity:0;transform:perspective(2500px) rotateX(100deg)}20%,80%{opacity:1;transform:perspective(2500px) rotateX(0deg)}}
[data-aos=slide-up].aos-animate{animation-name:_al_su!important;overflow:hidden}@keyframes _al_su{0%,100%{transform:translateY(100%)}20%,80%{transform:translateY(0)}}
[data-aos=slide-down].aos-animate{animation-name:_al_sdo!important}@keyframes _al_sdo{0%,100%{transform:translateY(-100%)}20%,80%{transform:translateY(0)}}
[data-aos=slide-left].aos-animate{animation-name:_al_sl!important}@keyframes _al_sl{0%,100%{transform:translateX(100%)}20%,80%{transform:translateX(0)}}
[data-aos=slide-right].aos-animate{animation-name:_al_srt!important}@keyframes _al_srt{0%,100%{transform:translateX(-100%)}20%,80%{transform:translateX(0)}}`;

  // AOS系: コンテンツをカードサイズにズームアウト
  const aosCardCss = isAos
    ? `body{padding:0!important;align-items:flex-start!important;justify-content:flex-start!important}
       body>*{zoom:0.28;width:357%;max-width:357%}`
    : '';

  // CSSホバー系: 実HTMLをカードサイズに縮小表示（潰れ防止）
  const hoverCardCss = (!isAos && hasHoverTrigger)
    ? `body>*{zoom:0.42;width:238%;max-width:238%}`
    : '';

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;height:100%;overflow:hidden}
  body{display:flex;align-items:center;justify-content:center;
    background:#f8fafc;font-family:-apple-system,sans-serif;padding:8px}
  .spacer,.spacer-small{display:none!important}
  [id]{min-height:40px;width:100%}
  ${safeCss}
  ${forceHoverCss}
  ${infiniteCss}
  ${loopCss}
  ${aosLoopCss}
  ${aosCardCss}
  ${hoverCardCss}
</style>${loopScript}${cdnSafe}</head><body>
  ${buildSafeHtml(impl.html || '')}
  ${impl.js ? `<script>${sanitizeJs(impl.js)}<\/script>` : ''}
  ${aosFixJs}
</body></html>`;
}

function setupCardIframeObserver() {
  if (_cardObserver) _cardObserver.disconnect();
  _cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const iframe = entry.target;
      const id = iframe.dataset.animId;
      if (_cardIframeCache[id]) return; // 既にロード済み
      const anim = _animMap[id];
      if (!anim) return;
      iframe.srcdoc = buildCardPreviewSrcdoc(anim);
      _cardIframeCache[id] = true;
      _cardObserver.unobserve(iframe);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card-iframe').forEach(el => _cardObserver.observe(el));
}

function renderGrid() {
  const grid = document.getElementById('catalogGrid');
  const all  = getAllAnimations();

  const filtered = all.filter(a => {
    const matchCat    = state.filter === 'all' || a.category === state.filter;
    const matchSearch = !state.search
      || a.name.toLowerCase().includes(state.search)
      || (a.tags || []).some(t => t.toLowerCase().includes(state.search))
      || (a.memo || '').toLowerCase().includes(state.search);
    return matchCat && matchSearch;
  });

  document.getElementById('countBar').textContent = `${filtered.length} 件`;
  // iframeのキャッシュをクリア（再描画時）
  _cardIframeCache = {};

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <div style="font-size:40px">🔍</div>
      <p>アニメーションが見つかりません</p>
    </div>`;
    return;
  }

  const customIds = new Set(getCustomAnimations().map(c => c.id));
  _selectedCardId = null; // 再描画時に選択をリセット

  // アニメーションマップを更新（Observer用）
  _animMap = {};
  filtered.forEach(a => { _animMap[a.id] = a; });

  grid.innerHTML = filtered.map(a => {
    const impls = a.implementations || {};
    const badges = Object.keys(impls)
      .map(k => `<span class="badge badge-${k}">${k.toUpperCase()}</span>`)
      .join('');
    const isCustom = customIds.has(a.id);
    const editBtn  = isCustom
      ? `<button class="card-action-btn" onclick="event.stopPropagation();openFormModal('${a.id}')" title="編集">✏️</button>
         <button class="card-action-btn danger" onclick="event.stopPropagation();deleteAnim('${a.id}')" title="削除">🗑</button>`
      : '';
    const detailBtn = `<button class="card-action-btn" onclick="event.stopPropagation();openDetail('${a.id}')" title="詳細を見る">🔍</button>`;
    return `
      <div class="anim-card" data-id="${a.id}" onclick="openDetail('${a.id}')">
        <div class="card-preview" id="prev-${a.id}">
          <iframe class="card-iframe" data-anim-id="${a.id}" scrolling="no"></iframe>
          <div class="card-preview-overlay"
               onclick="event.stopPropagation();openDetail('${a.id}')"
               onmouseenter="cardHoverOn('${a.id}')"
               onmouseleave="cardHoverOff('${a.id}')"></div>
        </div>
        <div class="card-info">
          <div class="card-header">
            <div class="card-name">${escHtml(a.name)}</div>
            <div class="card-actions">${detailBtn}${editBtn}</div>
          </div>
          <div class="card-category">${a.category}</div>
          <div class="card-badges">${badges}</div>
        </div>
      </div>`;
  }).join('');

  setupCardIframeObserver();
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// FILTER
// ============================================================
function setFilter(cat, btn) {
  state.filter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid();
}

// ============================================================
// DETAIL MODAL
// ============================================================
function openDetail(id) {
  const anim = getAllAnimations().find(a => a.id === id);
  if (!anim) return;
  currentDetailAnim = anim;

  document.getElementById('detailTitle').textContent = anim.name;

  // タブ生成
  const impls = anim.implementations || {};
  const keys  = Object.keys(impls);
  currentCodeType = keys[0] || 'css';

  document.getElementById('codeTabs').innerHTML = keys.map(k => `
    <button class="code-tab ${k === currentCodeType ? 'active' : ''}"
      onclick="switchCodeTab('${k}', this)">${k.toUpperCase()}版</button>
  `).join('');

  // 編集ボタン（カスタムのみ）
  const isCustom = getCustomAnimations().some(c => c.id === id);
  document.getElementById('editFromDetailBtn').style.display = isCustom ? '' : 'none';

  renderCodeBlock();
  renderDemoFrame();
  renderDetailMeta(anim);
  openModal('detailOverlay');
}

function switchCodeTab(type, btn) {
  currentCodeType = type;
  document.querySelectorAll('.code-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCodeBlock();
  renderDemoFrame();
}

function renderCodeBlock() {
  if (!currentDetailAnim) return;
  const impl = (currentDetailAnim.implementations || {})[currentCodeType];
  if (!impl) { document.getElementById('codeBlock').textContent = ''; return; }

  let code = '';
  if (impl.cdn)  code += `<!-- CDN -->\n${impl.cdn}\n\n`;
  if (impl.html) code += `<!-- HTML -->\n${impl.html}\n\n`;
  if (impl.css)  code += `/* CSS */\n${impl.css}\n\n`;
  if (impl.js)   code += `// JavaScript\n${impl.js}`;
  document.getElementById('codeBlock').textContent = code.trim();
}

function renderDemoFrame() {
  if (!currentDetailAnim) return;
  const impl = (currentDetailAnim.implementations || {})[currentCodeType];
  if (!impl) return;
  document.getElementById('demoFrame').srcdoc = buildDemoSrcdoc(impl);
}

function buildDemoSrcdoc(impl) {
  // 自己終了タグを修正 ＋ 誤って保存された <\/script>（バックスラッシュ付き）を正規化
  const cdnSafe = (impl.cdn || '')
    .replace(/\/>/g, '>')
    .replace(/<\\\/script>/gi, '</script>');

  const isAos = (impl.cdn || '').includes('aos') || (impl.html || '').includes('data-aos');

  // AOS用: spacerを圧縮、flexセンタリング無効
  const bodyStyle = isAos
    ? 'min-height:100vh; background:#f8fafc; font-family:-apple-system,sans-serif; padding:20px;'
    : 'display:flex; align-items:center; justify-content:center; min-height:100vh; background:#f8fafc; font-family:-apple-system,sans-serif; padding:20px;';

  const aosFixCss  = isAos ? '.spacer,.spacer-small{height:20px!important}' : '';
  // ユーザーのAOS.initより後に実行してoffset:0で上書き
  const aosFixJs   = isAos
    ? `<script>if(typeof AOS!=='undefined')AOS.init({duration:800,offset:0,once:false});<\/script>`
    : '';

  // IO即時発火 + クラスベーストリガー一括適用（ループなし・詳細モーダル用）
  const demoLoopScript = `<script>
(function(){
  var _observed=[];
  // IntersectionObserver を即時発火モックに置換
  window.IntersectionObserver=function(cb){
    return{
      observe:function(el){
        _observed.push({cb:cb,el:el});
        setTimeout(function(){cb([{isIntersecting:true,target:el,intersectionRatio:1}]);},80);
      },
      unobserve:function(){},
      disconnect:function(){}
    };
  };
  // 300ms後: クラスベーストリガーを一括適用（IO未使用アニメーション対応）
  var TRIGGER=['is-visible','active','animated','show','in-view','visible','animate',
               'anim-active','wave-animate','curtain-open','revealed','triggered','enter'];
  setTimeout(function(){
    var sel='.anim-trigger,.reveal,.fade,.appear,.scroll-anim,.js-anim'+
            ',[class*="anim"],[class*="scroll-"],[class*="reveal"],[class*="fade-"]';
    try{
      document.querySelectorAll(sel).forEach(function(el){
        TRIGGER.forEach(function(c){el.classList.add(c);});
      });
    }catch(e){}
    _observed.forEach(function(o){
      o.cb([{isIntersecting:true,target:o.el,intersectionRatio:1}]);
    });
  },300);
})();
<\/script>`;

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { ${bodyStyle} }
  ${aosFixCss}
  ${impl.css || ''}
</style>
${demoLoopScript}
${cdnSafe}
</head>
<body>
  ${impl.html || '<div style="width:80px;height:50px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:8px;"></div>'}
  ${impl.js ? `<script>${impl.js}<\/script>` : ''}
  ${aosFixJs}
</body></html>`;
}

function replayDemo() {
  renderDemoFrame();
}

function editFromDetail() {
  if (!currentDetailAnim) return;
  closeModal('detailOverlay');
  openFormModal(currentDetailAnim.id);
}

function copyCode() {
  const code = document.getElementById('codeBlock').textContent;
  const btn  = document.getElementById('copyBtn');
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✅ コピー済';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 コピー'; btn.classList.remove('copied'); }, 2000);
  }).catch(() => {
    // フォールバック
    const ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ コピー済';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = '📋 コピー'; btn.classList.remove('copied'); }, 2000);
  });
}

function renderDetailMeta(anim) {
  const tags = (anim.tags || [])
    .map(t => `<span class="meta-tag">${escHtml(t)}</span>`).join('');
  let html = '';
  if (tags) html += `<div class="meta-row"><span class="meta-label">タグ</span>${tags}</div>`;
  if (anim.memo)   html += `<div class="meta-memo">${escHtml(anim.memo)}</div>`;
  if (anim.refUrl) html += `<div class="meta-row"><span class="meta-label">参照</span><a href="${escHtml(anim.refUrl)}" target="_blank" style="font-size:12px;color:#6366f1;">${escHtml(anim.refUrl)}</a></div>`;
  document.getElementById('detailMeta').innerHTML = html;
}

// ============================================================
// FORM MODAL
// ============================================================
function openFormModal(editId = null) {
  state.editingId = editId;
  document.getElementById('formTitle').textContent = editId ? 'アニメーション編集' : 'アニメーション登録';

  // リセット
  ['formName','formTags','formRefUrl','formMemo','formPreviewCss',
   'formHtml','formCss','formJs','formCdn','aiPromptInput'].forEach(id => {
    document.getElementById(id).value = '';
  });
  clearAIFile();
  _aiPreviewCss  = '';
  document.getElementById('formCategory').value = 'scroll';
  formImplData   = { css: {}, aos: {}, gsap: {} };
  currentImplTab = 'css';

  if (editId) {
    const anim = getAllAnimations().find(a => a.id === editId);
    if (anim) {
      document.getElementById('formName').value     = anim.name;
      document.getElementById('formCategory').value = anim.category;
      document.getElementById('formTags').value     = (anim.tags || []).join(' ');
      document.getElementById('formRefUrl').value      = anim.refUrl    || '';
      document.getElementById('formMemo').value        = anim.memo      || '';
      document.getElementById('formPreviewCss').value  = anim.previewCss || '';
      formImplData = JSON.parse(JSON.stringify(anim.implementations || {}));
    }
  }

  // タブ初期化
  document.querySelectorAll('.impl-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('implTabCss').classList.add('active');
  loadImplFields('css');
  document.getElementById('formCdnGroup').style.display = 'none';
  updateLivePreview();
  openModal('formOverlay');
}

function switchImplTab(tab, btn) {
  saveCurrentImplFields();
  currentImplTab = tab;
  document.querySelectorAll('.impl-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadImplFields(tab);
  document.getElementById('formCdnGroup').style.display =
    (tab === 'aos' || tab === 'gsap') ? '' : 'none';
  updateLivePreview();
}

function saveCurrentImplFields() {
  const html   = document.getElementById('formHtml').value;
  const js     = sanitizeJs(document.getElementById('formJs').value);
  const cdnEl  = document.getElementById('formCdn');
  // CDN未入力の場合はコードからライブラリを自動検出して補完
  if (!cdnEl.value.trim()) {
    const auto = detectCdn(html, js);
    if (auto) cdnEl.value = auto;
  }
  formImplData[currentImplTab] = {
    html,
    css: sanitizeCss(document.getElementById('formCss').value),
    js,
    cdn: cdnEl.value,
  };
}

function loadImplFields(tab) {
  const d = formImplData[tab] || {};
  document.getElementById('formHtml').value = d.html || '';
  document.getElementById('formCss').value  = d.css  || '';
  document.getElementById('formJs').value   = d.js   || '';
  document.getElementById('formCdn').value  = d.cdn  || '';
}

function updateLivePreview() {
  const html = document.getElementById('formHtml').value;
  const css  = document.getElementById('formCss').value;
  const js   = document.getElementById('formJs').value;

  const doc = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; font-family: sans-serif;
    background: #fff; padding: 16px;
  }
  ${css}
</style>
</head><body>
  ${html || '<p style="color:#94a3b8;font-size:12px;">HTMLを入力するとここにプレビューが表示されます</p>'}
  ${js ? `<script>${js}<\/script>` : ''}
</body></html>`;

  document.getElementById('livePreviewFrame').srcdoc = doc;
}

function saveAnimation() {
  saveCurrentImplFields();
  const name = document.getElementById('formName').value.trim();
  if (!name) { showToast('名前を入力してください', 'error'); return; }

  // 空でない実装だけ保持
  const implementations = {};
  ['css','aos','gsap'].forEach(key => {
    const d = formImplData[key] || {};
    if (d.html || d.css) implementations[key] = d;
  });

  if (Object.keys(implementations).length === 0) {
    showToast('HTML または CSS を入力してください', 'error');
    return;
  }

  const newAnim = {
    id:       state.editingId || `custom-${Date.now()}`,
    name,
    category: document.getElementById('formCategory').value,
    tags:     document.getElementById('formTags').value.split(/\s+/).filter(Boolean),
    refUrl:   document.getElementById('formRefUrl').value.trim(),
    memo:     document.getElementById('formMemo').value.trim(),
    previewCss: document.getElementById('formPreviewCss').value.trim()
      || (state.editingId
        ? (getAllAnimations().find(a => a.id === state.editingId)?.previewCss || '')
        : ''),
    implementations,
  };

  let customs = getCustomAnimations();
  if (state.editingId) {
    const idx = customs.findIndex(c => c.id === state.editingId);
    if (idx >= 0) customs[idx] = newAnim;
    else customs.push(newAnim);
  } else {
    customs.push(newAnim);
  }

  saveCustomAnimations(customs);
  closeModal('formOverlay');
  renderGrid();
  showToast('✅ 保存しました！');
}

function deleteAnim(id) {
  if (!confirm('このアニメーションを削除しますか？')) return;
  saveCustomAnimations(getCustomAnimations().filter(c => c.id !== id));
  renderGrid();
  showToast('削除しました');
}

// ============================================================
// AI GENERATION
// ============================================================
async function generateWithAI() {
  if (!settings.apiKey) {
    showToast('⚙️ 設定からAPIキーを入力してください', 'error');
    openSettingsModal();
    return;
  }

  // MDファイルの場合は一括インポートモードへ
  if (attachedMdText) {
    await generateFromMd();
    return;
  }

  // 動画ファイルの場合は専用解析フローへ
  if (attachedFileData && attachedFileData.mimeType.startsWith('video/')) {
    await generateFromVideo();
    return;
  }

  const prompt = document.getElementById('aiPromptInput').value.trim();
  if (!prompt && !attachedFileData) { showToast('テキストか画像・動画を入力してください', 'error'); return; }

  const btn = document.getElementById('aiGenBtn');
  btn.textContent = '生成中...';
  btn.disabled = true;

  const systemPrompt = `あなたはCSS/JavaScriptアニメーションの専門家です。ユーザーの要望に合ったアニメーションのコードを生成してください。
必ず以下のJSON形式のみで返答してください（前後の説明文は不要）：
{
  "html": "HTMLコード（bodyタグは不要）",
  "css": "CSSコード",
  "js": "JavaScriptコード（不要なら空文字）",
  "cdn": "外部CDNのlink/scriptタグ（jQuery等が必要な場合のみ、不要なら空文字）",
  "name": "アニメーション名（日本語OK）",
  "category": "scroll か flip か hover か loading",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "previewCss": "カードプレビュー用CSS（後述）"
}

【previewCssの書き方（必須・必ず生成すること）】
- 幅56px・高さ36pxの <div class="preview-el"> をアニメーションさせるCSSを書く
- @keyframes で必ず infinite（無限ループ）にすること
- アニメーションの動きを .preview-el に直接表現すること
  例）フェード: opacity 0→1→0  スライダー: translateX で横スクロール  フリップ: rotateY  スピナー: rotate
       カーテン: 左右2帯(::before/::afterまたはoverflow:hidden + translateX)で開閉  ワイプ: clip-path inset変化
- jQueryプラグイン（Slick等）はJSが動かないためpreviewCssが特に重要
  スライダー系の例: 横3色帯を translateX でスライドさせて「スライダー感」を出す
- previewCssは絶対に空にしないこと（空だと真っ暗になる）

【重要な制約】
- 外部URL（画像・動画・フォントなど）を一切使用しないこと
- 画像が必要な場合はCSSの background: linear-gradient() や background-color で代用すること
- コードはブラウザで直接動作する完全なものにしてください`;

  try {
    let responseText;
    if (settings.model === 'gemini3' || settings.model === 'gemini25' || settings.model === 'gemini') {
      responseText = await callGeminiAPI(systemPrompt, prompt || '添付ファイルのアニメーションを再現してください');
    } else {
      responseText = await callDeepSeekAPI(systemPrompt, prompt);
    }

    // JSON抽出
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSONを取得できませんでした');
    const data = JSON.parse(jsonMatch[0]);

    // フォームに反映
    if (data.name)     document.getElementById('formName').value     = data.name;
    if (data.category) document.getElementById('formCategory').value = data.category;
    if (data.tags)     document.getElementById('formTags').value     = data.tags.join(' ');

    // previewCss を一時保持＋フォームに表示
    _aiPreviewCss = data.previewCss || '';
    document.getElementById('formPreviewCss').value = _aiPreviewCss;

    // CSS版として保存（cdnも含める）
    formImplData.css = { html: data.html || '', css: data.css || '', js: data.js || '', cdn: data.cdn || '' };
    currentImplTab = 'css';
    document.querySelectorAll('.impl-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('implTabCss').classList.add('active');
    // CDNがある場合はグループを表示
    document.getElementById('formCdnGroup').style.display = data.cdn ? '' : 'none';
    loadImplFields('css');
    updateLivePreview();
    showToast('✅ 生成完了！内容を確認して保存してください');

  } catch (e) {
    console.error(e);
    showToast('エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '生成';
    btn.disabled = false;
  }
}

// ============================================================
// 動画プロンプト生成（動画＋テキスト → 説明文を自動生成してinputに反映）
// ============================================================
async function generateVideoPrompt() {
  if (!settings.apiKey) {
    showToast('⚙️ 設定からAPIキーを入力してください', 'error');
    openSettingsModal();
    return;
  }
  if (!attachedFileData || !attachedFileData.mimeType.startsWith('video/')) {
    showToast('⚠️ 動画ファイルを添付してください', 'error');
    return;
  }

  const btn = document.getElementById('aiPromptBtn');
  const userText = document.getElementById('aiPromptInput').value.trim();
  btn.textContent = '生成中...';
  btn.disabled = true;

  const promptText = `この動画に映っているUIアニメーションを観察してください。
${userText ? `ユーザーは「${userText}」と説明しています。` : ''}
以下の観点を含む、CSSアニメーション実装のための詳細な説明文を日本語で1〜3文で生成してください。
- 動きの方向・種類（フェード・スライド・回転・スケール・めくり等）
- タイミング・速さの印象（速い・ゆっくり・バウンスあり等）
- 使用場面（スクロール時・ホバー時・ページ読み込み時等）
- 3D感・奥行き感があるかどうか

説明文のみ返してください。JSONや箇条書きは不要です。`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${settings.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType: attachedFileData.mimeType, data: attachedFileData.base64 } },
            { text: promptText }
          ]
        }]
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    const generatedPrompt = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!generatedPrompt) throw new Error('プロンプト生成に失敗しました');

    document.getElementById('aiPromptInput').value = generatedPrompt;
    showToast('✅ プロンプト生成完了！確認・修正後に「生成」を押してください');
  } catch (e) {
    console.error(e);
    showToast('エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '📝 プロンプト生成';
    btn.disabled = false;
  }
}

// ============================================================
// 改善プロンプト生成（粗い指示 → 詳細な改善指示に変換してinputに反映）
// ============================================================
async function generateRefinePrompt() {
  if (!settings.apiKey) {
    showToast('⚙️ 設定からAPIキーを入力してください', 'error');
    openSettingsModal();
    return;
  }
  saveCurrentImplFields();
  const cur = formImplData[currentImplTab] || {};
  if (!cur.html && !cur.css) {
    showToast('⚠️ 先にコードを生成してください', 'error');
    return;
  }

  const btn = document.getElementById('aiRefinePromptBtn');
  const userIdea = document.getElementById('aiPromptInput').value.trim();
  btn.textContent = '生成中...';
  btn.disabled = true;

  const codeSnippet = [
    cur.html ? `HTML:\n${cur.html.slice(0, 400)}` : '',
    cur.css  ? `CSS:\n${cur.css.slice(0, 400)}`   : '',
    cur.js   ? `JS:\n${cur.js.slice(0, 200)}`      : '',
  ].filter(Boolean).join('\n\n');

  const prompt = `以下のCSSアニメーションコードがあります。
${userIdea ? `ユーザーの改善アイデア：「${userIdea}」\n` : ''}
【現在のコード（抜粋）】
${codeSnippet}

このコードに対する改善指示を、AIが実装しやすい具体的な日本語プロンプトに変換してください。
- どのプロパティを変更するか（duration・easing・transform等）
- 具体的な数値や方向の提案
- 追加すべき視覚効果

改善指示プロンプトのみ返してください（JSONや箇条書き不要・1〜3文）。`;

  try {
    const modelId = GEMINI_MODEL_IDS[settings.model] || GEMINI_MODEL_IDS.gemini3;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    const refined = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!refined) throw new Error('改善プロンプト生成に失敗しました');
    document.getElementById('aiPromptInput').value = refined;
    showToast('✅ 改善プロンプト生成完了！確認後「🔧 改善」を押してください');
  } catch (e) {
    console.error(e);
    showToast('エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '📝 改善案生成';
    btn.disabled = false;
  }
}

// ============================================================
// コード改善（現在のコード + プロンプト → 改善版を生成）
// ============================================================
async function refineWithAI() {
  if (!settings.apiKey) {
    showToast('⚙️ 設定からAPIキーを入力してください', 'error');
    openSettingsModal();
    return;
  }
  saveCurrentImplFields();
  const cur = formImplData[currentImplTab] || {};
  if (!cur.html && !cur.css) {
    showToast('⚠️ 先にコードを生成してください', 'error');
    return;
  }
  const refinePrompt = document.getElementById('aiPromptInput').value.trim();
  if (!refinePrompt) {
    showToast('⚠️ 改善指示を入力してください', 'error');
    return;
  }

  const btn = document.getElementById('aiRefineBtn');
  btn.textContent = '改善中...';
  btn.disabled = true;

  const systemPrompt = `あなたはCSSアニメーションの専門家です。
以下の既存コードを改善指示に従って改善し、必ず以下のJSON形式のみで返答してください（前後の説明文不要）：
{
  "html": "改善後のHTML（bodyタグ不要）",
  "css": "改善後のCSS",
  "js": "改善後のJS（不要なら空文字）",
  "previewCss": "カードプレビュー用CSS（幅56px・高さ36pxの .preview-el を @keyframes infinite でアニメーション。必須）"
}

【現在のコード】
HTML:
${cur.html || ''}

CSS:
${cur.css || ''}

JS:
${cur.js || ''}

【改善指示】
${refinePrompt}

【制約】
- 外部URL（画像・動画）は一切使用しない
- 改善指示に従いつつ、既存の構造を活かすこと`;

  try {
    const modelId = GEMINI_MODEL_IDS[settings.model] || GEMINI_MODEL_IDS.gemini3;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini APIエラー (${res.status})`);
    }
    const apiData = await res.json();
    const responseText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSONを取得できませんでした');
    const data = JSON.parse(jsonMatch[0]);

    // 現在タブのコードを更新
    formImplData[currentImplTab] = {
      html: data.html || cur.html || '',
      css:  data.css  || cur.css  || '',
      js:   data.js   !== undefined ? data.js : (cur.js || ''),
      cdn:  cur.cdn || '',
    };
    if (data.previewCss) {
      _aiPreviewCss = data.previewCss;
      document.getElementById('formPreviewCss').value = data.previewCss;
    }
    loadImplFields(currentImplTab);
    updateLivePreview();
    showToast('✅ 改善完了！ライブプレビューを確認してください');
  } catch (e) {
    console.error(e);
    showToast('❌ エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '🔧 改善';
    btn.disabled = false;
  }
}

// ============================================================
// 詳細モーダルから改善プロンプト生成
// ============================================================
async function generateRefinePromptFromDetail() {
  if (!currentDetailAnim) return;
  if (!settings.apiKey) {
    showToast('⚙️ 設定からAPIキーを入力してください', 'error');
    openSettingsModal();
    return;
  }
  const impl = (currentDetailAnim.implementations || {})[currentCodeType] || {};
  const userIdea = document.getElementById('detailRefineInput').value.trim();

  const btn = document.getElementById('detailRefinePromptBtn');
  btn.textContent = '生成中...';
  btn.disabled = true;

  const codeSnippet = [
    impl.html ? `HTML:\n${impl.html.slice(0, 400)}` : '',
    impl.css  ? `CSS:\n${impl.css.slice(0, 400)}`   : '',
    impl.js   ? `JS:\n${impl.js.slice(0, 200)}`     : '',
  ].filter(Boolean).join('\n\n');

  const prompt = `以下のCSSアニメーションコードがあります。
${userIdea ? `ユーザーの改善アイデア：「${userIdea}」\n` : ''}
【現在のコード（抜粋）】
${codeSnippet}

このコードに対する改善指示を、AIが実装しやすい具体的な日本語プロンプトに変換してください。
- どのプロパティを変更するか（duration・easing・transform等）
- 具体的な数値や方向の提案
- 追加すべき視覚効果

改善指示プロンプトのみ返してください（JSONや箇条書き不要・1〜3文）。`;

  try {
    const modelId = GEMINI_MODEL_IDS[settings.model] || GEMINI_MODEL_IDS.gemini3;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    const refined = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!refined) throw new Error('改善プロンプト生成に失敗しました');
    document.getElementById('detailRefineInput').value = refined;
    showToast('✅ 改善プロンプト生成完了！確認後「🔧 改善」を押してください');
  } catch (e) {
    console.error(e);
    showToast('❌ エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '📝 改善案生成';
    btn.disabled = false;
  }
}

// ============================================================
// 詳細モーダルからコード改善 → カタログ上書き保存
// ============================================================
async function refineFromDetail() {
  if (!currentDetailAnim) return;
  if (!settings.apiKey) {
    showToast('⚙️ 設定からAPIキーを入力してください', 'error');
    openSettingsModal();
    return;
  }
  const impl = (currentDetailAnim.implementations || {})[currentCodeType] || {};
  const refinePrompt = document.getElementById('detailRefineInput').value.trim();
  if (!refinePrompt) {
    showToast('⚠️ 改善の指示を入力してください', 'error');
    return;
  }

  const btn = document.getElementById('detailRefineBtn');
  btn.textContent = '改善中...';
  btn.disabled = true;

  const systemPrompt = `あなたはCSSアニメーションの専門家です。
以下の既存コードを改善指示に従って改善し、必ず以下のJSON形式のみで返答してください（前後の説明文不要）：
{
  "html": "改善後のHTML（bodyタグ不要）",
  "css": "改善後のCSS",
  "js": "改善後のJS（不要なら空文字）",
  "previewCss": "カードプレビュー用CSS（幅56px・高さ36pxの .preview-el を @keyframes infinite でアニメーション。必須）"
}

【現在のコード】
HTML:
${impl.html || ''}

CSS:
${impl.css || ''}

JS:
${impl.js || ''}

【改善指示】
${refinePrompt}

【制約】
- 外部URL（画像・動画）は一切使用しない
- 改善指示に従いつつ、既存の構造を活かすこと`;

  try {
    const modelId = GEMINI_MODEL_IDS[settings.model] || GEMINI_MODEL_IDS.gemini3;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.3 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini APIエラー (${res.status})`);
    }
    const apiData = await res.json();
    const responseText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSONを取得できませんでした');
    const data = JSON.parse(jsonMatch[0]);

    // currentDetailAnim の実装を更新
    if (!currentDetailAnim.implementations) currentDetailAnim.implementations = {};
    currentDetailAnim.implementations[currentCodeType] = {
      html: data.html || impl.html || '',
      css:  data.css  || impl.css  || '',
      js:   data.js   !== undefined ? data.js : (impl.js || ''),
      cdn:  impl.cdn || '',
    };
    if (data.previewCss) {
      currentDetailAnim.previewCss = data.previewCss;
    }

    // カスタムアニメーションとして保存（既存なら上書き・プリセットなら追加）
    const customs = getCustomAnimations();
    const idx = customs.findIndex(c => c.id === currentDetailAnim.id);
    if (idx >= 0) {
      customs[idx] = currentDetailAnim;
    } else {
      // プリセットを改善した場合は新規カスタムとして保存
      currentDetailAnim.id = 'custom_' + Date.now();
      customs.push(currentDetailAnim);
    }
    saveCustomAnimations(customs);

    // 詳細モーダルを更新
    renderCodeBlock();
    renderDemoFrame();
    renderGrid();
    showToast('✅ 改善完了・保存しました！');
  } catch (e) {
    console.error(e);
    showToast('❌ エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '🔧 改善';
    btn.disabled = false;
  }
}

// ============================================================
// 動画アニメーション解析（Video → カタログ登録）
// ============================================================
async function generateFromVideo() {
  const btn = document.getElementById('aiGenBtn');
  btn.textContent = '動画解析中...';
  btn.disabled = true;

  const extraPrompt = document.getElementById('aiPromptInput').value.trim();

  const systemPrompt = `あなたはCSSアニメーションの専門家です。
添付された動画に映っているUIアニメーションを解析し、必ず以下のJSON形式のみで返答してください（前後の説明文不要）:

{
  "name": "アニメーション名（日本語OK、例: フェードアップ）",
  "category": "scroll か flip か hover か loading のいずれか",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "memo": "このアニメーションの特徴・使いどころ（1〜2文）",
  "previewCss": "カードプレビュー用CSS（幅56px・高さ36pxの .preview-el を @keyframes infinite でアニメーション。必須・空にしないこと。例: フェード→opacity 0→1→0, スライド→translateX, カーテン→左右2帯をclip-pathで開閉, フリップ→rotateY）",
  "css": {
    "html": "CSS版のHTML（bodyタグ不要）",
    "css": "CSS版のCSS（@keyframesを含む完全なCSS）",
    "js": "CSS版のJS（IntersectionObserver等、不要なら空文字）"
  },
  "aos": {
    "html": "AOS版のHTML（data-aos属性付き）",
    "css": "AOS版の追加CSS（不要なら空文字）",
    "js": "AOS版のJS（AOS.init()含む）",
    "cdn": "<link rel='stylesheet' href='https://unpkg.com/aos@2.3.1/dist/aos.css'>\\n<script src='https://unpkg.com/aos@2.3.1/dist/aos.js'><\\/script>"
  },
  "gsap": {
    "html": "GSAP版のHTML",
    "css": "GSAP版のCSS（不要なら空文字）",
    "js": "GSAP版のJS（gsap.from()やScrollTrigger使用）",
    "cdn": "<script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'><\\/script>"
  }
}

【解析のポイント】
- アニメーションの種類（フェード・スライド・スケール・回転・etc）を正確に把握する
- タイミング・速度・イージング（ease-out/cubic-bezier等）を再現する
- 外部URL（画像・動画・フォント）は一切使用しないこと
- コードはブラウザで直接動作する完全なものにすること
${extraPrompt ? '\n【追加指示】\n' + extraPrompt : ''}`;

  try {
    // gemini-2.5-pro を動画解析に使用（フラッシュより精度が高い）
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${settings.apiKey}`;
    const parts = [
      { inlineData: { mimeType: attachedFileData.mimeType, data: attachedFileData.base64 } },
      { text: systemPrompt }
    ];
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.2 }
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini APIエラー (${res.status})`);
    }
    const apiData = await res.json();
    const responseText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSONを取得できませんでした');
    const data = JSON.parse(jsonMatch[0]);

    // ---- フォームに反映 ----
    if (data.name)     document.getElementById('formName').value     = data.name;
    if (data.category) document.getElementById('formCategory').value = data.category;
    if (data.tags)     document.getElementById('formTags').value     = (Array.isArray(data.tags) ? data.tags : []).join(' ');
    if (data.memo)     document.getElementById('formMemo').value     = data.memo;

    _aiPreviewCss = data.previewCss || '';
    document.getElementById('formPreviewCss').value = _aiPreviewCss;

    // 3タブ全部に実装コードを入れる
    formImplData.css  = { html: data.css?.html  || '', css: data.css?.css   || '', js: data.css?.js   || '', cdn: '' };
    formImplData.aos  = { html: data.aos?.html  || '', css: data.aos?.css   || '', js: data.aos?.js   || '', cdn: data.aos?.cdn  || '' };
    formImplData.gsap = { html: data.gsap?.html || '', css: data.gsap?.css  || '', js: data.gsap?.js  || '', cdn: data.gsap?.cdn || '' };

    // CSSタブを選択して表示
    currentImplTab = 'css';
    document.querySelectorAll('.impl-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('implTabCss').classList.add('active');
    document.getElementById('formCdnGroup').style.display = 'none';
    loadImplFields('css');
    updateLivePreview();

    showToast('✅ 動画解析完了！CSS / AOS / GSAP の3種コードを生成しました');

  } catch (e) {
    console.error(e);
    showToast('❌ エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '生成';
    btn.disabled = false;
  }
}

const GEMINI_MODEL_IDS = {
  gemini3:    'gemini-2.0-flash',
  gemini25:   'gemini-2.5-flash',
  gemini:     'gemini-2.0-flash',
  gemini25pro: 'gemini-2.5-pro',
};

async function callGeminiAPI(system, userMsg) {
  const modelId = GEMINI_MODEL_IDS[settings.model] || GEMINI_MODEL_IDS.gemini3;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`;

  // partsを構築（ファイルがあればinlineDataを先に追加）
  const parts = [];
  if (attachedFileData) {
    parts.push({ inlineData: { mimeType: attachedFileData.mimeType, data: attachedFileData.base64 } });
  }
  parts.push({ text: system + '\n\nユーザーの要望:\n' + userMsg });

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: { temperature: 0.3 }
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gemini APIエラー (${res.status})`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function handleAIFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById('aiFilePreview');
  const thumb   = document.getElementById('aiFileThumb');
  const nameEl  = document.getElementById('aiFileName');

  // MDファイル処理
  if (file.name.endsWith('.md') || file.type === 'text/markdown') {
    const reader = new FileReader();
    reader.onload = e => {
      attachedMdText   = e.target.result;
      attachedFileData = null;
      preview.style.display = 'flex';
      thumb.style.display   = 'none';
      nameEl.textContent    = '📄 ' + file.name;
      showToast('📄 MDファイルを読み込みました。「生成」で全セクションを一括抽出します');
    };
    reader.readAsText(file);
    event.target.value = '';
    return;
  }

  // 画像・動画処理（既存）
  attachedMdText = null;
  const reader = new FileReader();
  reader.onload = e => {
    const dataUrl = e.target.result;
    // data:mime/type;base64,XXXX → base64部分を抽出
    const [header, base64] = dataUrl.split(',');
    const mimeType = header.replace('data:', '').replace(';base64', '');
    attachedFileData = { base64, mimeType, name: file.name };

    // プレビュー表示
    preview.style.display = 'flex';
    nameEl.textContent    = file.name;
    if (mimeType.startsWith('image/')) {
      thumb.src           = dataUrl;
      thumb.style.display = 'block';
    } else {
      thumb.style.display = 'none'; // 動画はサムネイル省略
    }
  };
  reader.readAsDataURL(file);
  event.target.value = ''; // 同じファイルの再選択を許可
}

function clearAIFile() {
  attachedFileData = null;
  attachedMdText   = null;
  document.getElementById('aiFilePreview').style.display = 'none';
  document.getElementById('aiFileThumb').src = '';
  document.getElementById('aiFileName').textContent = '';
}

function handleAIPaste(event) {
  const items = event.clipboardData?.items;
  if (!items) return;
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault(); // テキストとして貼り付けるのを防ぐ
      const file = item.getAsFile();
      if (!file) continue;
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target.result;
        const [header, base64] = dataUrl.split(',');
        const mimeType = header.replace('data:', '').replace(';base64', '');
        attachedFileData = { base64, mimeType, name: 'pasted-image.png' };
        const preview = document.getElementById('aiFilePreview');
        const thumb   = document.getElementById('aiFileThumb');
        const nameEl  = document.getElementById('aiFileName');
        preview.style.display = 'flex';
        nameEl.textContent    = 'ペースト画像';
        thumb.src             = dataUrl;
        thumb.style.display   = 'block';
        showToast('📋 画像を貼り付けました');
      };
      reader.readAsDataURL(file);
      break; // 画像が1枚見つかったら終了
    }
  }
}

// ============================================================
// AOS プレビューCSS 自動生成
// ============================================================
function generateAutoPreviewCss(anim) {
  const impl = (anim.implementations || {}).aos || {};
  if (!impl.html) return '';

  // 最初の data-aos 属性を取得
  const match = impl.html.match(/data-aos="([^"]+)"/);
  const aosType = match ? match[1] : 'fade-up';
  const id = anim.id;

  const animations = {
    'fade':       '0%,100%{opacity:0}20%,80%{opacity:1}',
    'fade-up':    '0%,100%{opacity:0;transform:translateY(16px)}20%,80%{opacity:1;transform:translateY(0)}',
    'fade-down':  '0%,100%{opacity:0;transform:translateY(-16px)}20%,80%{opacity:1;transform:translateY(0)}',
    'fade-left':  '0%,100%{opacity:0;transform:translateX(16px)}20%,80%{opacity:1;transform:translateX(0)}',
    'fade-right': '0%,100%{opacity:0;transform:translateX(-16px)}20%,80%{opacity:1;transform:translateX(0)}',
    'slide-up':   '0%,100%{opacity:0.3;transform:translateY(24px)}20%,80%{opacity:1;transform:translateY(0)}',
    'slide-down': '0%,100%{opacity:0.3;transform:translateY(-24px)}20%,80%{opacity:1;transform:translateY(0)}',
    'zoom-in':    '0%,100%{opacity:0;transform:scale(0.6)}20%,80%{opacity:1;transform:scale(1)}',
    'flip-left':  '0%,100%{opacity:0;transform:rotateY(-60deg)}20%,80%{opacity:1;transform:rotateY(0)}',
    'flip-right': '0%,100%{opacity:0;transform:rotateY(60deg)}20%,80%{opacity:1;transform:rotateY(0)}',
  };

  const kf = animations[aosType] || animations['fade-up'];
  const kfName = `ap-${id.replace(/[^a-zA-Z0-9]/g, '-')}`;
  return `@keyframes ${kfName}{${kf}}#prev-${id} .preview-el{animation:${kfName} 2.5s ease infinite;}`;
}

// ============================================================
// MD 一括インポート
// ============================================================
async function generateFromMd() {
  const btn = document.getElementById('aiGenBtn');
  btn.textContent = '解析中...';
  btn.disabled = true;

  const systemPrompt = `あなたはアニメーションカタログシステムです。以下のMarkdownファイルから全てのアニメーションセクションを抽出してください。
必ず以下のJSON配列形式のみで返答してください（前後の説明文・コードブロック記号は不要）：
[
  {
    "name": "アニメーション名（日本語OK）",
    "category": "scroll か flip か hover か loading",
    "tags": ["タグ1", "タグ2"],
    "memo": "このアニメーションの簡単な説明（1〜2行）",
    "implType": "css か aos か gsap",
    "html": "HTMLコード（bodyタグは不要）",
    "css": "CSSコード",
    "js": "JavaScriptコード（不要なら空文字）",
    "cdn": "CDNのscript/linkタグ（不要なら空文字）"
  }
]

【絶対厳守】
- コードを一切省略・簡略化・要約しないこと。Markdownに書かれているコードを100%そのまま抽出すること
- 複雑なHTMLでも全要素をそのまま含めること（省略禁止）
- コメントや説明文はJSON外に出さず、コード内のコメントはそのまま残すこと
- HTMLとCSSとJavaScriptが混在している場合は適切に分割してください

Markdownの内容:\n\n`;

  try {
    const modelId = GEMINI_MODEL_IDS[settings.model] || GEMINI_MODEL_IDS.gemini3;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: systemPrompt + attachedMdText }] }],
      generationConfig: { temperature: 0.2 }
    };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini APIエラー (${res.status})`);
    }
    const data = await res.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // JSON配列を抽出
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('JSONを取得できませんでした');
    const entries = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(entries) || entries.length === 0) throw new Error('エントリが見つかりませんでした');

    openMdImportModal(entries);

  } catch (e) {
    console.error(e);
    showToast('エラー: ' + (e.message || '不明なエラー'), 'error');
  } finally {
    btn.textContent = '生成';
    btn.disabled = false;
  }
}

function openMdImportModal(entries) {
  mdImportEntries = entries;
  document.getElementById('mdImportCount').textContent = `${entries.length}件のアニメーションを検出`;

  document.getElementById('mdImportList').innerHTML = entries.map((e, i) => {
    const tags = (e.tags || []).map(t => `<span class="meta-tag">${escHtml(t)}</span>`).join('');
    return `
      <label class="md-import-item">
        <input type="checkbox" class="md-import-check" data-idx="${i}" checked>
        <div class="md-import-info">
          <span class="md-import-name">${escHtml(e.name || '(名前なし)')}</span>
          <div class="md-import-meta">${escHtml(e.category || 'scroll')} · ${escHtml((e.implType || 'css').toUpperCase())} ${tags}</div>
          ${e.memo ? `<div class="md-import-memo">${escHtml(e.memo)}</div>` : ''}
        </div>
      </label>`;
  }).join('');

  openModal('mdImportOverlay');
}

function toggleMdSelectAll() {
  const checks = document.querySelectorAll('.md-import-check');
  const allChecked = [...checks].every(c => c.checked);
  checks.forEach(c => c.checked = !allChecked);
}

function saveMdImport() {
  const checks = [...document.querySelectorAll('.md-import-check')].filter(c => c.checked);
  if (checks.length === 0) { showToast('登録する項目を選択してください', 'error'); return; }

  const customs = getCustomAnimations();
  checks.forEach(c => {
    const e        = mdImportEntries[parseInt(c.dataset.idx)];
    const implType = e.implType || 'css';
    const newId    = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // AOS の場合は CDN を自動補完
    const aoscdn = '<link rel="stylesheet" href="https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css">\n<script src="https://unpkg.com/aos@3.0.0-beta.6/dist/aos.js"></script>';
    const cdn = e.cdn || (implType === 'aos' ? aoscdn : '');

    const impl = { html: e.html || '', css: e.css || '', js: e.js || '', cdn };
    const entry = {
      id:       newId,
      name:     e.name     || 'インポート',
      category: e.category || 'scroll',
      tags:     e.tags     || [],
      memo:     e.memo     || '',
      refUrl:   '',
      previewCss: '',
      implementations: { [implType]: impl },
    };
    entry.previewCss = generateAutoPreviewCss(entry);
    customs.push(entry);
  });

  saveCustomAnimations(customs);
  closeModal('mdImportOverlay');
  renderGrid();
  showToast(`✅ ${checks.length}件を登録しました`);
}

async function callDeepSeekAPI(system, userMsg) {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const body = {
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: userMsg }
    ],
    temperature: 0.3
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `DeepSeek APIエラー (${res.status})`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ============================================================
// SETTINGS
// ============================================================
function openSettingsModal() {
  document.getElementById('settingsModel').value  = settings.model;
  document.getElementById('settingsApiKey').value = settings.apiKey;
  updateApiKeyLabel();
  openModal('settingsOverlay');
}

function updateApiKeyLabel() {
  const model = document.getElementById('settingsModel').value;
  const isGemini = model !== 'deepseek';
  document.getElementById('apiKeyLabel').textContent =
    isGemini ? 'APIキー（Gemini）' : 'APIキー（DeepSeek）';
}

function saveSettings() {
  settings.model  = document.getElementById('settingsModel').value;
  settings.apiKey = document.getElementById('settingsApiKey').value.trim();
  localStorage.setItem('animCatalogSettings', JSON.stringify(settings));
  closeModal('settingsOverlay');
  showToast('✅ 設定を保存しました');
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('animCatalogSettings');
    if (saved) settings = { ...settings, ...JSON.parse(saved) };
  } catch {}
}

// ============================================================
// EXPORT / IMPORT
// ============================================================
function exportData() {
  const data = {
    version: 1,
    exported: new Date().toISOString(),
    customAnimations: getCustomAnimations()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `animation-catalog-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('⬇ エクスポートしました');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const raw  = JSON.parse(e.target.result);
      const list = raw.customAnimations || (Array.isArray(raw) ? raw : []);
      if (!Array.isArray(list)) throw new Error();
      const existing = getCustomAnimations();
      const merged   = [...existing];
      let added = 0;
      list.forEach(anim => {
        if (!merged.some(ex => ex.id === anim.id)) {
          merged.push(anim);
          added++;
        }
      });
      saveCustomAnimations(merged);
      renderGrid();
      showToast(`✅ ${added}件インポートしました`);
    } catch {
      showToast('JSONの形式が正しくありません', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ============================================================
// MODAL UTILS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function handleOverlayClick(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================================
// START
// ============================================================
init();
