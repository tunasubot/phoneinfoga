#!/bin/bash

# PhoneInfoga MCP Server Quick Start Script
# This script helps you quickly set up and test the PhoneInfoga MCP server

set -e

echo "🚀 PhoneInfoga MCP Server Quick Start"
echo "======================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Navigate to mcp-server directory
cd "$(dirname "$0")"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""

# Build the TypeScript
echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build complete"
echo ""

# Check if PhoneInfoga is running
PHONEINFOGA_URL="${PHONEINFOGA_API_URL:-http://localhost:5000}"
echo "🔍 Checking PhoneInfoga server at $PHONEINFOGA_URL..."

if curl -s -f "$PHONEINFOGA_URL/v2/scanners" > /dev/null 2>&1; then
    echo "✅ PhoneInfoga server is running"
else
    echo "⚠️  PhoneInfoga server is not responding at $PHONEINFOGA_URL"
    echo ""
    echo "Please start PhoneInfoga first:"
    echo "  Docker:  docker run -d -p 5000:5000 sundowndev/phoneinfoga serve"
    echo "  Local:   ./bin/phoneinfoga serve -p 5000"
    echo ""
    echo "Or set PHONEINFOGA_API_URL environment variable to your PhoneInfoga instance:"
    echo "  export PHONEINFOGA_API_URL=http://your-server:5000"
    echo ""
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the MCP server, run:"
echo "  node dist/index.js"
echo ""
echo "Or with custom PhoneInfoga URL:"
echo "  PHONEINFOGA_API_URL=http://your-server:5000 node dist/index.js"
echo ""
echo "📚 Documentation:"
echo "  - MCP Integration Guide: ../docs/MCP_INTEGRATION.md"
echo "  - README: ./README.md"
echo "  - Examples: ./examples/"
echo ""
