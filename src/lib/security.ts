const sensitivePatterns: Array<{
  pattern: RegExp;
  replacement: string;
}> = [
  {
    pattern: /\bsk-[A-Za-z0-9_-]{12,}\b/g,
    replacement: "sk-...[REDACTED]",
  },
  {
    pattern:
      /\b((?:[A-Z0-9_]*(?:API_KEY|SECRET|TOKEN|DATABASE_URL)[A-Z0-9_]*)\s*=\s*)(["']?)[^\s"']+/gi,
    replacement: "$1$2[REDACTED]",
  },
  {
    pattern: /postgres(?:ql)?:\/\/[^\s"']+/gi,
    replacement: "postgres://[REDACTED]",
  },
  {
    pattern: /\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi,
    replacement: "Bearer [REDACTED]",
  },
  {
    pattern: /-----BEGIN[\s\S]*?PRIVATE KEY-----/g,
    replacement: "[PRIVATE KEY REDACTED]",
  },
];

export function redactSensitiveText(text: string) {
  return sensitivePatterns.reduce(
    (current, item) => current.replace(item.pattern, item.replacement),
    text,
  );
}
