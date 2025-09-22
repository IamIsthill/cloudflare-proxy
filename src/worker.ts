addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const url = new URL(request.url);
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return new Response('Missing "url" query parameter', { status: 400 });
  }

  // Create a request for the target URL, using basically the same request
  const targetRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? request.body
        : null,
  });

  try {
    const response = await fetch(targetRequest);

    // Add CORS headers to allow all origins
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    // newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    // newHeaders.set(
    //   "Access-Control-Allow-Headers",
    //   "Content-Type, Authorization"
    // );

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (error) {
    return new Response("Error fetching the target URL", { status: 500 });
  }
}
