# Jev Console (OpenRouter版)

Cloudflareではなく OpenRouter 経由で `~typesafe/jev-latest` を呼び出す構成です。

## 構成

- `index.html` — フロントエンド(単一HTML)。`POST /api/run` を叩く
- `api/run.js` — Vercel Serverless Function。OpenRouterの `https://openrouter.ai/api/alpha/decisions` を代わりに呼ぶ

APIキーをブラウザに置かず、サーバー側(Vercel)にだけ持たせるための構成です。

## デプロイ手順(Vercel)

1. このリポジトリを Vercel に import する(New Project → Import Git Repository)
2. Project Settings → Environment Variables に `OPENROUTER_API_KEY` を追加(値は自分のOpenRouter APIキー)
3. Deploy
4. デプロイ後のURLを開いて、Stateと質問を入れて「実行」

## ローカルで動かす場合

```bash
npm i -g vercel
vercel dev
```

`.env.local` に `OPENROUTER_API_KEY=sk-or-...` を書いておくと `vercel dev` が読み込みます(`.gitignore`済み、コミットしないこと)。
