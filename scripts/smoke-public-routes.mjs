import { spawn } from "node:child_process";

const port = 3100;
const base = `http://127.0.0.1:${port}`;
const routes = ["/","/login","/signup","/forgot-password","/reset-password","/auth/error","/contact","/prices","/pending-approval"];

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NODE_ENV: "production" },
});

let logs = "";
child.stdout.on("data", chunk => { logs += chunk.toString(); });
child.stderr.on("data", chunk => { logs += chunk.toString(); });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (child.exitCode !== null) throw new Error(`Next server exited early (code ${child.exitCode})\n${logs}`);
    try {
      const response = await fetch(base + "/");
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Next server did not become ready\n${logs}`);
}

try {
  await waitForServer();
  for (const route of routes) {
    const response = await fetch(base + route, { redirect: "manual" });
    if (response.status !== 200) throw new Error(`${route} returned HTTP ${response.status}\n${logs}`);
    const html = await response.text();
    if (!html.toLowerCase().includes("mundus")) throw new Error(`${route} did not render expected Mundus content`);
  }
  console.log(`PASS: production server rendered ${routes.length} public/auth routes`);
} finally {
  child.kill("SIGTERM");
}
