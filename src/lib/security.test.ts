import { describe, expect, it } from "vitest";
import { redactSensitiveText } from "@/lib/security";

// Fake tokens are assembled at runtime so secret scanners do not flag this
// file and nothing here is a real credential.
const ghp = `ghp_${"a1B2".repeat(9)}`;
const gho = `gho_${"Z9y8".repeat(9)}`;
const githubPat = `github_pat_11ABCDEFG0${"x".repeat(12)}_${"Ab1".repeat(20)}`;
const awsKey = `AKIA${"IOSFODNN7EXAMPLE"}`;
const slackBot = `xoxb-${"1".repeat(12)}-${"2".repeat(12)}-${"abcd".repeat(6)}`;
const slackUser = `xoxp-${"9".repeat(11)}-abcdefghij`;
const jwt = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkJvcmEifQ",
  "c2lnbmF0dXJlLW5vdC1yZWFs",
].join(".");
const keyBody = [
  "notARealKeyJustBase64TextForTests0123",
  "abcdefghijklmnop+/==",
].join("\n");

describe("redactSensitiveText hits", () => {
  it.each([
    [
      "OpenAI key",
      `key sk-${"a".repeat(20)} here`,
      "key sk-...[REDACTED] here",
    ],
    ["env API key", "OPENAI_API_KEY=abc123", "OPENAI_API_KEY=[REDACTED]"],
    ["quoted env token", 'GITHUB_TOKEN="abc"', 'GITHUB_TOKEN="[REDACTED]"'],
    ["postgres URL", "postgres://user:pw@db:5432/app", "postgres://[REDACTED]"],
    ["bearer token", "Bearer abc.def-ghi", "Bearer [REDACTED]"],
    [
      "private key with its body",
      `before\n-----BEGIN RSA PRIVATE KEY-----\n${keyBody}\n-----END RSA PRIVATE KEY-----\nafter`,
      "before\n[PRIVATE KEY REDACTED]\nafter",
    ],
    [
      "OpenSSH key",
      `-----BEGIN OPENSSH PRIVATE KEY-----\r\n${keyBody}\r\n-----END OPENSSH PRIVATE KEY-----`,
      "[PRIVATE KEY REDACTED]",
    ],
    [
      "key cut off before END",
      `-----BEGIN PRIVATE KEY-----\n${keyBody}\n\n다음 줄은 남는다`,
      "[PRIVATE KEY REDACTED]\n\n다음 줄은 남는다",
    ],
    ["GitHub classic token", `use ${ghp} now`, "use ghp_[REDACTED] now"],
    ["GitHub OAuth token", gho, "gho_[REDACTED]"],
    ["GitHub fine-grained token", githubPat, "github_pat_[REDACTED]"],
    ["AWS access key id", `id=${awsKey};`, "id=AKIA[REDACTED];"],
    ["Slack bot token", slackBot, "xoxb-[REDACTED]"],
    ["Slack user token", `(${slackUser})`, "(xoxp-[REDACTED])"],
    ["JWT", `token ${jwt} end`, "token [JWT REDACTED] end"],
    [
      "JWT after Bearer",
      `Authorization: Bearer ${jwt}`,
      "Authorization: Bearer [JWT REDACTED]",
    ],
    ["password=", "password=hunter2", "password=[REDACTED]"],
    ["spaced password =", "DB_PASSWORD = s3cr3t!", "DB_PASSWORD = [REDACTED]"],
    [
      "dotted key",
      "spring.datasource.password=abc123",
      "spring.datasource.password=[REDACTED]",
    ],
    [
      "passwd: at line end",
      "passwd: s3cret\nnext line",
      "passwd: [REDACTED]\nnext line",
    ],
    [
      "passwd: before CRLF",
      "passwd: s3cret\r\nnext",
      "passwd: [REDACTED]\r\nnext",
    ],
    [
      "YAML password",
      "db:\n  password: hunter2\n  host: x",
      "db:\n  password: [REDACTED]\n  host: x",
    ],
    [
      "quoted password with space",
      "PASSWORD='pa ss word'",
      "PASSWORD=[REDACTED]",
    ],
    [
      "JSON password",
      '{"password": "hunter 2", "user": "bora"}',
      '{"password": [REDACTED], "user": "bora"}',
    ],
    ["upper-case key", "Password: 'x y'", "Password: [REDACTED]"],
  ])("redacts %s", (_, input, expected) => {
    expect(redactSensitiveText(input)).toBe(expected);
  });
});

describe("redactSensitiveText near-misses", () => {
  it.each([
    ["short sk- word", "risk-assessment and sk-short"],
    ["short ghp_ prefix", "ghp_short123 is not a token"],
    ["unknown gh prefix", `ghx_${"a".repeat(36)}`],
    ["short github_pat_", "github_pat_example"],
    ["AWS key one char too long", `${awsKey}1`],
    ["lower-case AWS-looking word", awsKey.toLowerCase()],
    ["AKIA inside a longer word", `X${awsKey}`],
    ["xoxo is not Slack", "xoxo-gossip-girl-forever"],
    ["short Slack-looking token", "xoxb-short"],
    ["single base64 JSON part", "eyJhbGciOiJIUzI1NiJ9 alone"],
    ["dotted eyJ words", "file.eyJ.eyJ.x"],
    ["password prose", "password reset flow and passwords are hashed"],
    ["password: followed by prose", "password: must be rotated monthly"],
    ["Korean prose after password:", "Password: 필수"],
    ["file path error", "cat /etc/passwd: No such file or directory"],
    ["empty assignment", "password:\npassword: \npassword="],
    ["no value on the same line", "password:\n  hunter2"],
    ["password file setting", "PASSWORD_FILE=/run/secrets/db"],
    ["Korean text", "비밀번호는 저장하지 않는다. 토큰도 저장하지 않는다."],
  ])("leaves %s alone", (_, input) => {
    expect(redactSensitiveText(input)).toBe(input);
  });
});
