"""
動画アニメーション解析テスト
Gemini 2.5 Pro で動画を解析し、CSS/AOS/GSAP で再現できるか検証する
"""

import os
import shutil
import sys
import tempfile
import time
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv なくても .env 手動設定で動く

import google.genai as genai


# ============================================================
# 設定
# ============================================================
API_KEY = os.getenv("GEMINI_API_KEY", "")
MODEL   = "gemini-2.5-pro"   # 動画解析に最も強いモデル

PROMPT = """\
この動画に映っているUIアニメーションを分析してください。

## 分析してほしいこと

1. **アニメーションの種類**
   - どんな動き？（フェード・スライド・スケール・回転・etc）
   - タイミング・速度・イージングの特徴

2. **実装方法の判定**
   以下の3つの中でどれが最適か、理由とともに答えてください：
   - CSS @keyframes（純粋CSS）
   - AOS.js（スクロールトリガー系）
   - GSAP（複雑なシーケンス・高精度）

3. **実装コード**
   最適な方法で、このアニメーションを再現するコードを出してください。
   HTML + CSS（または JS）をセットで。

4. **難易度・注意点**
   再現時に気をつけるべき点があれば。
"""


def analyze_video(video_path: str) -> None:
    if not API_KEY:
        print("❌ GEMINI_API_KEY が設定されていません")
        print("   .env ファイルに GEMINI_API_KEY=AIza... を記述してください")
        sys.exit(1)

    path = Path(video_path)
    if not path.exists():
        print(f"❌ ファイルが見つかりません: {video_path}")
        sys.exit(1)

    file_size_mb = path.stat().st_size / (1024 * 1024)
    print(f"📹 動画: {path.name}  ({file_size_mb:.1f} MB)")
    print(f"🤖 モデル: {MODEL}")
    print("-" * 50)

    client = genai.Client(api_key=API_KEY)

    # ---- アップロード（File API） ----
    # 日本語ファイル名はHTTPヘッダーでエラーになるため ASCII名の一時ファイルを使う
    print("⬆ アップロード中...")
    suffix = path.suffix or ".mp4"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp_path = Path(tmp.name)
    shutil.copy2(path, tmp_path)
    try:
        video_file = client.files.upload(file=tmp_path)
    finally:
        tmp_path.unlink(missing_ok=True)

    # アップロード完了待ち
    print("⏳ 処理待ち...", end="", flush=True)
    while video_file.state.name == "PROCESSING":
        time.sleep(2)
        video_file = client.files.get(name=video_file.name)
        print(".", end="", flush=True)
    print()

    if video_file.state.name == "FAILED":
        print("❌ 動画の処理に失敗しました")
        sys.exit(1)

    print("✅ 準備完了 → 解析開始\n")
    print("=" * 50)

    # ---- 解析リクエスト ----
    response = client.models.generate_content(
        model=MODEL,
        contents=[video_file, PROMPT],
    )

    print(response.text)
    print("=" * 50)

    # ---- 後片付け ----
    client.files.delete(name=video_file.name)
    print("\n✅ 完了（アップロードファイルは削除済み）")


# ============================================================
# エントリポイント
# ============================================================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使い方: python test_video_analyze.py <動画ファイルパス>")
        print("例:     python test_video_analyze.py animation.mp4")
        sys.exit(1)

    analyze_video(sys.argv[1])
