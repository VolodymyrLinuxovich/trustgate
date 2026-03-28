export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function isExternalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  const internalDomains = ["trustgate.ai", "company.com", "internal.com"];
  return domain.length > 0 && !internalDomains.includes(domain);
}

export function includesSensitiveKeyword(text: string): boolean {
  const keywords = ["password", "secret", "confidential", "internal", "credential", "roadmap"];
  return keywords.some((keyword) => text.toLowerCase().includes(keyword));
}

export function includesDestructiveIntent(text: string): boolean {
  const keywords = ["delete", "wipe", "drop", "truncate", "destroy"];
  return keywords.some((keyword) => text.toLowerCase().includes(keyword));
}

export function isSuspiciousDomain(url: string): boolean {
  const suspiciousFragments = [
    "webhook",
    "ngrok",
    "pastebin",
    "temp",
    "unknown",
    "suspicious"
  ];
  return suspiciousFragments.some((frag) => url.toLowerCase().includes(frag));
}

export function includesPromptInjection(text: string): boolean {
  const keywords = [
    "ignore previous instructions",
    "bypass approval",
    "do not log",
    "secretly send",
    "override safety"
  ];
  return keywords.some((keyword) => text.toLowerCase().includes(keyword));
}
