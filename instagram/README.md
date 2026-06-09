# Instagram カルーセル生成（ハイブリッド）

料理写真の背景は **Nano Banana（Gemini画像モデル）** で生成し、日本語テキストは
**Puppeteer＋HTML/CSS（Shippori Mincho B1）** で重ねて 1080×1080 のPNGを書き出します。

画像生成AIは長い日本語を崩しがちなので、**背景＝AI / 文字＝HTML** に分離して
文字を100%正確・ブランド一貫にしています。

## セットアップ

```bash
npm install                       # puppeteer を入れる（初回はChromiumをDL）
cp instagram/.env.example instagram/.env
# instagram/.env を開いて GEMINI_API_KEY=... に実キーを記入（.env はgit管理外）
```

## 実行

```bash
# Exp.11 の4枚（表紙＋Point3枚）を生成
npm run ig exp11
#   ＝ node --env-file=instagram/.env instagram/generate.js exp11

# Nano Banana Pro を使う（文字描画・高精細）
npm run ig exp11 -- --model pro

# 表紙だけ / 特定Pointだけ作り直す
npm run ig exp11 -- --card cover
npm run ig exp11 -- --card 2

# 背景を再生成せずキャッシュから作り直す（テキスト微調整時に課金ゼロ）
npm run ig exp11 -- --no-ai
```

出力先: `インスタグラム用画像/【Exp.11】.../1_cover.png` 〜 `4_point3.png`

## 新しい記事を追加するには

`instagram/articles/expNN.json` を1つ作るだけ（`exp11.json` をコピーして編集）:

```json
{
  "id": "12",
  "folder": "【Exp.12】ペクチンのゲル化",
  "cover":  { "title": "...", "subtitle": "...\n...", "bgPrompt": "英語の背景プロンプト" },
  "points": [
    { "n": 1, "heading": "...", "body": "...\n...", "bgPrompt": "..." },
    { "n": 2, "heading": "...", "body": "...", "bgPrompt": "..." },
    { "n": 3, "heading": "...", "body": "...", "bgPrompt": "..." }
  ]
}
```

- `\n` が改行になります。
- `bgPrompt` は英語で、**「no text / 上部は暗く空ける」**を必ず入れると文字が乗せやすい背景になります。

## キャッシュ

生成した背景は `instagram/.cache/` にプロンプト単位で保存され、再実行時は再課金されません。
背景を作り直したいときはキャッシュファイルを削除してください。
