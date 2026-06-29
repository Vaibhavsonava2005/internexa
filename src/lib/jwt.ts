import { SignJWT, jwtVerify } from "jose";

// In production, we'll use CLERK_SECRET_KEY as a fallback if ADMIN_JWT_SECRET is missing
const getJwtSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.CLERK_SECRET_KEY || "fallback_super_secret_internexa";
  return new TextEncoder().encode(secret);
};

export async function signAdminJwt(): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7; // 7 days

  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(getJwtSecret());
}

export async function verifyAdminJwt(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.admin === true;
  } catch (error) {
    return false;
  }
}
