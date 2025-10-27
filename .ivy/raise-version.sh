#!/bin/bash
set -e

mvn --batch-mode -f pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f build/sbom/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/neo-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/tests/screenshots/pom.xml versions:set versions:commit -DnewVersion=${1}

pnpm install
pnpm version --allow-same-version --no-git-tag-version -ws --include-workspace-root --workspaces-update=false ${1/SNAPSHOT/next}
pnpm install --no-frozen-lockfile
