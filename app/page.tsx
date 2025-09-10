"use client";
body: JSON.stringify({ files, locales })
});
const json = await res.json();
setResult(json);
setLoading(false);
};


const downloadZip = async () => {
if (!result?.zipBase64) return;
setDownloading(true);
const b = atob(result.zipBase64);
const len = b.length;
const u8 = new Uint8Array(len);
for (let i = 0; i < len; i++) u8[i] = b.charCodeAt(i);
const blob = new Blob([u8], { type: "application/zip" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url; a.download = "locales.zip"; a.click();
URL.revokeObjectURL(url);
setDownloading(false);
};


return (
<main className="max-w-3xl mx-auto p-6 space-y-6">
<h1 className="text-2xl font-semibold">i18n Copilot (MVP)</h1>
<p className="text-sm text-gray-600">Upload React files → get en.json + draft translations.</p>


<DropZone onFiles={setFiles} />


<div className="flex items-center gap-2">
<label className="text-sm">Locales:</label>
<input className="border px-2 py-1 rounded" value={locales.join(",")} onChange={(e) => setLocales(e.target.value.split(/\s*,\s*/).filter(Boolean))} />
</div>


<button onClick={run} disabled={!files.length || loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
{loading ? "Extracting…" : "Extract & Translate"}
</button>


{result && (
<section className="space-y-3">
<div className="text-sm">Strings: {result.stats.strings} • Locales: {result.stats.locales}</div>
<pre className="bg-gray-50 p-3 rounded overflow-auto text-xs max-h-80">{JSON.stringify(result.en, null, 2)}</pre>
{Object.entries(result.locales || {}).map(([loc, map]: any) => (
<details key={loc} className="bg-gray-50 rounded">
<summary className="cursor-pointer px-3 py-2 font-medium">{loc}.json</summary>
<pre className="p-3 overflow-auto text-xs max-h-80">{JSON.stringify(map, null, 2)}</pre>
</details>
))}
<button onClick={downloadZip} disabled={downloading} className="px-3 py-2 rounded border">
{downloading ? "Preparing…" : "Download ZIP"}
</button>
</section>
)}


<footer className="pt-8 text-xs text-gray-500">
Tip: set <code>OPENAI_API_KEY</code> in <code>.env.local</code> to get real translations; otherwise you’ll see stubbed outputs.
</footer>
</main>
);
}
