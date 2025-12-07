const fs = require('fs');
const path = require('path');

const gitDir = path.join(__dirname, '..', '.git');
const hooksDir = path.join(gitDir, 'hooks');

// Check if we're in a git repo
if (!fs.existsSync(gitDir)) {
    console.log('Not a git repository, skipping hook setup');
    process.exit(0);
}

// Ensure hooks directory exists
if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
}

const prePushHook = `#!/bin/sh
# Pre-push hook: build before pushing

echo "Running build before push..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed! Push aborted."
    exit 1
fi

# Check if dist files changed and need to be committed
if ! git diff --quiet dist/; then
    echo ""
    echo "Warning: dist/ files changed after build."
    echo "You may want to commit these changes."
    echo ""
fi

echo "Build successful, proceeding with push..."
exit 0
`;

const hookPath = path.join(hooksDir, 'pre-push');

fs.writeFileSync(hookPath, prePushHook);
fs.chmodSync(hookPath, '755');

console.log('✓ Git pre-push hook installed');
