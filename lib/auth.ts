import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "resw-admin-session";

function getSessionSecret() {
  return process.env.SESSION_SECRET || "change-this-secret-before-production";
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("hex");
}

export async function verifyAdminPassword(password: string) {
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredDevPassword = process.env.ADMIN_PASSWORD;

  if (configuredHash) {
    return bcrypt.compare(password, configuredHash);
  }

  if (process.env.NODE_ENV !== "production" && configuredDevPassword) {
    return password === configuredDevPassword;
  }

  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_PASSWORD_HASH) {
    return password === process.env.ADMIN_PASSWORD_HASH;
  }

  return false;
}

export function isAdminConfigured() {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return true;
  }

  if (process.env.NODE_ENV !== "production" && process.env.ADMIN_PASSWORD) {
    return true;
  }

  return false;
}

export function createSessionValue(email: string) {
  const payload = `${email}:${sign(email)}`;
  return payload;
}

export function parseSessionValue(value?: string) {
  if (!value) {
    return null;
  }

  const [email, signature] = value.split(":");

  if (!email || !signature) {
    return null;
  }

  if (sign(email) !== signature) {
    return null;
  }

  return { email };
}

export async function getAdminSession() {
  const store = await cookies();
  return parseSessionValue(store.get(COOKIE_NAME)?.value);
}

export async function setAdminSession(email: string) {
  const store = await cookies();

  store.set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
