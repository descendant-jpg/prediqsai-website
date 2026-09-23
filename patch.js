const fs = require("fs");
const file = "app/api/cron/generate-blog/route.ts";
let code = fs.readFileSync(file, "utf8");

// Safely overwrite the exact JSON parser line
code = code.replace(
  /const json = text\.trim\(\)\.replace\(\/\^```json\\s\*\/\i, ""\)\.replace\(\/\\s\*```\$\/, ""\);/,
  'const match = text.match(/\\{[\\s\\S]*\\}/); const json = match ? match[0] : "{}";'
);

// Safely overwrite the error output to expose real crashes
code = code.replace(
  'return NextResponse.json({ error: "Blog generation failed. The queue item was marked failed." }, { status: 500 });',
  'return NextResponse.json({ error: "Vercel Crash: " + (error.message || String(error)) }, { status: 500 });'
);

fs.writeFileSync(file, code);
console.log("✅ Code cleanly patched!");
