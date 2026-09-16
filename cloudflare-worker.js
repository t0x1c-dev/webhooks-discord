const BLOCK_MSG = "[Detected by Proton Services V0.5 | Do not try to get our source code from our domain. It is open source on GitHub. We only do this because we don't want to put our website in DDoS mode]";

const ALLOW_BOTS = /discordbot|twitterbot|slackbot|linkedinbot|facebookexternalhit|telegrambot|whatsapp|pinterest|googlebot|bingbot|yandex|baiduspider|duckduckbot|applebot|semrush|ahrefs|mj12bot|dotbot|petalbot|preview/i;

const BLOCK_UA = /curl\/|wget\/|python-requests|python-urllib|httpie|scrapy|libwww-perl|go-http-client|java\/|okhttp|postman|insomnia|httpclient|aiohttp|node-fetch|undici|axios\/|powershell/i;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    if (request.method === "GET" || request.method === "HEAD") {
      if (!ALLOW_BOTS.test(ua)) {
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
      }
    }

    return fetch(request);
  }
};
