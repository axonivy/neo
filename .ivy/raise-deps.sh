#!/bin/bash
set -e

sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" webviews/*/package.json
sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" package.json
npm run update:axonivy:next

#Skip install, because transient dependencies are not available yet
#if [ "$DRY_RUN" = false ]; then
#  npm install --force
#fi
