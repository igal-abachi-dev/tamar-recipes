import { createHmac, timingSafeEqual } from 'node:crypto';
import { sanityClient } from './sanity';

export const previewCookieName = '__Host-tamar-preview';
const sessionSeconds = 60 * 60;

function secret(): string | undefined {
  return import.meta.env.PREVIEW_SECRET;
}

export function previewClient() {
  const token = import.meta.env.SANITY_READ_TOKEN;
  if (!token || !secret()) return undefined;
  return sanityClient.withConfig({ token, perspective: 'drafts', useCdn: false });
}

function signature(expires: string, key: string): Buffer {
  return createHmac('sha256', key).update(expires).digest();
}

export function createPreviewSession(): string {
  const key = secret();
  if (!key) throw new Error('PREVIEW_SECRET is required');
  const expires = String(Math.floor(Date.now() / 1000) + sessionSeconds);
  return `${expires}.${signature(expires, key).toString('base64url')}`;
}

export function hasPreviewSession(value: string | undefined): boolean {
  const key = secret();
  if (!key || !value) return false;
  const [expires, mac, extra] = value.split('.');
  if (extra || !/^\d{10}$/.test(expires) || !mac) return false;
  const expiry = Number(expires);
  const now = Math.floor(Date.now() / 1000);
  if (expiry <= now || expiry > now + sessionSeconds) return false;
  const actual = Buffer.from(mac, 'base64url');
  const expected = signature(expires, key);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
