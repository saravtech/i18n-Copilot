"use client";
import React from "react";


type Props = { onFiles: (files: { path: string; content: string }[]) => void };


export default function DropZone({ onFiles }: Props) {
const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
const files = e.target.files; if (!files) return;
const arr: { path: string; content: string }[] = [];
for (const f of Array.from(files)) {
const text = await f.text();
arr.push({ path: f.name, content: text });
}
onFiles(arr);
};


return (
<label className="block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50">
<input type="file" accept=".js,.jsx,.ts,.tsx" multiple className="hidden" onChange={onPick} />
<div className="text-sm opacity-70">Drop or click to select React files (JSX/TSX)</div>
</label>
);
}
