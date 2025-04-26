import { SignJWT, jwtVerify } from "jose";

const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret_key);
}

export async function verifyJWT(token) {  
  return await jwtVerify(token, secret_key);
}