#!/bin/bash

# other core dir: ./playwrightInit.sh /path/to/custom/core
CORE_DIR="${1:-/Users/lli/GitWorkspace/core}"
TARGET_DIR="$CORE_DIR/workspace/ch.ivyteam.ivy.server.file.feature/target/server-root/data/workspaces/Developer/neo-test-project"

# Create the target directory if it doesn't exist
mkdir -p "$TARGET_DIR"

# Remove any existing symbolic link in the target directory
if [ -L "$TARGET_DIR/neo-test-project" ]; then
  rm "$TARGET_DIR/neo-test-project"
fi

# Create the symbolic link in the target directory
ln -s "$(pwd)/playwright/neo-test-project" "$TARGET_DIR/neo-test-project"