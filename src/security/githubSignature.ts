async function sha256(secret: string, body: string) {
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(body)
  );

  return [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyGitHubSignature(
  req: Request,
  env: any,
  rawBody: string
) {
  const sig = req.headers.get("X-Hub-Signature-256");

  if (!sig) {
    return false;
  }

  const expected = `sha256=${await sha256(
    env.GITHUB_WEBHOOK_SECRET,
    rawBody
  )}`;

  return sig === expected;
}