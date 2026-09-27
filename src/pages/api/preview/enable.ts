import type { APIRoute } from 'astro';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { createPreviewSession, previewClient, previewCookieName } from '../../../lib/preview';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const client = previewClient();
  if (!client) return new Response(null, { status: 404 });

  const { isValid, redirectTo } = await validatePreviewUrl(client, request.url);
  if (!isValid) return new Response(null, { status: 404 });

  const destination = new URL(redirectTo || '/', request.url);
  if (destination.origin !== new URL(request.url).origin) {
    return new Response(null, { status: 404 });
  }

  cookies.set(previewCookieName, createPreviewSession(), {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    partitioned:
      request.headers.get('sec-fetch-dest') === 'iframe' &&
      request.headers.get('sec-fetch-site') === 'cross-site',
    maxAge: 60 * 60,
    path: '/',
  });

  return new Response(null, {
    status: 307,
    headers: {
      Location: destination.pathname + destination.search,
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer',
    },
  });
};
