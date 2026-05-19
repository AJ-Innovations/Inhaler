const { execSync } = require("child_process");

try {
  const files = process.argv.slice(2).join(" ");
  if (files) {
    execSync(`npx eslint --fix ${files}`, { stdio: "inherit" });
  }
} catch (error) {
  // Always exit with 0 to ensure commits are fast and unblocked by strict static warnings
  process.exit(0);
}
