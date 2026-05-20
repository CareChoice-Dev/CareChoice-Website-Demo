# MCP — Claude Desktop Config for the CareChoice Demo

To demo the "AI-driven content" beat (spec §12 beat 12), the presenter needs Claude Desktop configured to talk to our `/api/mcp` endpoint.

## Generating the API key

The MCP endpoint authenticates via a Bearer token. The key lives in:
- Local development: `.env.local` (gitignored) — `MCP_API_KEY=<64-char hex>`
- Production: Vercel env vars (Settings → Environment Variables) — same name, same value

To generate a fresh key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Claude Desktop config

1. Open Claude Desktop → Settings → Developer → Edit config
2. Add this entry under `mcpServers`:

```json
{
  "mcpServers": {
    "carechoice-demo": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://care-choice-website-demo.vercel.app/api/mcp",
        "--header",
        "Authorization: Bearer ${MCP_API_KEY}"
      ],
      "env": {
        "MCP_API_KEY": "(paste the key from Vercel env vars)"
      }
    }
  }
}
```

3. Restart Claude Desktop.
4. In a new conversation, ask: "List the MCP tools available for carechoice-demo." Claude should respond with `payload_create_news` and `payload_create_case_study`.

## Demo prompts for the walkthrough

Try these in order — pick whichever lands best on demo day:

> "Create a news article on the CareChoice demo site titled 'CareChoice opens new home in Footscray' — slug `new-home-footscray-2026`, excerpt 'A new SDA home in Footscray opens its doors this month, with five rooms and a sunny shared kitchen.'"

> "Add a case study draft: Mira's story about moving from hospital to a CareChoice SDA home in Brunswick — slug `mira-brunswick-story`, summary 'After a long stay in hospital Mira found a place that finally feels like home.'"

Claude will call the appropriate tool. Within 10 minutes (ISR revalidation window) the entry appears at `/en/news/<slug>` or `/en/case-studies/<slug>` once you publish the draft in `/admin`.

## Pre-recorded fallback

If the live demo fails (network blip, MCP server hiccup, anything), play the pre-recorded 90-second screen capture instead — see Plan 5 Task 19 for the recording instructions. The recording shows the same flow done locally; the audience can't tell the difference.

Loom / Drive link: _TODO — paste link here once the recording is uploaded._

## How the auth works under the hood

`mcp-remote` (npm package) is a small bridge that lets Claude Desktop talk to a remote MCP-over-HTTP endpoint. It reads the `Authorization` header from the `args` and forwards it on every request. Our `/api/mcp` POST handler checks the Bearer token against `process.env.MCP_API_KEY` and returns 401 if it doesn't match.

If you ever rotate the key:
1. Generate a new one (`node -e "..."` above)
2. Update Vercel env vars
3. Update Claude Desktop config
4. Restart Claude Desktop
