#!/bin/bash
# Simple build script for Vercel

# Install dependencies in the demo-react app
cd apps/demo-react
npm install

# Build the app
npm run build

# Go back to root
cd ../..