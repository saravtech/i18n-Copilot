# i18n Copilot — MVP


### Quickstart
```bash
pnpm i # or npm i / yarn
cp .env.local.example .env.local # then add OPENAI_API_KEY=...
pnpm dev
```
Open http://localhost:3000


### Notes
- If `OPENAI_API_KEY` is missing, translations are stubbed as `[fr] Hello` so you can test free.
- AST extraction covers JSXText + common attrs (`alt`, `title`, `aria-label`, `placeholder`, etc.) + simple `toast("...")` calls.
- Keys are generated from file path + slug of the text to stay deterministic.


### Roadmap
- Diff view & patch generator
- GitHub PR creation
- VSCode command
