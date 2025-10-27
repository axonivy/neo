#!/bin/bash
set -e

mvn --batch-mode versions:set-property versions:commit -Dproperty=openapi.version -DnewVersion=${1} -DallowSnapshots=true

sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" webviews/*/package.json
sed -i -E "s/(\"@axonivy[^\"]*\"): \"[^\"]*\"/\1: \"~${1/SNAPSHOT/next}\"/" package.json
pnpm run update:axonivy:next
