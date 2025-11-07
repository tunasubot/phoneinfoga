# PhoneInfoga MCP Server

This is a Model Context Protocol (MCP) server for [PhoneInfoga](https://github.com/sundowndev/phoneinfoga), enabling AI assistants to perform OSINT investigations on phone numbers.

## Features

The MCP server exposes PhoneInfoga's capabilities through MCP tools:

- **validate_phone_number**: Validate a phone number and get basic information (country, carrier, format)
- **get_available_scanners**: Get a list of all available OSINT scanners
- **run_phone_scanner**: Run a specific OSINT scanner on a phone number
- **scan_phone_number**: Perform a comprehensive scan using all available scanners

## Prerequisites

1. PhoneInfoga server must be running (default: `http://localhost:5000`)
2. Node.js 18+ installed
3. npm or pnpm installed

## Installation

### Option 1: Install from npm (when published)

```bash
npm install -g phoneinfoga-mcp-server
```

### Option 2: Build from source

```bash
cd mcp-server
npm install
npm run build
```

## Usage

### Starting PhoneInfoga Server

First, start the PhoneInfoga server:

```bash
# Using Docker
docker run -p 5000:5000 sundowndev/phoneinfoga serve

# Or build and run locally
make build
./bin/phoneinfoga serve -p 5000
```

### Running the MCP Server

#### With npm

```bash
# If installed globally
phoneinfoga-mcp

# Or using npx
npx phoneinfoga-mcp-server
```

#### From source

```bash
cd mcp-server
npm run dev
```

### Environment Variables

- `PHONEINFOGA_API_URL`: PhoneInfoga API URL (default: `http://localhost:5000`)

## Integration with MetaMCP

[MetaMCP](https://github.com/metatool-ai/metamcp) is an MCP aggregator that allows you to host and manage multiple MCP servers through a unified gateway.

### MetaMCP Configuration

Add this configuration to your MetaMCP instance:

```json
{
  "PhoneInfoga": {
    "type": "STDIO",
    "command": "node",
    "args": ["/path/to/phoneinfoga/mcp-server/dist/index.js"],
    "env": {
      "PHONEINFOGA_API_URL": "http://localhost:5000"
    }
  }
}
```

Or if you're using Docker with MetaMCP:

```json
{
  "PhoneInfoga": {
    "type": "STDIO", 
    "command": "node",
    "args": ["/app/phoneinfoga/mcp-server/dist/index.js"],
    "env": {
      "PHONEINFOGA_API_URL": "${PHONEINFOGA_API_URL}"
    }
  }
}
```

### Using with Claude Desktop

Add this to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "phoneinfoga": {
      "command": "node",
      "args": ["/path/to/phoneinfoga/mcp-server/dist/index.js"],
      "env": {
        "PHONEINFOGA_API_URL": "http://localhost:5000"
      }
    }
  }
}
```

### Using with Cursor

Add this to your Cursor MCP configuration (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "phoneinfoga": {
      "command": "node",
      "args": ["/path/to/phoneinfoga/mcp-server/dist/index.js"],
      "env": {
        "PHONEINFOGA_API_URL": "http://localhost:5000"
      }
    }
  }
}
```

## Available Tools

### 1. validate_phone_number

Validates a phone number and returns basic information.

**Input:**
```json
{
  "phone_number": "+14155552671"
}
```

**Output:**
```json
{
  "valid": true,
  "rawLocal": "4155552671",
  "local": "(415) 555-2671",
  "e164": "+14155552671",
  "international": "+1 415-555-2671",
  "countryCode": 1,
  "country": "US",
  "carrier": "Verizon"
}
```

### 2. get_available_scanners

Returns a list of all available OSINT scanners.

**Input:**
```json
{}
```

**Output:**
```json
{
  "scanners": [
    {
      "name": "local",
      "description": "Local phone number information"
    },
    {
      "name": "numverify",
      "description": "Numverify API scanner"
    },
    {
      "name": "googlesearch",
      "description": "Google search for phone number"
    }
  ]
}
```

### 3. run_phone_scanner

Runs a specific scanner on a phone number.

**Input:**
```json
{
  "scanner_name": "local",
  "phone_number": "+14155552671",
  "options": {}
}
```

### 4. scan_phone_number

Performs a comprehensive scan using all available scanners.

**Input:**
```json
{
  "phone_number": "+14155552671",
  "disabled_scanners": ["googlesearch"]
}
```

## Docker Deployment

To deploy both PhoneInfoga and the MCP server using Docker:

```dockerfile
# In your Dockerfile
FROM node:18-alpine

# Install PhoneInfoga
RUN apk add --no-cache go git make && \
    git clone https://github.com/sundowndev/phoneinfoga.git /app/phoneinfoga && \
    cd /app/phoneinfoga && \
    make build

# Build MCP server
WORKDIR /app/phoneinfoga/mcp-server
RUN npm install && npm run build

# Start both services
CMD sh -c "cd /app/phoneinfoga && ./bin/phoneinfoga serve -p 5000 & sleep 5 && node /app/phoneinfoga/mcp-server/dist/index.js"
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run watch

# Run
npm start
```

## Security Considerations

- PhoneInfoga performs OSINT investigations that may involve querying external services
- Some scanners require API keys (set via environment variables)
- Rate limiting may apply to external services
- Be mindful of privacy and legal considerations when investigating phone numbers

## License

This MCP server follows the same license as PhoneInfoga: GPL-3.0

## Links

- [PhoneInfoga](https://github.com/sundowndev/phoneinfoga)
- [MetaMCP](https://github.com/metatool-ai/metamcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
