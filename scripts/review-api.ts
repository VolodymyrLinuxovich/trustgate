import { pathToFileURL } from "node:url";
import { reportCategorySchema, type ReportCategory } from "../src/reports.js";

export type ReviewCliArgs = {
  provider: string;
  endpoint: string;
  category: ReportCategory;
  taskType: string;
  trustgateBaseUrl: string;
  sourceType?: string;
  agentName?: string;
};

const FLAG_NAMES = new Set([
  "--provider",
  "--endpoint",
  "--category",
  "--task-type",
  "--trustgate-url",
  "--source-type",
  "--agent-name"
]);

function normalizeValue(value: string, flag: string) {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`Flag ${flag} requires a non-empty value.`);
  }

  return normalized;
}

function parseRawArgs(argv: string[]) {
  const values: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help") {
      values.help = "true";
      continue;
    }

    const [flag, inlineValue] = token.split("=", 2);

    if (!FLAG_NAMES.has(flag)) {
      throw new Error(`Unknown flag: ${flag}`);
    }

    const nextValue = inlineValue ?? argv[index + 1];

    if (nextValue === undefined || FLAG_NAMES.has(nextValue)) {
      throw new Error(`Flag ${flag} requires a value.`);
    }

    values[flag] = normalizeValue(nextValue, flag);

    if (inlineValue === undefined) {
      index += 1;
    }
  }

  return values;
}

function normalizeBaseUrl(input: string) {
  const url = new URL(input);
  return url.toString().replace(/\/$/, "");
}

export function parseReviewArgs(argv: string[] = process.argv.slice(2)): ReviewCliArgs {
  const values = parseRawArgs(argv);

  if (values.help === "true") {
    throw new Error(getUsageText());
  }

  return {
    provider: normalizeValue(values["--provider"] ?? "", "--provider"),
    endpoint: normalizeValue(values["--endpoint"] ?? "", "--endpoint"),
    category: reportCategorySchema.parse(values["--category"]),
    taskType: normalizeValue(values["--task-type"] ?? "", "--task-type"),
    trustgateBaseUrl: normalizeBaseUrl(
      values["--trustgate-url"] ?? process.env.TRUSTGATE_BASE_URL ?? "http://localhost:3000"
    ),
    sourceType: values["--source-type"],
    agentName: values["--agent-name"]
  };
}

export function getUsageText() {
  return [
    "Usage: tsx scripts/review-api.ts --provider <name> --endpoint <path> --category <llm|weather|data> --task-type <name> [options]",
    "",
    "Options:",
    "  --trustgate-url <url>  Trustgate base URL. Defaults to TRUSTGATE_BASE_URL or http://localhost:3000",
    "  --source-type <value>  Optional provenance source type",
    "  --agent-name <value>   Optional agent name"
  ].join("\n");
}

function isMainModule() {
  return process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url;
}

if (isMainModule()) {
  try {
    const args = parseReviewArgs();
    console.log(JSON.stringify(args, null, 2));
    console.log("TODO: implement real API review runner");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(message);
    process.exitCode = 1;
  }
}
