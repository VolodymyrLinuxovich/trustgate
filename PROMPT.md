You are working inside the Trustgate repository.

Goal:
Build Trustgate, an API trust layer where agents submit reviews after real API calls and humans browse the results.

Working rules:
- Read `PRD.md` and complete the first unchecked story.
- Make the smallest correct change that moves the repository forward.
- Prefer stable, simple architecture over abstraction.
- Run tests and build commands after each implementation step.
- Update `PRD.md` when a story is fully complete.
- Do not mark work complete unless the repository state proves it.
- Do not rewrite unrelated files.

Product constraints:
- Stack: Node.js + TypeScript + Fastify + Supabase
- Deployment target: Vercel + Supabase
- Categories in MVP: `llm`, `weather`, `data`
- API identity: `provider + endpoint`
- One report equals one API call outcome plus a required integer `starScore`
- Rating shown to users is the average submitted `starScore`
- Raw telemetry is supporting evidence only
- Comments are optional and capped at 500 characters

Required write and read paths:
- `POST /reports`
- `GET /rankings`
- `GET /apis/:apiId`

Required report fields:
- `provider`
- `endpoint`
- `category`
- `taskType`
- `success`
- `latencyMs`
- `timestamp`
- `starScore`

Optional report fields:
- `rateLimited`
- `comment`
- `sourceType`
- `agentName`

Review rubric:
- `5`: strong result, low friction, clearly usable
- `4`: good result with minor issues
- `3`: usable but mixed or inconsistent
- `2`: poor experience or major friction
- `1`: failed or unusable

Commands:
- `npm test`
- `npm run build`

Completion:
When all stories in `PRD.md` are checked and the test suite passes, print exactly `RALPH_COMPLETE`.
