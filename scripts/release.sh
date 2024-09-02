#!/bin/sh

module=$1
echo "START | Releasing module $module"

case "$module" in
  "node"|"next"|"react")
    echo "RELEASE module: $module"
    ;;
  *)
    echo "Invalid module to release | Valids: [node|next|react]"
    ;;
esac

echo "Cleaning up release folder"
rm -rf packages/$module/dist

provision_opt=$2
case "$provision_opt" in
  "no-version")
    echo "No versioning for current build!"
    ;;
  *)
    pnpm --filter "{packages/$module}" version $provision_opt
    ;;
esac

echo "Compiling $module"
pnpm --filter "{packages/$module}" run compile

echo "Publishing $module"
cd packages/$module
pnpm publish --no-git-check

echo "DONE | Releasing module $module"
