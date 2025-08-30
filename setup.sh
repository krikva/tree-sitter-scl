#!/bin/bash

set -euo pipefail

echo "== tree-sitter-scl setup =="

# 1. Install deps without running native build yet (parser not generated)
echo "Installing dependencies (skipping lifecycle scripts)..."
npm install --ignore-scripts

# 2. Generate parser (creates src/parser.c and src/tree_sitter/* headers)
echo "Generating parser..."
npx tree-sitter generate

# 3. Rebuild native addon now that sources exist
echo "Building native module..."
npm rebuild

echo "Setup complete. Useful commands:"
echo "  npx tree-sitter parse <file>   # Parse a file"
echo "  npx tree-sitter test           # Run tests (ensure corpus has expected trees)"
echo "  npx tree-sitter playground     # Launch playground"
