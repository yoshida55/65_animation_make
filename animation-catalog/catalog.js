// ============================================================
// Animation Catalog - プリセットデータ
// 追加方法: PRESET_ANIMATIONS 配列に同じ形式でオブジェクトを追加
// ============================================================

const PRESET_ANIMATIONS = [

  // ========================================================
  // SCROLL（スクロール連動）
  // ========================================================
  {
    id: "fade-up",
    name: "Fade Up",
    category: "scroll",
    tags: ["フェード", "下から", "基本", "AOS", "GSAP"],
    memo: "一番よく使う基本スクロールアニメーション",
    refUrl: "",
    previewCss: `
      @keyframes fade-up-prev {
        0%, 100% { opacity: 0; transform: translateY(20px); }
        20%, 80%  { opacity: 1; transform: translateY(0); }
      }
      #prev-fade-up .preview-el { animation: fade-up-prev 2.5s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<div class="fade-up-el">コンテンツ</div>`,
        css: `.fade-up-el {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-up-el.is-visible {
  opacity: 1;
  transform: translateY(0);
}`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up-el').forEach(el => observer.observe(el));`
      },
      aos: {
        html: `<div data-aos="fade-up" data-aos-duration="600" data-aos-delay="0">
  コンテンツ
</div>`,
        css: `/* AOS の CSS を読み込むだけでOK */`,
        js: `AOS.init({
  duration: 600,
  once: true,
  offset: 100
});`,
        cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>`
      },
      gsap: {
        html: `<div class="fade-up-el">コンテンツ</div>`,
        css: `/* CSSは不要（GSAPが制御） */`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.from(".fade-up-el", {
  opacity: 0,
  y: 40,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".fade-up-el",
    start: "top 80%"
  }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  {
    id: "fade-down",
    name: "Fade Down",
    category: "scroll",
    tags: ["フェード", "上から", "AOS", "GSAP"],
    memo: "上から降りてくるアニメーション",
    refUrl: "",
    previewCss: `
      @keyframes fade-down-prev {
        0%, 100% { opacity: 0; transform: translateY(-20px); }
        20%, 80%  { opacity: 1; transform: translateY(0); }
      }
      #prev-fade-down .preview-el { animation: fade-down-prev 2.5s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<div class="fade-down-el">コンテンツ</div>`,
        css: `.fade-down-el {
  opacity: 0;
  transform: translateY(-40px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-down-el.is-visible {
  opacity: 1;
  transform: translateY(0);
}`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-down-el').forEach(el => observer.observe(el));`
      },
      aos: {
        html: `<div data-aos="fade-down" data-aos-duration="600">コンテンツ</div>`,
        css: `/* AOS の CSS を読み込むだけでOK */`,
        js: `AOS.init({ duration: 600, once: true });`,
        cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>`
      },
      gsap: {
        html: `<div class="fade-down-el">コンテンツ</div>`,
        css: `/* CSSは不要 */`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.from(".fade-down-el", {
  opacity: 0,
  y: -40,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: { trigger: ".fade-down-el", start: "top 80%" }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  {
    id: "slide-left",
    name: "Slide Left",
    category: "scroll",
    tags: ["スライド", "右から左", "AOS", "GSAP"],
    memo: "右から左へスライドイン",
    refUrl: "",
    previewCss: `
      @keyframes slide-left-prev {
        0%, 100% { opacity: 0; transform: translateX(30px); }
        20%, 80%  { opacity: 1; transform: translateX(0); }
      }
      #prev-slide-left .preview-el { animation: slide-left-prev 2.5s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<div class="slide-left-el">コンテンツ</div>`,
        css: `.slide-left-el {
  opacity: 0;
  transform: translateX(60px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.slide-left-el.is-visible {
  opacity: 1;
  transform: translateX(0);
}`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.slide-left-el').forEach(el => observer.observe(el));`
      },
      aos: {
        html: `<div data-aos="fade-left" data-aos-duration="600">コンテンツ</div>`,
        css: `/* AOS の CSS を読み込むだけでOK */`,
        js: `AOS.init({ duration: 600, once: true });`,
        cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>`
      },
      gsap: {
        html: `<div class="slide-left-el">コンテンツ</div>`,
        css: `/* CSSは不要 */`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.from(".slide-left-el", {
  opacity: 0,
  x: 60,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: { trigger: ".slide-left-el", start: "top 80%" }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  {
    id: "slide-right",
    name: "Slide Right",
    category: "scroll",
    tags: ["スライド", "左から右", "AOS", "GSAP"],
    memo: "左から右へスライドイン",
    refUrl: "",
    previewCss: `
      @keyframes slide-right-prev {
        0%, 100% { opacity: 0; transform: translateX(-30px); }
        20%, 80%  { opacity: 1; transform: translateX(0); }
      }
      #prev-slide-right .preview-el { animation: slide-right-prev 2.5s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<div class="slide-right-el">コンテンツ</div>`,
        css: `.slide-right-el {
  opacity: 0;
  transform: translateX(-60px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.slide-right-el.is-visible {
  opacity: 1;
  transform: translateX(0);
}`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.slide-right-el').forEach(el => observer.observe(el));`
      },
      aos: {
        html: `<div data-aos="fade-right" data-aos-duration="600">コンテンツ</div>`,
        css: `/* AOS の CSS を読み込むだけでOK */`,
        js: `AOS.init({ duration: 600, once: true });`,
        cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>`
      },
      gsap: {
        html: `<div class="slide-right-el">コンテンツ</div>`,
        css: `/* CSSは不要 */`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.from(".slide-right-el", {
  opacity: 0,
  x: -60,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: { trigger: ".slide-right-el", start: "top 80%" }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  {
    id: "zoom-in",
    name: "Zoom In",
    category: "scroll",
    tags: ["ズーム", "拡大", "スケール", "AOS", "GSAP"],
    memo: "小さくから大きく拡大しながら表示",
    refUrl: "",
    previewCss: `
      @keyframes zoom-in-prev {
        0%, 100% { opacity: 0; transform: scale(0.6); }
        20%, 80%  { opacity: 1; transform: scale(1); }
      }
      #prev-zoom-in .preview-el { animation: zoom-in-prev 2.5s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<div class="zoom-in-el">コンテンツ</div>`,
        css: `.zoom-in-el {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.zoom-in-el.is-visible {
  opacity: 1;
  transform: scale(1);
}`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.zoom-in-el').forEach(el => observer.observe(el));`
      },
      aos: {
        html: `<div data-aos="zoom-in" data-aos-duration="600">コンテンツ</div>`,
        css: `/* AOS の CSS を読み込むだけでOK */`,
        js: `AOS.init({ duration: 600, once: true });`,
        cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>`
      },
      gsap: {
        html: `<div class="zoom-in-el">コンテンツ</div>`,
        css: `/* CSSは不要 */`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.from(".zoom-in-el", {
  opacity: 0,
  scale: 0.8,
  duration: 0.6,
  ease: "back.out(1.7)",
  scrollTrigger: { trigger: ".zoom-in-el", start: "top 80%" }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  {
    id: "bounce-in",
    name: "Bounce In",
    category: "scroll",
    tags: ["バウンス", "弾む", "ポップ", "AOS", "GSAP"],
    memo: "バウンスしながら登場。ポップな印象に",
    refUrl: "",
    previewCss: `
      @keyframes bounce-in-prev {
        0%, 100% { opacity: 0; transform: scale(0.3); }
        40%       { opacity: 1; transform: scale(1.1); }
        60%       { transform: scale(0.95); }
        75%, 85%  { transform: scale(1); opacity: 1; }
      }
      #prev-bounce-in .preview-el { animation: bounce-in-prev 3s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<div class="bounce-in-el">コンテンツ</div>`,
        css: `@keyframes bounceIn {
  0%   { opacity: 0; transform: scale(0.3); }
  50%  { opacity: 1; transform: scale(1.1); }
  70%  { transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
.bounce-in-el {
  opacity: 0;
}
.bounce-in-el.is-visible {
  animation: bounceIn 0.7s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
}`,
        js: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.bounce-in-el').forEach(el => observer.observe(el));`
      },
      aos: {
        html: `<div data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="700">
  コンテンツ
</div>`,
        css: `/* AOS の CSS を読み込むだけでOK */`,
        js: `AOS.init({ duration: 700, once: true });`,
        cdn: `<link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"><\/script>`
      },
      gsap: {
        html: `<div class="bounce-in-el">コンテンツ</div>`,
        css: `/* CSSは不要 */`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.from(".bounce-in-el", {
  opacity: 0,
  scale: 0.3,
  duration: 0.7,
  ease: "back.out(1.7)",
  scrollTrigger: { trigger: ".bounce-in-el", start: "top 80%" }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  // ========================================================
  // FLIP / CARD
  // ========================================================
  {
    id: "card-flip",
    name: "Card Flip",
    category: "flip",
    tags: ["カード", "フリップ", "3D", "ホバー", "表裏"],
    memo: "ホバーでカードが裏返る。表裏で異なるコンテンツを表示",
    refUrl: "",
    previewCss: `
      @keyframes card-flip-prev {
        0%, 100% { transform: rotateY(0deg); }
        40%, 60%  { transform: rotateY(180deg); }
      }
      #prev-card-flip .preview-el {
        animation: card-flip-prev 3s ease infinite;
        transform-style: preserve-3d;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 6px;
      }
    `,
    implementations: {
      css: {
        html: `<div class="card-flip-wrap">
  <div class="card-flip-inner">
    <div class="card-front">表面</div>
    <div class="card-back">裏面</div>
  </div>
</div>`,
        css: `.card-flip-wrap {
  perspective: 800px;
  width: 200px;
  height: 130px;
}
.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}
.card-flip-wrap:hover .card-flip-inner {
  transform: rotateY(180deg);
}
.card-front,
.card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
}
.card-front {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
}
.card-back {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: #fff;
  transform: rotateY(180deg);
}`,
        js: `/* ホバーはCSSだけでOK。JSは不要 */`
      }
    }
  },

  {
    id: "page-turn",
    name: "Page Turn",
    category: "flip",
    tags: ["ページ", "めくれる", "3D", "本", "ブック"],
    memo: "ページが左軸で回転してめくれるアニメーション",
    refUrl: "",
    previewCss: `
      @keyframes page-turn-prev {
        0%, 100% { transform: rotateY(0deg); transform-origin: left center; }
        40%, 60%  { transform: rotateY(-140deg); transform-origin: left center; }
      }
      #prev-page-turn .preview-el {
        animation: page-turn-prev 3s ease infinite;
        background: #f8f4e8;
        border-radius: 2px 6px 6px 2px;
        box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
        transform-origin: left center;
      }
    `,
    implementations: {
      css: {
        html: `<div class="book-wrap">
  <div class="page page-back">ページ 2</div>
  <div class="page page-front">ページ 1</div>
</div>
<button onclick="turnPage()" style="margin-top:12px;padding:8px 20px;cursor:pointer;">めくる</button>`,
        css: `.book-wrap {
  position: relative;
  width: 220px;
  height: 150px;
  perspective: 1200px;
}
.page {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border-radius: 0 8px 8px 0;
  backface-visibility: hidden;
  transform-origin: left center;
  transform-style: preserve-3d;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
}
.page-front {
  background: #fff8e8;
  z-index: 2;
  transition: transform 1s ease;
}
.page-back {
  background: #e8f4ff;
  z-index: 1;
}
.page-front.flipped {
  transform: rotateY(-175deg);
}`,
        js: `function turnPage() {
  const page = document.querySelector('.page-front');
  page.classList.toggle('flipped');
}`
      }
    }
  },

  // ========================================================
  // HOVER
  // ========================================================
  {
    id: "btn-hover",
    name: "Button Hover",
    category: "hover",
    tags: ["ボタン", "ホバー", "色変化", "スケール"],
    memo: "ホバーでボタンが拡大＋色変化するエフェクト",
    refUrl: "",
    previewCss: `
      @keyframes btn-hover-prev {
        0%, 100% { transform: scale(1); background: #667eea; box-shadow: 0 2px 6px rgba(102,126,234,0.3); }
        40%, 60%  { transform: scale(1.08); background: #5a67d8; box-shadow: 0 8px 20px rgba(102,126,234,0.5); }
      }
      #prev-btn-hover .preview-el {
        animation: btn-hover-prev 2.5s ease infinite;
        background: #667eea;
        border-radius: 6px;
      }
    `,
    implementations: {
      css: {
        html: `<button class="hover-btn">クリック</button>`,
        css: `.hover-btn {
  padding: 12px 28px;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}
.hover-btn:hover {
  background: #5a67d8;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}`,
        js: `/* JSは不要 */`
      }
    }
  },

  {
    id: "card-hover",
    name: "Card Hover",
    category: "hover",
    tags: ["カード", "ホバー", "影", "浮き上がり", "リフト"],
    memo: "ホバーでカードが浮き上がり影が付く上品なエフェクト",
    refUrl: "",
    previewCss: `
      @keyframes card-hover-prev {
        0%, 100% { transform: translateY(0); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        40%, 60%  { transform: translateY(-8px); box-shadow: 0 16px 40px rgba(0,0,0,0.18); }
      }
      #prev-card-hover .preview-el {
        animation: card-hover-prev 2.5s ease infinite;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
    `,
    implementations: {
      css: {
        html: `<div class="hover-card">
  <h3>カードタイトル</h3>
  <p>カードの説明文がここに入ります。</p>
</div>`,
        css: `.hover-card {
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.hover-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.14);
}`,
        js: `/* JSは不要 */`
      }
    }
  },

  {
    id: "underline-hover",
    name: "Underline Hover",
    category: "hover",
    tags: ["リンク", "下線", "ホバー", "アンダーライン", "::after"],
    memo: "ホバーで下線が左から右に伸びるリンクエフェクト",
    refUrl: "",
    previewCss: `
      @keyframes ul-expand-prev {
        0%, 100% { width: 0; left: 50%; }
        40%, 60%  { width: 100%; left: 0; }
      }
      #prev-underline-hover .preview-el {
        background: transparent;
        position: relative;
      }
      #prev-underline-hover .preview-el::after {
        content: '';
        position: absolute;
        bottom: 2px;
        height: 2px;
        background: #667eea;
        animation: ul-expand-prev 2.5s ease infinite;
      }
    `,
    implementations: {
      css: {
        html: `<a href="#" class="underline-link">ホバーしてみて</a>`,
        css: `.underline-link {
  position: relative;
  color: #2d3748;
  text-decoration: none;
  font-size: 18px;
  padding-bottom: 4px;
}
.underline-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #667eea;
  transition: width 0.3s ease;
}
.underline-link:hover::after {
  width: 100%;
}`,
        js: `/* JSは不要 */`
      }
    }
  },

  // ========================================================
  // LOADING / TRANSITION
  // ========================================================
  {
    id: "spinner",
    name: "Spinner",
    category: "loading",
    tags: ["ローディング", "スピナー", "待機", "回転", "Loading"],
    memo: "シンプルな円形ローディングアニメーション",
    refUrl: "",
    previewCss: `
      @keyframes spinner-prev { to { transform: rotate(360deg); } }
      #prev-spinner .preview-el {
        border-radius: 50%;
        border: 3px solid rgba(102,126,234,0.2);
        border-top-color: #667eea;
        animation: spinner-prev 0.8s linear infinite;
        background: transparent;
      }
    `,
    implementations: {
      css: {
        html: `<div class="spinner"></div>`,
        css: `@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner {
  width: 44px;
  height: 44px;
  border: 4px solid rgba(102,126,234,0.15);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}`,
        js: `/* JSは不要 */`
      }
    }
  },

  {
    id: "skeleton",
    name: "Skeleton Loading",
    category: "loading",
    tags: ["スケルトン", "ローディング", "プレースホルダー", "シマー", "Shimmer"],
    memo: "コンテンツ読み込み中のスケルトン表示",
    refUrl: "",
    previewCss: `
      @keyframes shimmer-prev {
        0%   { background-position: -200px 0; }
        100% { background-position: calc(200px + 100%) 0; }
      }
      #prev-skeleton .preview-el {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 400px 100%;
        animation: shimmer-prev 1.5s linear infinite;
        border-radius: 4px;
      }
    `,
    implementations: {
      css: {
        html: `<div class="skeleton-wrap">
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-line"></div>
  <div class="skeleton skeleton-line short"></div>
</div>`,
        css: `@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: calc(400px + 100%) 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 400px 100%;
  animation: shimmer 1.5s linear infinite;
  border-radius: 6px;
  margin-bottom: 12px;
}
.skeleton-title {
  height: 24px;
  width: 55%;
}
.skeleton-line {
  height: 14px;
  width: 100%;
}
.skeleton-line.short {
  width: 70%;
}`,
        js: `/* JSは不要 */`
      }
    }
  },

  {
    id: "page-fade",
    name: "Page Fade In",
    category: "loading",
    tags: ["ページ遷移", "フェード", "トランジション", "読み込み"],
    memo: "ページ読み込み時にふわっと表示するトランジション",
    refUrl: "",
    previewCss: `
      @keyframes page-fade-prev {
        0%, 100% { opacity: 0; }
        20%, 80%  { opacity: 1; }
      }
      #prev-page-fade .preview-el { animation: page-fade-prev 3s ease infinite; }
    `,
    implementations: {
      css: {
        html: `<!-- ページ全体のコンテンツを .page-wrap で囲む -->
<div class="page-wrap">
  <h1>ページタイトル</h1>
  <p>コンテンツ...</p>
</div>`,
        css: `@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-wrap {
  animation: pageFadeIn 0.5s ease forwards;
}`,
        js: `/* DOMContentLoaded と組み合わせる場合 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.page-wrap').style.animationPlayState = 'running';
});`
      }
    }
  },

  {
    id: "progress-bar",
    name: "Scroll Progress Bar",
    category: "loading",
    tags: ["プログレス", "バー", "スクロール", "進捗", "固定"],
    memo: "スクロール量に連動したページ上部のプログレスバー",
    refUrl: "",
    previewCss: `
      @keyframes progress-prev {
        0%   { width: 0%; }
        50%  { width: 100%; }
        100% { width: 0%; }
      }
      #prev-progress-bar .preview-el {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 2px;
        animation: progress-prev 2s ease infinite;
        width: 0%;
      }
    `,
    implementations: {
      css: {
        html: `<div class="progress-wrap">
  <div class="progress-bar" id="progressBar"></div>
</div>
<!-- ページ上部に配置 -->`,
        css: `.progress-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0,0,0,0.05);
  z-index: 9999;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: 0%;
  transition: width 0.1s linear;
}`,
        js: `window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  document.getElementById('progressBar').style.width = progress + '%';
});`
      }
    }
  },


  // ========================================================
  // REVEAL（マスク系）
  // ========================================================
  {
    id: "diagonal-reveal",
    name: "Diagonal Reveal",
    category: "scroll",
    tags: ["対角線", "マスク", "カーテン", "左上から右下", "画像", "reveal", "ふわっと"],
    memo: "左上から右下へ、境目なくふわっと表示されるマスクアニメーション。画像に最適",
    refUrl: "",
    previewCss: `
      @keyframes diag-rev-prev {
        0%, 10%  { -webkit-mask-size: 0% 0%;   mask-size: 0% 0%; }
        65%, 80% { -webkit-mask-size: 250% 250%; mask-size: 250% 250%; }
        100%     { -webkit-mask-size: 0% 0%;   mask-size: 0% 0%; }
      }
      #prev-diagonal-reveal .preview-el {
        -webkit-mask-image: linear-gradient(135deg, black 50%, rgba(0,0,0,0.3) 65%, transparent 80%);
        -webkit-mask-size: 0% 0%;
        -webkit-mask-position: 0% 0%;
        -webkit-mask-repeat: no-repeat;
        mask-image: linear-gradient(135deg, black 50%, rgba(0,0,0,0.3) 65%, transparent 80%);
        mask-size: 0% 0%;
        mask-position: 0% 0%;
        mask-repeat: no-repeat;
        animation: diag-rev-prev 3s ease-out infinite;
        border-radius: 6px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60'%3E%3Crect width='80' height='60' fill='%2387CEEB'/%3E%3Crect y='38' width='80' height='22' fill='%234a7c3f'/%3E%3Cpolygon points='28,22 44,8 60,22' fill='%23c0392b'/%3E%3Crect x='32' y='22' width='24' height='16' fill='%23f5e6d0'/%3E%3Crect x='39' y='28' width='8' height='10' fill='%23a0826d'/%3E%3Ccircle cx='62' cy='12' r='7' fill='%23FFD700'/%3E%3C/svg%3E");
        background-size: cover;
      }
    `,
    implementations: {
      css: {
        html: `<!-- 1つのdivだけ。実案件では background-image: url('your.jpg') に差し替え -->
<div class="diagonal-reveal"></div>`,
        css: `@keyframes diagonalReveal {
  from {
    -webkit-mask-size: 0% 0%;
    mask-size: 0% 0%;
  }
  to {
    -webkit-mask-size: 250% 250%;
    mask-size: 250% 250%;
  }
}

.diagonal-reveal {
  width: 320px;
  height: 200px;
  border-radius: 8px;

  /* 写真の代替（実案件では background-image: url('your.jpg') に差し替え） */
  background: linear-gradient(160deg,
    #87ceeb 0%, #b8dfef 40%,
    #4a7c3f 60%, #2d5a1b 100%
  );
  background-size: cover;

  /* マスク: 左上を起点に135度方向へじわっと広がる */
  -webkit-mask-image: linear-gradient(
    135deg,
    black 50%,
    rgba(0,0,0,0.3) 65%,
    transparent 80%
  );
  -webkit-mask-size: 0% 0%;
  -webkit-mask-position: 0% 0%;
  -webkit-mask-repeat: no-repeat;
  mask-image: linear-gradient(
    135deg,
    black 50%,
    rgba(0,0,0,0.3) 65%,
    transparent 80%
  );
  mask-size: 0% 0%;
  mask-position: 0% 0%;
  mask-repeat: no-repeat;
}

.diagonal-reveal.is-visible {
  animation: diagonalReveal 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}`,
        js: `// ── デモ用: 自動ループ再生 ──────────────────────
function playReveal() {
  document.querySelectorAll('.diagonal-reveal').forEach(el => {
    el.classList.remove('is-visible');
    void el.offsetWidth; // リフロー強制（クラス付け直しのため）
    el.classList.add('is-visible');
  });
}
playReveal();
setInterval(playReveal, 3500);

// ── 本番用: スクロール連動に差し替える ──────────
// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) entry.target.classList.add('is-visible');
//   });
// }, { threshold: 0.1 });
// document.querySelectorAll('.diagonal-reveal').forEach(el => observer.observe(el));`
      },
      gsap: {
        html: `<!-- 1つのdivだけ。実案件では background-image: url('your.jpg') に差し替え -->
<div class="diagonal-reveal"></div>`,
        css: `.diagonal-reveal {
  width: 320px;
  height: 200px;
  border-radius: 8px;

  /* 写真の代替（実案件では background-image: url('your.jpg') に差し替え） */
  background: linear-gradient(160deg,
    #87ceeb 0%, #b8dfef 40%,
    #4a7c3f 60%, #2d5a1b 100%
  );
  background-size: cover;

  -webkit-mask-image: linear-gradient(135deg, black 50%, rgba(0,0,0,0.3) 65%, transparent 80%);
  -webkit-mask-size: 0% 0%;
  -webkit-mask-position: 0% 0%;
  -webkit-mask-repeat: no-repeat;
  mask-image: linear-gradient(135deg, black 50%, rgba(0,0,0,0.3) 65%, transparent 80%);
  mask-size: 0% 0%;
  mask-position: 0% 0%;
  mask-repeat: no-repeat;
}`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.to(".diagonal-reveal", {
  WebkitMaskSize: "250% 250%",
  maskSize: "250% 250%",
  duration: 1.4,
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: ".diagonal-reveal",
    start: "top 80%"
  }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  // ========================================================
  // REVEAL（画像リビール）
  // ========================================================
  {
    id: "parallax-image",
    name: "Parallax Image",
    category: "scroll",
    tags: ["パララックス", "画像", "スクロール", "縦移動", "コンセプト"],
    memo: "コンテナをoverflow:hiddenでクリップし、スクロールに応じて画像がゆっくり縦移動。コンセプトセクション等に多用される",
    refUrl: "https://mizota-ks.com/",
    previewCss: `
      @keyframes parallax-prev {
        0%   { transform: translateY(12%); }
        50%  { transform: translateY(-12%); }
        100% { transform: translateY(12%); }
      }
      #prev-parallax-image .preview-el {
        overflow: hidden;
        width: 80px; height: 60px;
        border-radius: 6px;
        position: relative;
      }
      #prev-parallax-image .preview-el::before {
        content: '';
        position: absolute;
        inset: -20% 0;
        background: linear-gradient(160deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        animation: parallax-prev 3s ease-in-out infinite;
      }
    `,
    implementations: {
      css: {
        html: `<!-- コンテナで画像をクリップ -->
<div class="parallax-wrap">
  <div class="parallax-img"></div>
</div>`,
        css: `.parallax-wrap {
  overflow: hidden;
  width: 100%;
  height: 400px; /* 高さは任意 */
}

.parallax-img {
  width: 100%;
  height: 120%; /* コンテナより大きく */
  background: linear-gradient(135deg, #667eea, #764ba2);
  /* 実案件では background-image: url('your-image.jpg'); に変更 */
  background-size: cover;
  background-position: center;
  will-change: transform;
  transform: translateY(0%);
}`,
        js: `// スクロールに応じて画像をY方向に移動
const wrap = document.querySelector('.parallax-wrap');
const img  = document.querySelector('.parallax-img');

function updateParallax() {
  const rect     = wrap.getBoundingClientRect();
  const winH     = window.innerHeight;
  // セクションが画面に入った割合（-1〜1）
  const progress = (winH / 2 - rect.top - rect.height / 2) / (winH / 2 + rect.height / 2);
  const offset   = progress * 10; // 10% の移動量（大きくするほど動く）
  img.style.transform = \`translateY(\${-offset}%)\`;
}

window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();`
      },
      gsap: {
        html: `<div class="parallax-wrap">
  <div class="parallax-img"></div>
</div>`,
        css: `.parallax-wrap {
  overflow: hidden;
  width: 100%;
  height: 400px;
}

.parallax-img {
  width: 100%;
  height: 120%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-size: cover;
  background-position: center;
}`,
        js: `gsap.registerPlugin(ScrollTrigger);

gsap.to(".parallax-img", {
  yPercent: -15,           // 上に15%移動（値を大きくほど動く）
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-wrap",
    start: "top bottom",
    end: "bottom top",
    scrub: true              // スクロールに完全連動
  }
});`,
        cdn: `<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"><\/script>`
      }
    }
  },

  {
    id: "scale-in-br",
    name: "Scale In (右下から拡大)",
    category: "scroll",
    tags: ["スケール", "拡大", "右下", "Animista", "画像", "reveal"],
    memo: "右下を起点に画像が拡大して現れる。Animistaのscale-out-brの逆。",
    refUrl: "https://animista.net/",
    previewCss: `
      @keyframes scale-in-br-prev {
        0%   { transform: scale(0); transform-origin: 100% 100%; }
        60%  { transform: scale(1); transform-origin: 100% 100%; }
        80%  { transform: scale(1); transform-origin: 100% 100%; }
        100% { transform: scale(0); transform-origin: 100% 100%; }
      }
      #prev-scale-in-br .preview-el {
        border-radius: 6px;
        background: linear-gradient(160deg, #87ceeb 0%, #b8dfef 40%, #4a7c3f 60%, #2d5a1b 100%);
        animation: scale-in-br-prev 3s ease-in-out infinite;
      }
    `,
    implementations: {
      css: {
        html: `<!-- 1つのdivだけ。実案件では background-image: url('your.jpg') に差し替え -->
<div class="scale-in-br"></div>`,
        css: `@keyframes scaleInBr {
  0% {
    transform: scale(0);
    transform-origin: 100% 100%;
  }
  100% {
    transform: scale(1);
    transform-origin: 100% 100%;
  }
}

.scale-in-br {
  width: 320px;
  height: 200px;
  border-radius: 8px;

  /* 写真の代替（実案件では background-image: url('your.jpg') に差し替え） */
  background: linear-gradient(160deg,
    #87ceeb 0%, #b8dfef 40%,
    #4a7c3f 60%, #2d5a1b 100%
  );
  background-size: cover;

  transform: scale(0);
  transform-origin: 100% 100%;
}

.scale-in-br.is-visible {
  animation: scaleInBr 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}`,
        js: `function playReveal() {
  document.querySelectorAll('.scale-in-br').forEach(el => {
    el.classList.remove('is-visible');
    void el.offsetWidth;
    el.classList.add('is-visible');
  });
}
playReveal();
setInterval(playReveal, 3000);

// 本番用: スクロール連動に差し替える
// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) entry.target.classList.add('is-visible');
//   });
// }, { threshold: 0.1 });
// document.querySelectorAll('.scale-in-br').forEach(el => observer.observe(el));`
      }
    }
  },


  // ========================================================
  // HOVER ARROW REVEAL（矢印リビール）
  // ========================================================
  {
    id: "arrow-clip-wipe",
    name: "矢印 Clip-Path ワイプ",
    category: "hover",
    tags: ["矢印", "リビール", "clip-path", "ホバー", "ワイプ", "in-place"],
    memo: "clip-path: inset で矢印を下からワイプ表示。要素自体は動かない完全な in-place リビール",
    refUrl: "",
    previewCss: `
      @keyframes arr-clip-loop {
        0%, 20%  { clip-path: inset(105% 0 0 0); }
        50%, 75% { clip-path: inset(0%   0 0 0); }
        95%,100% { clip-path: inset(105% 0 0 0); }
      }
      #prev-arrow-clip-wipe .preview-el {
        width: 60px; height: 60px; border-radius: 50%;
        background: #6366f1;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
      }
      #prev-arrow-clip-wipe .preview-el::after {
        content: '→';
        font-size: 20px; color: #fff; line-height: 1;
        animation: arr-clip-loop 2.5s ease infinite;
      }
    `,
    implementations: {
      css: {
        html: `<a class="arr-clip-btn" href="#">
  <svg class="arr-clip-icon" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2.5"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</a>`,
        css: `.arr-clip-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6366f1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
}
.arr-clip-icon {
  width: 24px;
  height: 24px;
  color: #fff;
  clip-path: inset(105% 0 0 0);
  transition: clip-path 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.arr-clip-btn:hover .arr-clip-icon {
  clip-path: inset(0% 0 0 0);
}`,
        js: ``
      }
    }
  },

  {
    id: "arrow-ovf-slide",
    name: "矢印 Overflow スライドアップ",
    category: "hover",
    tags: ["矢印", "リビール", "overflow", "ホバー", "スライド"],
    memo: "overflow:hidden + translateY でボタン下端から矢印が滑り上がる",
    refUrl: "",
    previewCss: `
      @keyframes arr-ovf-loop {
        0%, 20%  { transform: translateY(150%); }
        50%, 75% { transform: translateY(0); }
        95%,100% { transform: translateY(150%); }
      }
      #prev-arrow-ovf-slide .preview-el {
        width: 60px; height: 60px; border-radius: 50%;
        background: #8b5cf6;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
      }
      #prev-arrow-ovf-slide .preview-el::after {
        content: '→';
        font-size: 20px; color: #fff; line-height: 1;
        animation: arr-ovf-loop 2.5s ease infinite;
      }
    `,
    implementations: {
      css: {
        html: `<a class="arr-ovf-btn" href="#">
  <svg class="arr-ovf-icon" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2.5"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</a>`,
        css: `.arr-ovf-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #8b5cf6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
}
.arr-ovf-icon {
  width: 24px;
  height: 24px;
  color: #fff;
  transform: translateY(150%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.arr-ovf-btn:hover .arr-ovf-icon {
  transform: translateY(0);
}`,
        js: ``
      }
    }
  },

  {
    id: "arrow-rotate-reveal",
    name: "矢印 回転 + ワイプ",
    category: "hover",
    tags: ["矢印", "リビール", "clip-path", "ホバー", "回転"],
    memo: "clip-path ワイプと同時に軽く回転。ボーダーサークルに矢印が現れる",
    refUrl: "",
    previewCss: `
      @keyframes arr-rot-loop {
        0%, 20%  { clip-path: inset(105% 0 0 0); transform: rotate(-25deg); }
        50%, 75% { clip-path: inset(0%   0 0 0); transform: rotate(0deg);   }
        95%,100% { clip-path: inset(105% 0 0 0); transform: rotate(-25deg); }
      }
      #prev-arrow-rotate-reveal .preview-el {
        width: 60px; height: 60px; border-radius: 50%;
        border: 2px solid #6366f1;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
      }
      #prev-arrow-rotate-reveal .preview-el::after {
        content: '→';
        font-size: 20px; color: #6366f1; line-height: 1;
        animation: arr-rot-loop 2.5s ease infinite;
      }
    `,
    implementations: {
      css: {
        html: `<a class="arr-rot-btn" href="#">
  <svg class="arr-rot-icon" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2.5"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</a>`,
        css: `.arr-rot-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #6366f1;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
}
.arr-rot-icon {
  width: 24px;
  height: 24px;
  color: #6366f1;
  clip-path: inset(105% 0 0 0);
  transform: rotate(-25deg);
  transition:
    clip-path 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    transform  0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.arr-rot-btn:hover .arr-rot-icon {
  clip-path: inset(0% 0 0 0);
  transform: rotate(0deg);
}`,
        js: ``
      }
    }
  },

  {
    id: "arrow-swap-text",
    name: "矢印 テキストスワップ",
    category: "hover",
    tags: ["矢印", "リビール", "overflow", "ホバー", "テキスト", "CTA", "スワップ"],
    memo: "ホバーでテキストが上に消え、下から矢印が現れる。CTA ボタンに最適",
    refUrl: "",
    previewCss: `
      @keyframes arr-swap-txt {
        0%, 20%  { transform: translateY(0);     opacity: 1; }
        50%, 75% { transform: translateY(-180%); opacity: 0; }
        95%,100% { transform: translateY(0);     opacity: 1; }
      }
      @keyframes arr-swap-icn {
        0%, 20%  { transform: translateY(180%); }
        50%, 75% { transform: translateY(0);    }
        95%,100% { transform: translateY(180%); }
      }
      #prev-arrow-swap-text .preview-el {
        position: relative;
        padding: 0 20px; height: 40px; border-radius: 999px;
        background: #6366f1;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden;
        font-size: 13px; font-weight: 600; color: #fff;
      }
      #prev-arrow-swap-text .preview-el::before {
        content: 'View All';
        animation: arr-swap-txt 2.5s ease infinite;
      }
      #prev-arrow-swap-text .preview-el::after {
        content: '→';
        position: absolute;
        font-size: 18px;
        animation: arr-swap-icn 2.5s ease infinite;
      }
    `,
    implementations: {
      css: {
        html: `<a class="arr-swap-btn" href="#">
  <span class="arr-swap-label">View All</span>
  <span class="arr-swap-icon">→</span>
</a>`,
        css: `.arr-swap-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  border-radius: 999px;
  background: #6366f1;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  overflow: hidden;
}
.arr-swap-label {
  transition: transform 0.35s ease, opacity 0.35s ease;
}
.arr-swap-icon {
  position: absolute;
  font-size: 20px;
  transform: translateY(180%);
  transition: transform 0.35s ease;
}
.arr-swap-btn:hover .arr-swap-label {
  transform: translateY(-180%);
  opacity: 0;
}
.arr-swap-btn:hover .arr-swap-icon {
  transform: translateY(0);
}`,
        js: ``
      }
    }
  },

  // ========================================================
  // CUSTOM（カスタム追加分）
  // ========================================================
  {
    "id": "custom-1771934910892-a10n2",
    "name": "① シンプル版【まずはここから】",
    "category": "scroll",
    "tags": ["AOS.js", "フェード", "基本"],
    "memo": "AOS.jsの基本機能（fade, duration, delay, once）を網羅した最小構成のサンプル。",
    "refUrl": "",
    "previewCss": "@keyframes ap-custom-1771934910892-a10n2{0%,100%{opacity:0}20%,80%{opacity:1}}#prev-custom-1771934910892-a10n2 .preview-el{animation:ap-custom-1771934910892-a10n2 2.5s ease infinite;}",
    "implementations": {
      "aos": {
        "html": "<div class=\"container\">\n  <h1>AOS.js シンプル版</h1>\n\n  <!-- 基本的なフェードイン（data-aos=\"fade\"のみ） -->\n  <div class=\"box\" data-aos=\"fade\">\n    <h2>基本フェード</h2>\n    <p>data-aos=\"fade\" を指定するだけで、スクロール時にフェードイン表示されます。これがAOS.jsの最もシンプルな使い方です。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <!-- 持続時間を指定（data-aos-duration） -->\n  <div class=\"box\" data-aos=\"fade\" data-aos-duration=\"1000\">\n    <h2>持続時間の指定</h2>\n    <p>data-aos-duration=\"1000\" で1秒かけてフェードイン。持続時間は50〜3000ミリ秒で指定できます。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <!-- 遅延を指定（data-aos-delay） -->\n  <div class=\"box\" data-aos=\"fade\" data-aos-duration=\"800\" data-aos-delay=\"200\">\n    <h2>遅延の指定</h2>\n    <p>data-aos-delay=\"200\" で0.2秒遅らせて開始。要素を順次表示する際に便利です。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <!-- 1回のみ実行（data-aos-once） -->\n  <div class=\"box\" data-aos=\"fade\" data-aos-duration=\"800\" data-aos-once=\"true\">\n    <h2>1回のみ実行</h2>\n    <p>data-aos-once=\"true\" で、スクロールで1回だけアニメーション実行。デフォルトは何度でも実行されます。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n</div>",
        "css": "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\nbody {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 60px 20px 40px;\n}\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n}\nh1 {\n  text-align: center;\n  color: white;\n  font-size: 48px;\n  margin-bottom: 60px;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n.box {\n  background: white;\n  padding: 40px;\n  margin-bottom: 40px;\n  border-radius: 12px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}\n.box h2 {\n  color: #667eea;\n  margin-bottom: 15px;\n  font-size: 28px;\n}\n.box p {\n  color: #666;\n  line-height: 1.8;\n  font-size: 16px;\n}\n.spacer {\n  height: 100vh;\n}",
        "js": "// AOS初期化（最小限の設定）\nAOS.init({\n  duration: 800,  // デフォルト持続時間\n  once: false,    // 何度でも実行（スクロールで繰り返し）\n  offset: 120     // トリガーオフセット（要素が画面に入る位置）\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css\" />\n<script src=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771934910893-qcn21",
    "name": "② フェードエフェクト集",
    "category": "scroll",
    "tags": ["AOS.js", "フェード", "方向指定"],
    "memo": "上下左右（up, down, left, right）の4方向からのフェードイン演出のバリエーション。",
    "refUrl": "",
    "previewCss": "@keyframes ap-custom-1771934910893-qcn21{0%,100%{opacity:0;transform:translateY(16px)}20%,80%{opacity:1;transform:translateY(0)}}#prev-custom-1771934910893-qcn21 .preview-el{animation:ap-custom-1771934910893-qcn21 2.5s ease infinite;}",
    "implementations": {
      "aos": {
        "html": "<div class=\"container\">\n  <h1>フェードエフェクト集</h1>\n\n  <div class=\"box\" data-aos=\"fade-up\">\n    <h2>↑ Fade Up</h2>\n    <p>下から上へフェードイン。最もよく使われるエフェクトです。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <div class=\"box\" data-aos=\"fade-down\">\n    <h2>↓ Fade Down</h2>\n    <p>上から下へフェードイン。見出しやヘッダー要素に適しています。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <div class=\"box\" data-aos=\"fade-left\">\n    <h2>← Fade Left</h2>\n    <p>右から左へフェードイン。画像とテキストを組み合わせる際に効果的です。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <div class=\"box\" data-aos=\"fade-right\">\n    <h2>→ Fade Right</h2>\n    <p>左から右へフェードイン。交互に表示する際に使います。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n</div>",
        "css": "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\nbody {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);\n  padding: 60px 20px 40px;\n}\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n}\nh1 {\n  text-align: center;\n  color: white;\n  font-size: 48px;\n  margin-bottom: 60px;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n.box {\n  background: white;\n  padding: 40px;\n  margin-bottom: 40px;\n  border-radius: 12px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}\n.box h2 {\n  color: #f5576c;\n  margin-bottom: 15px;\n  font-size: 28px;\n}\n.box p {\n  color: #666;\n  line-height: 1.8;\n  font-size: 16px;\n}\n.spacer {\n  height: 100vh;\n}",
        "js": "AOS.init({\n  duration: 1000,\n  once: false,\n  offset: 120\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css\" />\n<script src=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771934910893-ust09",
    "name": "③ スライドエフェクト集",
    "category": "scroll",
    "tags": ["AOS.js", "スライド", "ズーム", "フリップ"],
    "memo": "slide, zoom, flipといった、フェードよりも動きが大きく注目を集めやすいエフェクト集。",
    "refUrl": "",
    "previewCss": "@keyframes ap-custom-1771934910893-ust09{0%,100%{opacity:0.3;transform:translateY(24px)}20%,80%{opacity:1;transform:translateY(0)}}#prev-custom-1771934910893-ust09 .preview-el{animation:ap-custom-1771934910893-ust09 2.5s ease infinite;}",
    "implementations": {
      "aos": {
        "html": "<div class=\"container\">\n  <h1>スライドエフェクト集</h1>\n\n  <div class=\"box\" data-aos=\"slide-up\">\n    <h2>⬆ Slide Up</h2>\n    <p>下からスライドイン。フェードより動きが大きく目立ちます。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <div class=\"box\" data-aos=\"slide-down\">\n    <h2>⬇ Slide Down</h2>\n    <p>上からスライドイン。ドロップダウン風の演出に。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <div class=\"box\" data-aos=\"zoom-in\">\n    <h2>🔍 Zoom In</h2>\n    <p>ズームイン。注目を集めたい要素に使います。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <div class=\"box\" data-aos=\"flip-left\">\n    <h2>🔄 Flip Left</h2>\n    <p>左回転。派手な演出が必要な場合に。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n</div>",
        "css": "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\nbody {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background: linear-gradient(135deg, #4bc0c8 0%, #c779d0 100%);\n  padding: 60px 20px 40px;\n}\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n}\nh1 {\n  text-align: center;\n  color: white;\n  font-size: 48px;\n  margin-bottom: 60px;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n.box {\n  background: white;\n  padding: 40px;\n  margin-bottom: 40px;\n  border-radius: 12px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}\n.box h2 {\n  color: #4bc0c8;\n  margin-bottom: 15px;\n  font-size: 28px;\n}\n.box p {\n  color: #666;\n  line-height: 1.8;\n  font-size: 16px;\n}\n.spacer {\n  height: 100vh;\n}",
        "js": "AOS.init({\n  duration: 1200,\n  once: false,\n  offset: 120\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css\" />\n<script src=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771934910893-h9ck3",
    "name": "④ 多機能版【応用例】",
    "category": "scroll",
    "tags": ["AOS.js", "カードレイアウト", "順次表示", "イージング"],
    "memo": "カードのスタッガー表示（遅延実行）やイージングのカスタマイズを組み合わせた実戦的なパターン。",
    "refUrl": "",
    "previewCss": "@keyframes ap-custom-1771934910893-h9ck3{0%,100%{opacity:0;transform:scale(0.6)}20%,80%{opacity:1;transform:scale(1)}}#prev-custom-1771934910893-h9ck3 .preview-el{animation:ap-custom-1771934910893-h9ck3 2.5s ease infinite;}",
    "implementations": {
      "aos": {
        "html": "<div class=\"container\">\n  <h1 data-aos=\"zoom-in\" data-aos-duration=\"1000\">AOS.js 多機能版</h1>\n\n  <p class=\"subtitle\" data-aos=\"fade-up\" data-aos-delay=\"300\">\n    複数のエフェクトとオプションを組み合わせた応用例\n  </p>\n\n  <div class=\"spacer\"></div>\n\n  <h2 class=\"section-title\" data-aos=\"fade-down\">カード一覧（順次表示）</h2>\n\n  <div class=\"card-grid\">\n    <div class=\"card\" data-aos=\"fade-up\" data-aos-delay=\"0\">\n      <h3>カード 1</h3>\n      <p>遅延0ms。最初に表示されます。</p>\n    </div>\n    <div class=\"card\" data-aos=\"fade-up\" data-aos-delay=\"100\">\n      <h3>カード 2</h3>\n      <p>遅延100ms。少し遅れて表示。</p>\n    </div>\n    <div class=\"card\" data-aos=\"fade-up\" data-aos-delay=\"200\">\n      <h3>カード 3</h3>\n      <p>遅延200ms。順次表示の完成。</p>\n    </div>\n  </div>\n\n  <div class=\"spacer\"></div>\n\n  <h2 class=\"section-title\" data-aos=\"fade-down\">イージングのカスタマイズ</h2>\n\n  <div class=\"box\" data-aos=\"fade-right\" data-aos-easing=\"linear\">\n    <h3>Linear</h3>\n    <p>一定速度で動きます。</p>\n  </div>\n\n  <div class=\"spacer-small\"></div>\n\n  <div class=\"box\" data-aos=\"fade-right\" data-aos-easing=\"ease-in-out\">\n    <h3>Ease In Out</h3>\n    <p>ゆっくり始まり、ゆっくり終わります。</p>\n  </div>\n\n  <div class=\"spacer\"></div>\n</div>",
        "css": "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\nbody {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background: linear-gradient(135deg, #feac5e 0%, #c779d0 50%, #4bc0c8 100%);\n  padding: 60px 20px 40px;\n}\n.container {\n  max-width: 1000px;\n  margin: 0 auto;\n}\nh1 {\n  text-align: center;\n  color: white;\n  font-size: 48px;\n  margin-bottom: 20px;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n.subtitle {\n  text-align: center;\n  color: white;\n  font-size: 18px;\n  margin-bottom: 60px;\n}\n.section-title {\n  text-align: center;\n  color: white;\n  font-size: 32px;\n  margin-bottom: 40px;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 30px;\n  margin-bottom: 40px;\n}\n.card {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}\n.card h3 {\n  color: #feac5e;\n  margin-bottom: 15px;\n  font-size: 24px;\n}\n.card p {\n  color: #666;\n  line-height: 1.6;\n}\n.box {\n  background: white;\n  padding: 30px;\n  border-radius: 12px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.2);\n}\n.box h3 {\n  color: #c779d0;\n  margin-bottom: 10px;\n  font-size: 24px;\n}\n.box p {\n  color: #666;\n  line-height: 1.6;\n}\n.spacer {\n  height: 100vh;\n}\n.spacer-small {\n  height: 30px;\n}",
        "js": "AOS.init({\n  duration: 800,\n  once: false,\n  offset: 120,\n  easing: 'ease-out-cubic'\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.css\" />\n<script src=\"https://unpkg.com/aos@3.0.0-beta.6/dist/aos.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-wwkwd",
    "name": "ShuffleText.js 基本実装",
    "category": "loading",
    "tags": ["ShuffleText.js", "基本", "テキストアニメーション"],
    "memo": "文字がランダムに変化してから指定したテキストに収束する、ShuffleText.jsの最も基本的な実装です。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<!-- アニメーション対象 -->\n<h1 class=\"shuffle-target\">WELCOME</h1>",
        "css": "",
        "js": "// 基本的な使い方\nconst element = document.querySelector('.shuffle-target');\nconst shuffle = new ShuffleText(element);\n\n// アニメーション開始\nshuffle.start();\n\n// テキスト変更してアニメーション\nshuffle.setText('NEW TEXT');",
        "cdn": "<!-- shuffle-text v0.5.1 -->\n<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-10ym9",
    "name": "ShuffleText.js 主要オプション設定",
    "category": "loading",
    "tags": ["ShuffleText.js", "オプション", "カスタマイズ"],
    "memo": "速度(duration)、フレームレート(fps)、使用文字(sourceRandomCharacter)などの詳細な設定例です。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<h1 class=\"shuffle-target\">WELCOME</h1>",
        "css": "",
        "js": "const element = document.querySelector('.shuffle-target');\nconst shuffle = new ShuffleText(element);\n\n// ★ 主要プロパティ\nshuffle.duration = 600;              // アニメーション時間(ms)\nshuffle.fps = 30;                    // フレームレート\nshuffle.emptyCharacter = '-';        // 空白文字\nshuffle.sourceRandomCharacter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // ランダム文字\n\nshuffle.start();",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-mtsx4",
    "name": "実用例1: ページ読み込み時の自動実行",
    "category": "loading",
    "tags": ["ローディング", "自動実行", "DOMContentLoaded"],
    "memo": "ページが読み込まれた瞬間にタイトルをシャッフルさせながら表示する演出です。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<h1 class=\"title\">LOADING...</h1>",
        "css": "",
        "js": "window.addEventListener('DOMContentLoaded', () => {\n    const title = document.querySelector('.title');\n    const shuffle = new ShuffleText(title);\n\n    shuffle.duration = 800;\n    shuffle.start();\n});",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-l17q8",
    "name": "実用例2: クリックでテキスト変更",
    "category": "hover",
    "tags": ["インタラクティブ", "テキスト切り替え", "ボタン"],
    "memo": "ボタンをクリックするたびに、配列に用意した複数のテキストをシャッフルしながら切り替えます。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<h1 class=\"click-text\">Click Me!</h1>\n<button id=\"changeBtn\">テキスト変更</button>",
        "css": "",
        "js": "const text = document.querySelector('.click-text');\nconst shuffle = new ShuffleText(text);\nconst btn = document.getElementById('changeBtn');\n\nconst messages = ['HELLO!', 'WELCOME!', 'NICE!', 'COOL!'];\nlet index = 0;\n\nbtn.addEventListener('click', () => {\n    index = (index + 1) % messages.length;\n    shuffle.setText(messages[index]);\n});",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-825dr",
    "name": "実用例3: 数字カウントアップ風",
    "category": "loading",
    "tags": ["カウンター", "数字", "setInterval"],
    "memo": "ランダム文字を数字のみに限定することで、データが更新されているようなカウントアップ演出を行います。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"counter\">0</div>",
        "css": "",
        "js": "const counter = document.querySelector('.counter');\nconst shuffle = new ShuffleText(counter);\n\nshuffle.sourceRandomCharacter = '0123456789'; // 数字のみ\nshuffle.duration = 1000;\n\nlet count = 0;\nsetInterval(() => {\n    count += 10;\n    shuffle.setText(count.toString());\n}, 2000);",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-3bmuz",
    "name": "実用例4: ハッカー風UI",
    "category": "loading",
    "tags": ["サイバーパンク", "ハッカー風", "タイポグラフィ"],
    "memo": "黒背景に緑の等幅フォントと記号混じりのシャッフルを組み合わせ、システム端末のような世界観を演出します。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"hacker-text\">SYSTEM INITIALIZED</div>",
        "css": ".hacker-text {\n    font-family: 'Courier New', monospace;\n    color: #00ff00;\n    background: #000;\n    padding: 20px;\n    font-size: 24px;\n    letter-spacing: 2px;\n}",
        "js": "const hacker = document.querySelector('.hacker-text');\nconst shuffle = new ShuffleText(hacker);\n\nshuffle.sourceRandomCharacter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';\nshuffle.duration = 1200;\nshuffle.fps = 20;\n\nconst commands = [\n    'SYSTEM INITIALIZED',\n    'CONNECTING TO SERVER',\n    'ACCESS GRANTED',\n    'DATA TRANSFER COMPLETE'\n];\n\nlet i = 0;\nsetInterval(() => {\n    i = (i + 1) % commands.length;\n    shuffle.setText(commands[i]);\n}, 3000);",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-wj1n4",
    "name": "イベントリスナー付き実装",
    "category": "loading",
    "tags": ["コールバック", "イベントリスナー", "完了時処理"],
    "memo": "アニメーションが完了したタイミングで特定の処理（ログ出力や次の演出など）を実行します。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<h1 class=\"shuffle-target\">WELCOME</h1>",
        "css": "",
        "js": "const element = document.querySelector('.shuffle-target');\nconst shuffle = new ShuffleText(element);\n\n// ★ アニメーション完了時の処理\nshuffle.addEventListener('complete', () => {\n    console.log('アニメーション完了！');\n});\n\nshuffle.start();",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771943022322-r7san",
    "name": "複数要素に一括適用",
    "category": "loading",
    "tags": ["一括処理", "遅延実行", "setTimeout"],
    "memo": "複数の要素に対して、setTimeoutを用いて時間をずらしながら順番にシャッフルアニメーションを適用します。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<h2 class=\"shuffle\">Title 1</h2>\n<h2 class=\"shuffle\">Title 2</h2>\n<h2 class=\"shuffle\">Title 3</h2>",
        "css": "",
        "js": "const elements = document.querySelectorAll('.shuffle');\n\nelements.forEach((el, index) => {\n    const shuffle = new ShuffleText(el);\n    shuffle.duration = 600;\n\n    // 順番に実行（遅延付き）\n    setTimeout(() => {\n        shuffle.start();\n    }, index * 200);\n});",
        "cdn": "<script src=\"https://unpkg.com/shuffle-text@0.5.1/build/shuffle-text.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771945122538-vcx3y",
    "name": "シャボン玉が動くアニメーション",
    "category": "loading",
    "tags": ["背景アニメーション", "無限ループ", "CSSアニメーション"],
    "memo": "背景画像が斜め方向に無限にループして流れるアニメーションです。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "css": {
        "html": "<div id=\"school_overview\">\n</div>",
        "css": "#school_overview {\n  width: 100%;\n  padding: 5rem 0 10rem 0;\n  background-image: url(\"../img/bg.gif\");\n  background-size: 75rem 75rem;\n  background-repeat: repeat;\n  margin-bottom: 10rem;\n  animation: fall 10s infinite linear;\n}\n\n@keyframes fall {\n  0% {\n    background-position: 0 0;\n  }\n  100% {\n    background-position: -70rem 70rem;\n  }\n}",
        "js": "",
        "cdn": ""
      }
    }
  },
  {
    "id": "custom-1771955826128-cq60m",
    "name": "シャボン玉が動くアニメーション（詳細版）",
    "category": "loading",
    "tags": ["背景アニメーション", "ループ", "CSS"],
    "memo": "背景画像のポジションを一定方向にループ移動させることで、シャボン玉が浮遊しているような視覚効果を与えます。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "css": {
        "html": "<div id=\"school_overview\">\n  <!-- コンテンツ -->\n</div>",
        "css": "#school_overview {\n  width: 100%;\n  padding: 5rem 0 10rem 0;\n  background-image: url(\"../img/bg.gif\");\n  background-size: 75rem 75rem;\n  background-repeat: repeat;\n  margin-bottom: 10rem;\n  animation: fall 10s infinite linear;\n}\n\n@keyframes fall {\n  0% {\n    background-position: 0 0;\n  }\n  100% {\n    background-position: -70rem 70rem;\n  }\n}",
        "js": "",
        "cdn": ""
      }
    }
  },
  {
    "id": "custom-1771958014830-55hgz",
    "name": "コーナーボーダーボタン",
    "category": "hover",
    "tags": ["ボタン", "ボーダー", "ホバーエフェクト"],
    "memo": "ホバーすると四隅のボーダーが伸びて枠線が完成するアニメーションです。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "css": {
        "html": "<a href=\"#\" class=\"btn-corner\">Read More</a>",
        "css": ".btn-corner {\n  display: block;\n  position: relative;\n  width: 100px;\n  height: 100px;\n  color: black;\n  overflow: hidden;\n}\n\n.btn-corner::before,\n.btn-corner::after {\n  content: \"\";\n  position: absolute;\n  width: 50px;\n  height: 50px;\n  transition: all 0.8s ease;\n  box-sizing: border-box;\n}\n\n/* 左上コーナー ┌ */\n.btn-corner::before {\n  top: 0;\n  left: 0;\n  border-top: 1px solid black;\n  border-left: 1px solid black;\n}\n\n/* 右下コーナー ┘ */\n.btn-corner::after {\n  bottom: 0;\n  right: 0;\n  border-bottom: 1px solid black;\n  border-right: 1px solid black;\n}\n\n/* ホバーで全辺に伸びる */\n.btn-corner:hover::before,\n.btn-corner:hover::after {\n  width: 100%;\n  height: 100%;\n}",
        "js": "",
        "cdn": ""
      }
    }
  },
  {
    "id": "custom-1771958952430-76x4u",
    "name": "mainvisual ３つの花の画像あり。スクロールでPC拡大/SP縮小",
    "category": "scroll",
    "tags": ["メインビジュアル", "スクロール連動", "レスポンシブ", "画像拡大", "画像縮小"],
    "memo": "スクロール量に応じて画像サイズを動的に変更する演出。PCでは拡大、SPでは縮小するレスポンシブな挙動を実装しています。",
    "refUrl": "",
    "previewCss": "@keyframes img-expand {\n  0%, 20%  { background: linear-gradient(90deg, #6366f1 33%, #8b5cf6 33% 66%, #ec4899 66%); width: 80%; }\n  50%, 70% { background: linear-gradient(90deg, #6366f1 45%, #8b5cf6 45% 70%, #ec4899 70%); width: 95%; }\n  90%,100% { background: linear-gradient(90deg, #6366f1 33%, #8b5cf6 33% 66%, #ec4899 66%); width: 80%; }\n}\n.preview-el {\n  animation: img-expand 2.5s ease-in-out infinite;\n  height: 80%;\n  border-radius: 3px;\n}",
    "implementations": {
      "gsap": {
        "html": "<section id=\"mainvisual\">\n  <div class=\"mainvisual_imgwrapper\">\n    <img class=\"mainvisual_img\" src=\"img/mainvisual1.jpg\" alt=\"鮮やかな花1\" />\n    <img class=\"mainvisual_img\" src=\"img/mainvisual2.jpg\" alt=\"鮮やかな花2\" />\n    <img class=\"mainvisual_img\" src=\"img/mainvisual3.jpg\" alt=\"鮮やかな花3\" />\n  </div>\n</section>",
        "css": "#mainvisual {\n  width: 100%;\n  height: 100vh;\n}\n\n.mainvisual_imgwrapper {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.mainvisual_img {\n  width: 33%;\n  height: 100vh;\n  transition: transform 0.5s ease;\n}",
        "js": "// メインビジュアル画像のスクロール連動拡大・縮小\n$(window).on(\"scroll\", function () {\n  const scrollTop = $(this).scrollTop();\n\n  // PC表示（900px以上）: スクロールで拡大\n  if (window.innerWidth >= 900) {\n    const newWidth = 33 + (scrollTop / 500) * 20;\n    const maxWidth = 70;\n    $(\".mainvisual_img\").css(\"width\", Math.min(newWidth, maxWidth) + \"%\");\n  }\n  // SP表示（900px未満）: スクロールで縮小\n  else {\n    const newWidth = 100 - (scrollTop / 300) * 30;\n    const minWidth = 70;\n    $(\".mainvisual_img\").css(\"width\", Math.max(newWidth, minWidth) + \"%\");\n  }\n});",
        "cdn": "<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771959337879-w65wv",
    "name": "① フェードエフェクト【シンプル版】",
    "category": "scroll",
    "tags": ["Swiper", "フェード", "シンプル"],
    "memo": "Swiper.jsの基本機能のみを使用した、最小限の構成のフェードスライダー。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"swiper\">\n  <div class=\"swiper-wrapper\">\n    <div class=\"swiper-slide\"><img src=\"https://placehold.co/1920x1080/667EEA/FFF?text=Slide+1\" alt=\"スライド1\"></div>\n    <div class=\"swiper-slide\"><img src=\"https://placehold.co/1920x1080/F093FB/FFF?text=Slide+2\" alt=\"スライド2\"></div>\n    <div class=\"swiper-slide\"><img src=\"https://placehold.co/1920x1080/4BC0C8/FFF?text=Slide+3\" alt=\"スライド3\"></div>\n    <div class=\"swiper-slide\"><img src=\"https://placehold.co/1920x1080/FEAC5E/333?text=Slide+4\" alt=\"スライド4\"></div>\n  </div>\n  <div class=\"swiper-button-next\"></div>\n  <div class=\"swiper-button-prev\"></div>\n  <div class=\"swiper-pagination\"></div>\n</div>",
        "css": "body { margin: 0; padding: 0; font-family: Arial, sans-serif; }\n.swiper { width: 100%; height: 100vh; }\n.swiper-slide {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 48px;\n  color: white;\n  background: #333;\n}\n.swiper-slide img { width: 100%; height: 100%; object-fit: cover; }",
        "js": "const swiper = new Swiper('.swiper', {\n  effect: 'fade',\n  fadeEffect: { crossFade: true },\n  speed: 1000,\n  loop: true,\n  autoplay: { delay: 4000, disableOnInteraction: false },\n  pagination: { el: '.swiper-pagination', clickable: true },\n  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css\">\n<script src=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771959337879-lm4x5",
    "name": "② サムネイル付きスライダー",
    "category": "scroll",
    "tags": ["Swiper", "サムネイル", "ギャラリー"],
    "memo": "メインスライダーとサムネイルを連動させた、ECサイトや商品紹介に最適な構成。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"container\">\n  <h1>🥇 サムネイル付きスライダー</h1>\n  <div class=\"swiper swiper-main\">\n    <div class=\"swiper-wrapper\">\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/800x400/4A90E2/FFF?text=Product+1\" alt=\"商品1\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/800x400/E24A4A/FFF?text=Product+2\" alt=\"商品2\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/800x400/4AE290/FFF?text=Product+3\" alt=\"商品3\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/800x400/E2D44A/FFF?text=Product+4\" alt=\"商品4\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/800x400/9B4AE2/FFF?text=Product+5\" alt=\"商品5\"></div>\n    </div>\n    <div class=\"swiper-button-next\"></div>\n    <div class=\"swiper-button-prev\"></div>\n  </div>\n  <div class=\"swiper swiper-thumbs\">\n    <div class=\"swiper-wrapper\">\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/100x80/4A90E2/FFF?text=1\" alt=\"サムネイル1\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/100x80/E24A4A/FFF?text=2\" alt=\"サムネイル2\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/100x80/4AE290/FFF?text=3\" alt=\"サムネイル3\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/100x80/E2D44A/FFF?text=4\" alt=\"サムネイル4\"></div>\n      <div class=\"swiper-slide\"><img src=\"https://placehold.co/100x80/9B4AE2/FFF?text=5\" alt=\"サムネイル5\"></div>\n    </div>\n  </div>\n</div>",
        "css": "body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }\n.container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }\nh1 { text-align: center; color: #333; margin-bottom: 30px; }\n.swiper-main { margin-bottom: 10px; }\n.swiper-main .swiper-slide { height: 400px; background: #ddd; display: flex; align-items: center; justify-content: center; }\n.swiper-main .swiper-slide img { width: 100%; height: 100%; object-fit: cover; }\n.swiper-thumbs { height: 100px; box-sizing: border-box; padding: 10px 0; }\n.swiper-thumbs .swiper-slide { height: 80px; opacity: 0.4; cursor: pointer; transition: opacity 0.3s; }\n.swiper-thumbs .swiper-slide-thumb-active { opacity: 1; border: 2px solid #007aff; }\n.swiper-thumbs .swiper-slide img { width: 100%; height: 100%; object-fit: cover; }",
        "js": "const swiperThumbs = new Swiper('.swiper-thumbs', {\n  spaceBetween: 10,\n  slidesPerView: 4,\n  freeMode: true,\n  watchSlidesProgress: true,\n});\n\nconst swiperMain = new Swiper('.swiper-main', {\n  spaceBetween: 10,\n  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },\n  thumbs: { swiper: swiperThumbs },\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css\">\n<script src=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771959337879-l1f3p",
    "name": "③ 自動再生 + プログレスバー",
    "category": "scroll",
    "tags": ["Swiper", "自動再生", "プログレスバー"],
    "memo": "自動再生の残り時間をプログレスバーで可視化し、一時停止/再生機能を追加したヒーローバナー向け構成。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"hero-container\">\n  <div class=\"swiper\">\n    <div class=\"swiper-wrapper\">\n      <div class=\"swiper-slide\">\n        <img src=\"https://placehold.co/1920x1080/FF6B6B/FFF?text=Campaign+1\" alt=\"キャンペーン1\">\n        <div class=\"slide-content\"><h2>春の新作コレクション</h2><p>最大50% OFF セール開催中</p></div>\n      </div>\n      <div class=\"swiper-slide\">\n        <img src=\"https://placehold.co/1920x1080/4ECDC4/FFF?text=Campaign+2\" alt=\"キャンペーン2\">\n        <div class=\"slide-content\"><h2>限定アイテム入荷</h2><p>数量限定！お早めに</p></div>\n      </div>\n      <div class=\"swiper-slide\">\n        <img src=\"https://placehold.co/1920x1080/FFE66D/333?text=Campaign+3\" alt=\"キャンペーン3\">\n        <div class=\"slide-content\"><h2>会員登録で10%OFF</h2><p>今すぐ登録してお得にお買い物</p></div>\n      </div>\n    </div>\n    <div class=\"swiper-button-next\"></div>\n    <div class=\"swiper-button-prev\"></div>\n    <div class=\"swiper-pagination\"></div>\n  </div>\n  <div class=\"autoplay-progress\"><div class=\"autoplay-progress-fill\"></div></div>\n  <button class=\"play-pause\">⏸ 一時停止</button>\n</div>",
        "css": "body { margin: 0; padding: 0; font-family: Arial, sans-serif; }\n.hero-container { position: relative; width: 100%; height: 100vh; overflow: hidden; }\n.swiper { width: 100%; height: 100%; }\n.swiper-slide { display: flex; align-items: center; justify-content: center; position: relative; background: #000; }\n.swiper-slide img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }\n.slide-content { position: absolute; text-align: center; color: white; z-index: 10; }\n.slide-content h2 { font-size: 48px; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }\n.slide-content p { font-size: 24px; margin: 0; }\n.autoplay-progress { position: absolute; left: 0; bottom: 0; z-index: 10; width: 100%; height: 4px; background: rgba(255,255,255,0.3); }\n.autoplay-progress-fill { height: 100%; background: #007aff; width: 0; transition: width 0.1s linear; }\n.play-pause { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 20; background: rgba(0,0,0,0.5); color: white; border: 2px solid white; padding: 10px 20px; cursor: pointer; font-size: 16px; border-radius: 5px; }",
        "js": "const progressFill = document.querySelector('.autoplay-progress-fill');\nconst playPauseBtn = document.querySelector('.play-pause');\n\nconst swiper = new Swiper('.swiper', {\n  spaceBetween: 0,\n  loop: true,\n  autoplay: { delay: 5000, disableOnInteraction: false },\n  pagination: { el: '.swiper-pagination', clickable: true },\n  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },\n  on: {\n    autoplayTimeLeft(s, time, progress) {\n      progressFill.style.width = (1 - progress) * 100 + '%';\n    },\n  },\n});\n\nlet isPlaying = true;\nplayPauseBtn.addEventListener('click', () => {\n  if (isPlaying) {\n    swiper.autoplay.stop();\n    playPauseBtn.textContent = '▶ 再生';\n  } else {\n    swiper.autoplay.start();\n    playPauseBtn.textContent = '⏸ 一時停止';\n  }\n  isPlaying = !isPlaying;\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css\">\n<script src=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771959337879-wisay",
    "name": "④ フェードエフェクト【多機能版】",
    "category": "scroll",
    "tags": ["Swiper", "フェード", "アニメーション", "多機能"],
    "memo": "フェード効果に加えて、CSSアニメーションによるテキストの浮き上がりやカスタムデザインを施した応用例。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"swiper\">\n  <div class=\"swiper-wrapper\">\n    <div class=\"swiper-slide\">\n      <img src=\"https://placehold.co/1920x1080/667EEA/FFF?text=Nature+Scene+1\" alt=\"自然風景1\">\n      <div class=\"slide-overlay\"></div>\n      <div class=\"slide-content\"><h2>美しい自然</h2><p>心安らぐ風景をお届けします</p><a href=\"#\" class=\"btn\">詳しく見る</a></div>\n    </div>\n    <div class=\"swiper-slide\">\n      <img src=\"https://placehold.co/1920x1080/F093FB/FFF?text=Nature+Scene+2\" alt=\"自然風景2\">\n      <div class=\"slide-overlay\"></div>\n      <div class=\"slide-content\"><h2>四季の移ろい</h2><p>季節ごとの魅力を感じて</p><a href=\"#\" class=\"btn\">詳しく見る</a></div>\n    </div>\n    <div class=\"swiper-slide\">\n      <img src=\"https://placehold.co/1920x1080/4BC0C8/FFF?text=Nature+Scene+3\" alt=\"自然風景3\">\n      <div class=\"slide-overlay\"></div>\n      <div class=\"slide-content\"><h2>癒しの空間</h2><p>特別なひとときを</p><a href=\"#\" class=\"btn\">詳しく見る</a></div>\n    </div>\n  </div>\n  <div class=\"swiper-button-next\"></div>\n  <div class=\"swiper-button-prev\"></div>\n  <div class=\"swiper-pagination\"></div>\n</div>",
        "css": "body { margin: 0; padding: 0; font-family: Arial, sans-serif; overflow: hidden; }\n.swiper { width: 100%; height: 100vh; }\n.swiper-slide { display: flex; align-items: center; justify-content: center; position: relative; }\n.swiper-slide img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }\n.slide-overlay { position: absolute; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 1; }\n.slide-content { position: relative; z-index: 2; text-align: center; color: white; padding: 40px; animation: fadeInUp 1s ease-out; }\n.slide-content h2 { font-size: 56px; margin: 0 0 20px 0; font-weight: bold; text-shadow: 2px 2px 8px rgba(0,0,0,0.5); }\n.slide-content p { font-size: 24px; margin: 0 0 30px 0; }\n.slide-content .btn { display: inline-block; padding: 15px 40px; background: #007aff; color: white; text-decoration: none; border-radius: 50px; font-size: 18px; }\n@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }\n.swiper-pagination-bullet { width: 50px; height: 4px; border-radius: 2px; background: white; opacity: 0.5; }\n.swiper-pagination-bullet-active { opacity: 1; width: 80px; background: #007aff; }",
        "js": "const swiper = new Swiper('.swiper', {\n  effect: 'fade',\n  fadeEffect: { crossFade: true },\n  speed: 1000,\n  loop: true,\n  autoplay: { delay: 4000, disableOnInteraction: false },\n  pagination: { el: '.swiper-pagination', clickable: true },\n  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },\n});",
        "cdn": "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css\">\n<script src=\"https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771960853451-9holj",
    "name": "Slickレスポンシブスライダー",
    "category": "scroll",
    "tags": ["slick", "slider", "responsive", "jquery"],
    "memo": "slidesToShow: 3で3枚表示し、centerPaddingで隣の画像をチラ見せさせる設定。レスポンシブ対応。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "gsap": {
        "html": "<div class=\"slider\">\n  <img src=\"https://placehold.jp/800x600.png?text=Image1\" alt=\"\">\n  <img src=\"https://placehold.jp/800x600.png?text=Image2\" alt=\"\">\n  <img src=\"https://placehold.jp/800x600.png?text=Image3\" alt=\"\">\n  <img src=\"https://placehold.jp/800x600.png?text=Image4\" alt=\"\">\n</div>",
        "css": ".slider { width: 100%; }\n.slider img {\n  width: 100%;\n  height: 24rem;\n  padding: 0 1rem;\n  box-sizing: border-box;\n}",
        "js": "$(function () {\n  $(\".slider\").slick({\n    arrows: false,\n    autoplay: true,\n    adaptiveHeight: true,\n    centerMode: true,\n    centerPadding: \"0.3rem\",\n    slidesToShow: 3,\n    responsive: [\n      {\n        breakpoint: 768,\n        settings: {\n          slidesToShow: 1,\n          centerMode: true,\n          centerPadding: \"5rem\",\n        },\n      },\n    ],\n  });\n});",
        "cdn": "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css\"/>\n<script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>\n<script type=\"text/javascript\" src=\"https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js\"></script>"
      }
    }
  },
  {
    "id": "custom-1771960993455-ndx5a",
    "name": "無限ループスライドショー",
    "category": "scroll",
    "tags": ["スライドショー", "無限ループ", "CSSアニメーション", "flex-shrink"],
    "memo": "画像が左から流れるように無限ループするスライドショー。flex-shrink: 0 を指定することで画像の縮小を防いでいます。",
    "refUrl": "",
    "previewCss": "",
    "implementations": {
      "css": {
        "html": "<section class=\"slide_area\">\n  <div class=\"slide_track\">\n    <img src=\"img/gallery_ph1.jpg\" />\n    <img src=\"img/gallery_ph2.jpg\" />\n    <img src=\"img/gallery_ph3.jpg\" />\n    <!-- 2セット目（同じ画像を繰り返す） -->\n    <img src=\"img/gallery_ph1.jpg\" />\n    <img src=\"img/gallery_ph2.jpg\" />\n    <img src=\"img/gallery_ph3.jpg\" />\n  </div>\n</section>",
        "css": ".slide_area {\n  width: calc(100% - var(--header-side-width));\n  margin-bottom: var(--section-bottom);\n  height: auto;\n  overflow: hidden;\n}\n\n.slide_track {\n  display: flex;\n  animation: scroll 20s linear infinite;\n}\n\n.slide_track img {\n  width: calc(100vw - var(--header-side-width));\n  flex-shrink: 0; /* 縮ませない！ */\n  object-fit: cover;\n}\n\n@keyframes scroll {\n  0%   { transform: translateX(0); }\n  100% { transform: translateX(calc(-3 * (100vw - var(--header-side-width)))); }\n}",
        "js": "",
        "cdn": ""
      }
    }
  },

];
