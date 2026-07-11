#!/bin/sh
set -e

module=$1
build_mode=$2

echo "START | Releasing module $module"

case "$module" in
"common" | "node" | "next" | "react" | "react-native")
  echo "RELEASE module: $module"
  ;;
*)
  echo "Invalid module to release | Valids: [common|node|next|react|react-native]"
  exit 1
  ;;
esac

case "$build_mode" in
"patch" | "minor" | "major" | "prepatch" | "preminor" | "premajor" | "prerelease")
  echo "Versioning $module ($build_mode)"
  (cd packages/$module && bun pm version --no-git-tag-version $build_mode)
  ;;
"no-version")
  echo "No versioning for current build!"
  ;;
*)
  echo "Invalid build_mode to release | Valids: [patch|minor|major|prepatch|preminor|premajor|prerelease|no-version]"
  exit 2
  ;;
esac

# bun does not refresh a workspace package's version in an existing bun.lock
# (verified on bun 1.3.14), and `bun publish` rewrites workspace:^ deps from
# the LOCK version — regenerate it so published pins reflect the new version.
echo "Refreshing lockfile"
rm -f bun.lock
bun install

# Full workspace compile (topological) so workspace:^ siblings are fresh.
echo "Compiling workspace"
bun run compile

# pre* build modes go to the `next` dist-tag, stable ones to `latest`.
case "$build_mode" in
prepatch | preminor | premajor | prerelease) npm_tag="next" ;;
*) npm_tag="latest" ;;
esac

echo "Publishing $module (dist-tag: $npm_tag)"
(cd packages/$module && bun publish --access public --tag $npm_tag)

PACKAGE_PATH="packages/$module/package.json"
VERSION=$(jq -r .version $PACKAGE_PATH)

git fetch
git checkout develop
git add .
git commit -m "Module: $module | Build mode: $build_mode | Version: $VERSION | Release latest src"
git push origin develop
git checkout main

git merge develop
git push origin main

echo "DONE | Releasing module $module"
