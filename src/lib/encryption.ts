import crypto from "crypto";

const algorithm = "aes-256-cbc";

const ENCRYPTION_KEY_BUFFER = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
  : crypto.scryptSync("fallback_secret_password", "salt", 32);

const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY_BUFFER, iv);
  const encrypted1 = cipher.update(text, 'utf8', 'hex');
  const encrypted2 = cipher.final('hex');
  return iv.toString("hex") + ":" + encrypted1 + encrypted2;
}

export function decrypt(text: string): string {
  const textParts = text.split(":");
  const ivPart = textParts.shift();
  if (!ivPart) throw new Error("Invalid encrypted text format");
  const iv = Buffer.from(ivPart, "hex");
  const encryptedText = textParts.join(":");
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY_BUFFER, iv);
  const decrypted1 = decipher.update(encryptedText, 'hex', 'utf8');
  const decrypted2 = decipher.final('utf8');
  return decrypted1 + decrypted2;
}
