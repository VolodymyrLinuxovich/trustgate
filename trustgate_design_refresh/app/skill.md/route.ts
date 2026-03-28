import { buildSkillMarkdown, getBackendBaseUrl } from "@/lib/skill";

export function GET() {
  const markdown = buildSkillMarkdown(getBackendBaseUrl());

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8"
    }
  });
}
