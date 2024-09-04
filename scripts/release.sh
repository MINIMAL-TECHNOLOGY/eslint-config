#!/bin/sh

module=$1
echo "START | Releasing module $module"

case "$module" in
  "common"|"node"|"next"|"react")
    echo "RELEASE module: $module"
    ;;
  *)
    echo "Invalid module to release | Valids: [node|next|react]"
    exit 1
    ;;
esac

echo "Cleaning up release folder"
rm -rf packages/$module/dist

build_mode=$2
case "$build_mode" in
  "patch"|"minor"|"major")
    pnpm --filter "{packages/$module}" version $build_mode
    ;;
  "no-version")
    echo "No versioning for current build!"
    ;;
  *)
    echo "Invalid build_mode to release | Valids: [patch|minor|major]"
    exit 2
    ;;
esac

echo "Compiling $module"
pnpm --filter "{packages/$module}" run compile

echo "Publishing $module"
cd packages/$module
pnpm publish --no-git-check

PACKAGE_PATH="./package.json"
VERSION=$(jq -r .version $PACKAGE_PATH)

git fetch
git checkout develop
git add .
git commit -m "Module: $module | Version: $VERSION | Release latest src"
git push origin develop
git checkout main

git merge develop
git push origin main

echo "DONE | Releasing module $module"
