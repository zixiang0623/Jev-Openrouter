// Vercel Serverless Function
// フロントエンド(index.html)から POST /api/run で呼ばれる。
// OPENROUTER_API_KEY はここでは直接書かず、Vercelプロジェクトの
// Settings → Environment Variables に登録した環境変数から読む。

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "OPENROUTER_API_KEY is not set. Add it in Vercel → Project → Settings → Environment Variables."
    });
  }

  // Vercelはcontent-type: application/jsonなら自動でreq.bodyをパースする
  const { state, questions, model } = req.body || {};

  if (!questions || Object.keys(questions).length === 0) {
    return res.status(400).json({ error: "questions is required" });
  }

  try {
    const upstream = await fetch("https://openrouter.ai/api/alpha/decisions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "~typesafe/jev-latest",
        state: state ?? "",
        questions
      })
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { error: "OpenRouter returned a non-JSON response", raw: text.slice(0, 800) };
    }

    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: String(err && err.message ? err.message : err) });
  }
}
