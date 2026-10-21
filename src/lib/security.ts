const sensitivePatterns: Array<{
  pattern: RegExp;
  replacement: string;
}> = [
  {
    pattern: /\bsk-[A-Za-z0-9_-]{12,}\b/g,
    replacement: "sk-...[REDACTED]",
  },
  // GitHub tokens: ghp_/gho_/ghu_/ghs_/ghr_ plus 36+ characters, and
  // fine-grained github_pat_ tokens.
  {
    pattern: /\b(gh[pousr]_)[A-Za-z0-9]{36,}\b/g,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /\b(github_pat_)[A-Za-z0-9_]{22,}\b/g,
    replacement: "$1[REDACTED]",
  },
  // AWS access key ids are exactly 20 uppercase characters.
  {
    pattern: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g,
    replacement: "$1[REDACTED]",
  },
  {
    pattern: /\b(xox[abpr]-)[A-Za-z0-9-]{10,}/g,
    replacement: "$1[REDACTED]",
  },
  // JWTs: base64url header and payload that both start with `{"`.
  {
    pattern: /\beyJ[A-Za-z0-9_-]{5,}\.eyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]*/g,
    replacement: "[JWT REDACTED]",
  },
  // password= / passwd: assignments, including DB_PASSWORD=... and JSON
  // keys. A `:` value is redacted only when it is quoted or is one word of
  // printable ASCII ([!#-&(-~] skips quotes) that ends the line, so prose
  // like "password: must be rotated" is left alone.
  {
    pattern:
      /\b([A-Za-z0-9_]*passw(?:or)?d["']?[ \t]*(?:=|:(?=[ \t]*["']|[ \t]*[!#-&(-~]+[ \t]*\r?$))[ \t]*)(?:"[^"\n]*"|'[^'\n]*'|[^\s"']+)/gim,
    replacement: "$1[REDACTED]",
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
  // Through the END line; a paste cut off before it still loses the
  // base64 body lines that follow BEGIN.
  {
    pattern:
      /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----(?:[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY-----|(?:\s*[A-Za-z0-9+/=]{16,})*)/g,
    replacement: "[PRIVATE KEY REDACTED]",
  },
];

export function redactSensitiveText(text: string) {
  return sensitivePatterns.reduce(
    (current, item) => current.replace(item.pattern, item.replacement),
    text,
  );
}
