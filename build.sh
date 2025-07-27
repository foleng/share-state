#!/bin/bash
# Build script for Vercel deployment

# Set npm config to use registry with HTTPS
npm config set registry https://registry.npmjs.org/

# Install with pnpm but with more lenient settings
pnpm install --no-frozen-lockfile --prefer-offline || \
pnpm install --no-frozen-lockfile || \
npm install

# Build the project
pnpm build