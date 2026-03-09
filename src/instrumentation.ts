export async function register() {
  // Node.js on Windows often uses a local DNS resolver that doesn't support
  // SRV record lookups (required by mongodb+srv:// protocol).
  // This runs once per worker process before any route handler.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { setServers } = await import("dns");
    setServers(["8.8.8.8", "1.1.1.1"]);
  }
}
