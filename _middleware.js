const BLOCK_MSG = "[Detected by Proton Services V0.5 | Do not try to get our source code from our domain. It is open source on GitHub. We only do this because we don't want to put our website in DDoS mode]";

const ALLOW_BOTS = /discordbot|twitterbot|slackbot|linkedinbot|facebookexternalhit|telegrambot|whatsapp|pinterest|googlebot|bingbot|yandex|baiduspider|duckduckbot|applebot|semrush|ahrefs|mj12bot|dotbot|petalbot|preview/i;

const BLOCK_UA = /curl\/|wget\/|python-requests|python-urllib|httpie|scrapy|libwww-perl|go-http-client|java\/|okhttp|postman|insomnia|httpclient|aiohttp|node-fetch|undici|axios\/|powershell/i;

const PAGE_RE = /^\/(?:|index\.html|componentsv2\.html|embed\.html|tos\.html|changelog\.html|credits\.html|settings\.html|anna\.html)$/i;

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const ua = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  if (!PAGE_RE.test(path) && path !== "/") {
    return next();
  }

  if (ALLOW_BOTS.test(ua)) {
    return next();
  }

  const looksScraper = BLOCK_UA.test(ua) || ua.trim() === "" || ua.length < 12;
  if (looksScraper) {
    return new Response(BLOCK_MSG, {
      status: 403,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-proton-services": "v0.5"
      }
    });
  }

  return next();
}
