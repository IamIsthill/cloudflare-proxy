"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
function handleRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
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
            body: request.method !== "GET" && request.method !== "HEAD"
                ? request.body
                : null,
        });
        try {
            const response = yield fetch(targetRequest);
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
        }
        catch (error) {
            return new Response("Error fetching the target URL", { status: 500 });
        }
    });
}
