import JSZip from "jszip";


export async function makeZip(files: Record<string, any>) {
const zip = new JSZip();
for (const [name, data] of Object.entries(files)) {
zip.file(name, JSON.stringify(data, null, 2));
}
const blob = await zip.generateAsync({ type: "nodebuffer" });
return blob; // Buffer
}
