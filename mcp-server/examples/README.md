# MetaMCP Configuration Example for PhoneInfoga

This directory contains example configurations for integrating PhoneInfoga with MetaMCP.

## Quick Start

1. **Start PhoneInfoga Server**:
   ```bash
   docker run -d -p 5000:5000 sundowndev/phoneinfoga serve
   ```

2. **Add to MetaMCP**: Copy the configuration from `metamcp-config.json` into your MetaMCP server configuration.

3. **Create a namespace** in MetaMCP and add the PhoneInfoga server to it.

4. **Create an endpoint** and assign the namespace to it.

5. **Use the endpoint** from your MCP clients (Claude, Cursor, etc.).

## Configuration Files

- `metamcp-config.json`: Server configuration for MetaMCP
- `claude-desktop-config.json`: Direct integration with Claude Desktop (without MetaMCP)
- `cursor-config.json`: Direct integration with Cursor (without MetaMCP)

## Using with Docker Compose

If you want to run everything together, see `docker-compose.example.yml`.

## Environment Variables

For scanner API keys and configuration, you can set environment variables in the MetaMCP server config:

```json
{
  "PhoneInfoga": {
    "type": "STDIO",
    "command": "node",
    "args": ["/path/to/phoneinfoga/mcp-server/dist/index.js"],
    "env": {
      "PHONEINFOGA_API_URL": "http://localhost:5000",
      "NUMVERIFY_API_KEY": "${NUMVERIFY_API_KEY}",
      "GOOGLE_CSE_CX": "${GOOGLE_CSE_CX}",
      "GOOGLE_API_KEY": "${GOOGLE_API_KEY}"
    }
  }
}
```

## Testing the Integration

Once configured, you can test the integration by asking your AI assistant:

```
Validate this phone number: +14155552671
```

or

```
Scan phone number +14155552671 for OSINT information
```

## Troubleshooting

1. **Connection Error**: Ensure PhoneInfoga server is running on the specified URL
2. **Scanner Errors**: Some scanners require API keys - check environment variables
3. **Permission Issues**: Ensure the MCP server has necessary permissions to access PhoneInfoga API

## More Information

- [PhoneInfoga Documentation](https://sundowndev.github.io/phoneinfoga/)
- [MetaMCP Documentation](https://docs.metamcp.com)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
