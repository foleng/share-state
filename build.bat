@echo off
REM Build script for Vercel deployment (Windows compatible)

REM Set npm config to use registry with HTTPS
npm config set registry https://registry.npmjs.org/

REM Install with pnpm but with more lenient settings
pnpm install --no-frozen-lockfile --prefer-offline
if %errorlevel% neq 0 (
    pnpm install --no-frozen-lockfile
    if %errorlevel% neq 0 (
        npm install
    )
)

REM Build the project
pnpm build