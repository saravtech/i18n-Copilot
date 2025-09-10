import { NextRequest, NextResponse } from "next/server";
import { extractStrings } from "@/lib/extractStrings";
import { translateBatch } from "@/lib/translate";
import { makeZip } from "@/lib/zip";
import { z } from "zod";


const Body = z.object({
files: z.array(z.object({ path: z.string(), content: z.string() })),
locales: z.array(z.string()).default([])
});


export async function POST(req: NextRequest) {
const json = await req.json();
const { files, locales } = Body.parse(json);


// 1) Extract
const extracted: { key: string; value: string; path: string }[] = [];
for (const f of files) extracted.push(...extractStrings(f.path, f.content));


// 2) Build en.json
const en: Record<string, string> = {};
for (const e of extracted) en[e.key] = e.value;


// 3) Translate
const localeMaps: Record<string, Record<string, string>> = {};
for (const loc of locales) {
const values = Object.values(en);
const translated = values.length ? await translateBatch(values, loc) : [];
const map: Record<string, string> = {};
Object.keys(en).forEach((k, i) => (map[k] = translated[i] ?? en[k]));
localeMaps[loc] = map;
}


// 4) Zip
const filesToZip: Record<string, any> = { "en.json": en };
for (const [loc, map] of Object.entries(localeMaps)) filesToZip[`${loc}.json`] = map;
const zipBuffer = await makeZip(filesToZip);
const zipBase64 = Buffer.from(zipBuffer).toString("base64");


return NextResponse.json({
stats: { files: files.length, strings: Object.keys(en).length, locales: locales.length },
en,
locales: localeMaps,
zipBase64
});
}
