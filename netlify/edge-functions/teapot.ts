export default () => new Response("I'm a teapot", {
  status: 418,
  headers: {
    "Content-Type": "text/plain",
  },
});