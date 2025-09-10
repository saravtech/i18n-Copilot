// Minimal translator: uses OpenAI if available, else echoes text (free dev fallback)


export async function translateBatch(texts: string[], target: string): Promise<string[]> {
const key = process.env.OPENAI_API_KEY;
if (!key) {
// Free fallback: return text with a stub tag so you can see it's "translated"
return texts.map((t) => `[${target}] ${t}`);
}


const system = `You translate UI strings. Preserve placeholders like {name}, {count}. Do not invent text. Output JSON array of translated strings in the same order.`;
const user = JSON.stringify({ target, texts });


const res = await fetch("https://api.openai.com/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${key}`,
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: system },
{ role: "user", content: user }
],
response_format: { type: "json_object" }
}),
});


if (!res.ok) {
// Fail soft: echo
return texts.map((t) => `[${target}] ${t}`);
}


const data = await res.json();
try {
const content = data.choices[0].message.content;
const parsed = JSON.parse(content);
if (Array.isArray(parsed.translations)) return parsed.translations;
} catch (_) {}
return texts.map((t) => `[${target}] ${t}`);
}
