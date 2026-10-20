import { readFile } from "node:fs/promises";
import path from "node:path";
import { isValidDeviceName } from "@/lib/sessionFiles";

export type BoradoriConfig = {
  workspacePath: string;
  deviceName: string;
};

// `.boradori/config.json` is local to each device and ignored by git. Without
// it (for example on the public Vercel demo) session sharing stays off.
export async function loadBoradoriConfig(): Promise<BoradoriConfig | null> {
  let parsed: unknown;

  try {
    parsed = JSON.parse(
      await readFile(
        path.join(process.cwd(), ".boradori", "config.json"),
        "utf8",
      ),
    );
  } catch {
    return null;
  }

  const config = parsed as {
    memoryWorkspacePath?: unknown;
    deviceName?: unknown;
  };

  if (
    typeof config.memoryWorkspacePath !== "string" ||
    !path.isAbsolute(config.memoryWorkspacePath) ||
    typeof config.deviceName !== "string" ||
    !isValidDeviceName(config.deviceName)
  ) {
    return null;
  }

  return {
    workspacePath: path.resolve(config.memoryWorkspacePath),
    deviceName: config.deviceName,
  };
}
