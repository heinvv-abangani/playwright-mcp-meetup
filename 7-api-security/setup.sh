#!/bin/bash

# Playwright MCP Demo Setup Script
# This script sets up everything you need for the demo

set -e

echo "🚀 Playwright MCP Security Demo Setup"
echo "======================================"
echo ""

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    CONFIG_PATH="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
    CONFIG_PATH="$APPDATA/Claude/claude_desktop_config.json"
else
    OS="linux"
    CONFIG_PATH="$HOME/.config/Claude/claude_desktop_config.json"
fi

echo "Detected OS: $OS"
echo "Config path: $CONFIG_PATH"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if config directory exists
CONFIG_DIR=$(dirname "$CONFIG_PATH")
if [ ! -d "$CONFIG_DIR" ]; then
    echo "📁 Creating config directory: $CONFIG_DIR"
    mkdir -p "$CONFIG_DIR"
fi

# Backup existing config if it exists
if [ -f "$CONFIG_PATH" ]; then
    echo "💾 Backing up existing config to ${CONFIG_PATH}.backup"
    cp "$CONFIG_PATH" "${CONFIG_PATH}.backup"
fi

# Create or update config
echo "⚙️  Configuring Playwright MCP..."

if [ -f "$CONFIG_PATH" ]; then
    # Config exists, need to merge
    echo "Existing config found. Please manually add this to your config:"
    echo ""
    echo "  \"playwright\": {"
    echo "    \"command\": \"npx\","
    echo "    \"args\": [\"@playwright/mcp@latest\"]"
    echo "  }"
    echo ""
else
    # Create new config
    cat > "$CONFIG_PATH" << 'EOF'
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
EOF
    echo "✅ Created new config file"
fi

echo ""

# Install Playwright browsers
echo "📦 Installing Playwright browsers (this may take a few minutes)..."
npx playwright install chromium

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Restart Claude Desktop (quit completely and reopen)"
echo "2. Start the test server:"
echo "   cd test-site"
echo "   npx http-server -p 8080"
echo "3. In Claude Desktop, try this prompt:"
echo "   'Navigate to http://localhost:8080 and find security issues'"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICK_START.md"
echo "   - Demo Guide: DEMO_GUIDE.md"
echo "   - Ready Prompts: DEMO_PROMPTS.md"
echo ""
echo "🎉 You're ready to demo!"
