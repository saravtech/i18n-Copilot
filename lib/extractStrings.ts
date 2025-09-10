import * as parser from "@babel/parser";
out.push({ key: makeKey({ filePath, text, index: idx++ }), value: text, path: filePath });
}
},
JSXAttribute(path) {
const name = t.isJSXIdentifier(path.node.name) ? path.node.name.name : undefined;
if (!name || !ATTRS.has(name)) return;
const val = path.node.value;
if (t.isStringLiteral(val)) {
const text = normalize(val.value);
if (text) out.push({ key: makeKey({ filePath, text, index: idx++ }), value: text, path: filePath });
}
if (t.isJSXExpressionContainer(val) && t.isStringLiteral(val.expression)) {
const text = normalize(val.expression.value);
if (text) out.push({ key: makeKey({ filePath, text, index: idx++ }), value: text, path: filePath });
}
},
// Optional: StringLiteral in call expressions (e.g., toast("Saved"))
CallExpression(path) {
const callee = path.node.callee;
if (t.isIdentifier(callee) && /^(toast|alert|confirm|log)$/i.test(callee.name)) {
for (const arg of path.node.arguments) {
if (t.isStringLiteral(arg)) {
const text = normalize(arg.value);
if (text) out.push({ key: makeKey({ filePath, text, index: idx++ }), value: text, path: filePath });
}
}
}
}
});


// de-dup by (path+value)
const seen = new Set<string>();
return out.filter((e) => {
const k = `${e.path}\u0000${e.value}`;
if (seen.has(k)) return false;
seen.add(k);
return true;
});
}


function normalize(s: string) {
const text = s.replace(/\s+/g, " ").trim();
if (!text) return "";
// keep placeholders like {name}
return text;
}
