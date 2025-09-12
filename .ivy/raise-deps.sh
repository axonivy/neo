#!/bin/bash
set -e

mvn --batch-mode versions:set-property versions:commit -Dproperty=openapi.version -DnewVersion=${1} -DallowSnapshots=true

sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" webviews/*/package.json
sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" package.json
npm run update:axonivy:next

#Skip install, because transient dependencies are not available yet
#if [ "$DRY_RUN" = false ]; then
#  npm install --force
#fi
