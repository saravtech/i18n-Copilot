export default function slugify(input: string) {
return input
.toLowerCase()
.replace(/\{[^}]+\}/g, "") // drop placeholders from slug base
.replace(/[^a-z0-9]+/g, "_")
.replace(/^_+|_+$/g, "")
.replace(/__+/g, "_");
}
