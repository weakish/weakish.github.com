import { htmlToGemtext } from "../gemini-converter.ts";

// This script runs the Lume build and then generates .gmi files
// Usage: deno run -A tasks/gmi.ts

console.log("Running Lume build...");
const buildProcess = await new Deno.Command("deno", {
  args: ["task", "lume"],
  stdout: "inherit",
  stderr: "inherit",
}).output();

if (!buildProcess.success) {
  console.error("Lume build failed");
  Deno.exit(1);
}

console.log("Generating .gmi files...");

const dest = "./_site";

// Clean up existing .gmi files
async function cleanGmiFiles(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = `${dir}/${entry.name}`;
    if (entry.isFile && entry.name.endsWith(".gmi")) {
      await Deno.remove(fullPath);
    } else if (entry.isDirectory) {
      await cleanGmiFiles(fullPath);
    }
  }
}

// Generate .gmi file from HTML file
async function generateGmiFromHtml(
  htmlPath: string,
  gmiPath: string,
): Promise<void> {
  try {
    const html = await Deno.readTextFile(htmlPath);
    const gemtext = htmlToGemtext(html);

    const dir = gmiPath.substring(0, gmiPath.lastIndexOf("/"));
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(gmiPath, gemtext);
  } catch (err) {
    console.error(`Failed to generate ${gmiPath}:`, err);
  }
}

// Walk through _site and process HTML files
async function processHtmlFiles(dir: string): Promise<void> {
  for await (const entry of Deno.readDir(dir)) {
    const fullPath = `${dir}/${entry.name}`;

    if (entry.isDirectory) {
      await processHtmlFiles(fullPath);
    } else if (entry.isFile && entry.name.endsWith(".html")) {
      // Skip files in zk/ directory
      if (fullPath.includes("/zk/")) {
        continue;
      }

      // Generate .gmi path
      let gmiPath: string;
      if (entry.name === "index.html") {
        gmiPath = fullPath.replace(/\/index\.html$/, "/index.gmi");
      } else {
        gmiPath = fullPath.replace(/\.html$/, ".gmi");
      }

      // Generate .gmi file
      await generateGmiFromHtml(fullPath, gmiPath);

      // Delete HTML file (output Gemtext only)
      try {
        await Deno.remove(fullPath);
      } catch (err) {
        console.error(`Failed to delete ${fullPath}:`, err);
      }
    }
  }
}

try {
  await cleanGmiFiles(dest);
  await processHtmlFiles(dest);
  console.log("Done generating .gmi files.");
} catch (err) {
  console.error("Error:", err);
  Deno.exit(1);
}
