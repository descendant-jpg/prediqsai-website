import fs from "fs";
const file = "app/api/cron/generate-blog/route.ts";
let code = fs.readFileSync(file, "utf8");

// Fix the TypeScript 'unknown' error
code = code.replace(
  /\(error\.message \|\| String\(error\)\)/g,
  '(error instanceof Error ? error.message : String(error))'
);

// Safely overwrite the JSON extraction regex to strip out Gemini's markdown
code = code.replace(
  /const json = text\.trim\(\)\.replace\(\/\^```json\\s\*\/\i, ""\)\.replace\(\/\\s\*```\$\/, ""\);/g,
  'const match = text.match(/\\{[\\s\\S]*\\}/); const json = match ? match[0] : "{}";'
);

fs.writeFileSync(file, code);
console.log("✅ Code cleanly patched!");
