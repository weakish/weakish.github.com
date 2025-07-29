/**
 * Netlify Edge Function for /teapot route
 * Returns HTTP 418 "I'm a teapot" status as per RFC 2324
 */
export default () => new Response("I'm a teapot", {
  status: 418,
  headers: {
    "Content-Type": "text/plain",
  },
});