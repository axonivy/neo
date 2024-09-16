#!/bin/bash
set -e

mvn --batch-mode -f pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/neo-test-project/pom.xml versions:set versions:commit -DnewVersion=${1}
mvn --batch-mode -f playwright/tests/screenshots/pom.xml versions:set versions:commit -DnewVersion=${1}

npm install
npm version -f --no-git-tag-version -ws --include-workspace-root ${1/SNAPSHOT/next}
npm install
