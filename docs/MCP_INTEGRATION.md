# PhoneInfoga MCP Integration Guide

This guide provides comprehensive instructions for integrating PhoneInfoga with various MCP clients, including MetaMCP, Claude Desktop, Cursor, and other MCP-compatible tools.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Integration Methods](#integration-methods)
   - [MetaMCP Integration](#metamcp-integration)
   - [Claude Desktop Integration](#claude-desktop-integration)
   - [Cursor IDE Integration](#cursor-ide-integration)
   - [Generic MCP Client](#generic-mcp-client)
5. [Configuration Options](#configuration-options)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Use Cases](#use-cases)

## Overview

The PhoneInfoga MCP server exposes PhoneInfoga's OSINT capabilities through the Model Context Protocol, allowing AI assistants to:

- Validate phone numbers and retrieve basic information
- Run OSINT scans using various scanners
- Perform comprehensive phone number investigations
- Access carrier, country, and line type information

## Prerequisites

### Required Software

1. **PhoneInfoga**: The phone number investigation tool
   - Option A: Use Docker: `docker pull sundowndev/phoneinfoga`
   - Option B: Build from source (requires Go 1.20+)

2. **Node.js**: Version 18 or higher
   - Download from [nodejs.org](https://nodejs.org/)

3. **MCP Client**: One of the following:
   - [MetaMCP](https://github.com/metatool-ai/metamcp) (recommended for production)
   - [Claude Desktop](https://claude.ai/desktop)
   - [Cursor](https://cursor.sh/)
   - Any MCP-compatible client

### Optional Dependencies

For certain scanners, you may need API keys:
- `NUMVERIFY_API_KEY`: For Numverify scanner
- `GOOGLE_CSE_CX` and `GOOGLE_API_KEY`: For Google Custom Search scanner

## Quick Start

### 1. Start PhoneInfoga Server

```bash
# Using Docker (recommended)
docker run -d -p 5000:5000 --name phoneinfoga sundowndev/phoneinfoga serve

# Or build and run locally
git clone https://github.com/sundowndev/phoneinfoga.git
cd phoneinfoga
make build
./bin/phoneinfoga serve -p 5000
```

### 2. Build the MCP Server

```bash
cd phoneinfoga/mcp-server
npm install
npm run build
```

### 3. Test the Installation

```bash
# The MCP server should be able to connect to PhoneInfoga
PHONEINFOGA_API_URL=http://localhost:5000 node dist/index.js
```

The server should start and display: "PhoneInfoga MCP Server running on stdio"

## Integration Methods

### MetaMCP Integration

[MetaMCP](https://github.com/metatool-ai/metamcp) is a powerful MCP aggregator that allows you to host multiple MCP servers through a unified gateway.

#### Step 1: Install and Configure MetaMCP

```bash
git clone https://github.com/metatool-ai/metamcp.git
cd metamcp
cp example.env .env
# Edit .env with your configuration
docker compose up -d
```

#### Step 2: Add PhoneInfoga Server Configuration

In the MetaMCP web interface:

1. Navigate to **MCP Servers**
2. Click **Add New Server**
3. Use the following configuration:

```json
{
  "name": "PhoneInfoga",
  "type": "STDIO",
  "command": "node",
  "args": [
    "/path/to/phoneinfoga/mcp-server/dist/index.js"
  ],
  "env": {
    "PHONEINFOGA_API_URL": "http://localhost:5000"
  }
}
```

**For Docker deployments**, ensure the path is accessible within the MetaMCP container:

```json
{
  "name": "PhoneInfoga",
  "type": "STDIO",
  "command": "node",
  "args": [
    "/app/phoneinfoga/mcp-server/dist/index.js"
  ],
  "env": {
    "PHONEINFOGA_API_URL": "http://phoneinfoga:5000"
  }
}
```

#### Step 3: Create a Namespace

1. Navigate to **Namespaces**
2. Click **Create Namespace**
3. Add the PhoneInfoga server to the namespace
4. Enable the tools you want to expose

#### Step 4: Create an Endpoint

1. Navigate to **Endpoints**
2. Click **Create Endpoint**
3. Assign your namespace to the endpoint
4. Choose authentication method (API Key or OAuth)
5. Select transport protocol (SSE or Streamable HTTP)

#### Step 5: Use the Endpoint

Connect your MCP client to the MetaMCP endpoint:

```json
{
  "mcpServers": {
    "metamcp-phoneinfoga": {
      "url": "http://localhost:12008/metamcp/your-endpoint-name/sse",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Claude Desktop Integration

#### Configuration File Location

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### Configuration

```json
{
  "mcpServers": {
    "phoneinfoga": {
      "command": "node",
      "args": [
        "/absolute/path/to/phoneinfoga/mcp-server/dist/index.js"
      ],
      "env": {
        "PHONEINFOGA_API_URL": "http://localhost:5000"
      }
    }
  }
}
```

#### Restart Claude Desktop

After saving the configuration, restart Claude Desktop for changes to take effect.

### Cursor IDE Integration

#### Configuration File Location

Create or edit: `~/.cursor/mcp.json`

#### Configuration

```json
{
  "mcpServers": {
    "phoneinfoga": {
      "command": "node",
      "args": [
        "/absolute/path/to/phoneinfoga/mcp-server/dist/index.js"
      ],
      "env": {
        "PHONEINFOGA_API_URL": "http://localhost:5000"
      }
    }
  }
}
```

#### Restart Cursor

Restart Cursor IDE to load the new MCP server.

### Generic MCP Client

For any MCP-compatible client that supports STDIO transport:

```bash
# Set environment variable
export PHONEINFOGA_API_URL=http://localhost:5000

# Run the MCP server
node /path/to/phoneinfoga/mcp-server/dist/index.js
```

The server communicates via standard input/output using JSON-RPC messages.

## Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PHONEINFOGA_API_URL` | PhoneInfoga API endpoint | `http://localhost:5000` | Yes |
| `NUMVERIFY_API_KEY` | Numverify API key for validation | - | No |
| `GOOGLE_CSE_CX` | Google Custom Search Engine ID | - | No |
| `GOOGLE_API_KEY` | Google API key | - | No |

### Scanner Configuration

PhoneInfoga scanners can be configured through environment variables passed to the PhoneInfoga server. The MCP server will utilize these scanners automatically.

## Testing

### Test 1: Validate a Phone Number

Ask your AI assistant:

```
Validate this phone number: +14155552671
```

Expected response includes:
- Valid/invalid status
- Country and country code
- Carrier information
- Various formatted representations (E164, international, local)

### Test 2: Get Available Scanners

```
What scanners are available for phone number investigations?
```

Expected response lists available scanners with descriptions.

### Test 3: Run a Comprehensive Scan

```
Scan phone number +14155552671 for OSINT information
```

Expected response includes results from all available scanners.

### Test 4: Run a Specific Scanner

```
Run the local scanner on phone number +14155552671
```

## Troubleshooting

### Issue: Connection Refused

**Problem**: MCP server cannot connect to PhoneInfoga

**Solution**:
1. Verify PhoneInfoga is running: `curl http://localhost:5000/v2/scanners`
2. Check `PHONEINFOGA_API_URL` is correct
3. Ensure no firewall blocking the connection

### Issue: Scanner Errors

**Problem**: Scanner fails with authentication error

**Solution**:
1. Check if the scanner requires an API key
2. Set the appropriate environment variable
3. Restart both PhoneInfoga and the MCP server

### Issue: MCP Server Not Loading

**Problem**: Client doesn't recognize the MCP server

**Solution**:
1. Verify the path to `dist/index.js` is absolute
2. Check Node.js is in your PATH
3. Ensure the configuration file is in the correct location
4. Restart the MCP client

### Issue: Invalid Phone Number

**Problem**: All phone numbers are reported as invalid

**Solution**:
1. Use E164 format (e.g., +14155552671)
2. Include the country code
3. Remove any spaces or special characters

### Debug Mode

Enable debug logging by adding to your environment:

```bash
export NODE_ENV=development
```

## Use Cases

### 1. OSINT Investigation Workflow

```
1. Validate phone number: +1234567890
2. Get available scanners
3. Run comprehensive scan
4. Analyze results from each scanner
5. Cross-reference information
```

### 2. Automated Phone Number Verification

Integrate with your workflow to automatically verify phone numbers from a list or database.

### 3. Security Research

Use the MCP server in your security research workflow to gather information about phone numbers associated with potential threats.

### 4. Data Enrichment

Enrich your contact database with carrier, country, and line type information.

## Example Interactions

### Example 1: Basic Validation

**User**: "Is +14155552671 a valid phone number?"

**AI Response**: Uses `validate_phone_number` tool and reports:
- Validity: Yes
- Country: United States
- Carrier: Verizon
- Line Type: Mobile

### Example 2: Comprehensive Investigation

**User**: "Investigate phone number +33612345678"

**AI Response**: Uses `scan_phone_number` tool and provides:
- Basic validation information
- Results from each scanner
- Cross-referenced data points
- Summary of findings

### Example 3: Selective Scanning

**User**: "Scan +44203456789 but skip the Google search scanner"

**AI Response**: Uses `scan_phone_number` with `disabled_scanners` parameter.

## Best Practices

1. **Rate Limiting**: Be mindful of API rate limits for external scanners
2. **API Keys**: Store API keys securely, never commit to version control
3. **Privacy**: Respect privacy laws and regulations when investigating phone numbers
4. **Validation**: Always validate numbers before running expensive scans
5. **Error Handling**: Implement proper error handling for scanner failures

## Security Considerations

1. **API Key Management**: Use environment variables or secure vaults for API keys
2. **Network Security**: Use HTTPS when exposing the PhoneInfoga API remotely
3. **Access Control**: Implement authentication in MetaMCP when hosting publicly
4. **Data Privacy**: Be aware of GDPR and other privacy regulations
5. **Rate Limiting**: Implement rate limiting to prevent abuse

## Further Resources

- [PhoneInfoga Documentation](https://sundowndev.github.io/phoneinfoga/)
- [MetaMCP Documentation](https://docs.metamcp.com)
- [MCP Specification](https://modelcontextprotocol.io/)
- [PhoneInfoga GitHub](https://github.com/sundowndev/phoneinfoga)
- [MetaMCP GitHub](https://github.com/metatool-ai/metamcp)

## Contributing

Contributions to improve this integration are welcome! Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) file for guidelines.

## License

This integration follows the same license as PhoneInfoga: GPL-3.0
