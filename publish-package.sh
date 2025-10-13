#!/bin/bash
set -e  # stop the script on first error

echo "🔹  Step 1: Building project..."
npm run build
echo "✅  Build complete"

echo "🔹 Step 2: Bumping version in package.json..."

# Get current version
current_version=$(grep '"version":' package.json | sed -E 's/.*"([0-9]+\.[0-9]+\.[0-9]+)".*/\1/')
IFS='.' read -r major minor patch <<< "$current_version"
new_version="$major.$minor.$((patch + 1))"

# Update version in package.json
sed -i.bak -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$new_version\"/" package.json
rm package.json.bak

echo "🔹 Step 3: Publishing to npm..."
npm publish --access public

echo "✅  Package published successfully"
echo "✅  Version updated: $current_version → $new_version"

echo "🎉 Done!"
