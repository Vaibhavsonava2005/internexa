const { execSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const lines = envFile.split('\n');

for (const line of lines) {
  const trimmedLine = line.trim();
  if (trimmedLine && !trimmedLine.startsWith('#')) {
    const [key, ...values] = trimmedLine.split('=');
    const value = values.join('=');
    if (key && value) {
      console.log(`Adding ${key}...`);
      try {
        execSync(`npx vercel env add ${key} production --scope vaibhavsonava2005-6114s-projects`, {
          input: value.trim()
        });
        console.log(`✅ Added ${key}`);
      } catch (err) {
        console.error(`❌ Failed to add ${key}`);
      }
    }
  }
}
