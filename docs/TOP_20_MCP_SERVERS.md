# Top 20 Most Popular MCP Servers (2025)

This document provides a curated list of the top 20 most popular Model Context Protocol (MCP) servers as of 2025, based on GitHub stars, community adoption, and utility.

## What is MCP?

The Model Context Protocol (MCP) is an open protocol developed by Anthropic that enables seamless integration between Large Language Model (LLM) applications and external data sources or tools. Think of it as "USB-C for AI" - a universal standard for connecting AI models to various capabilities.

## The List

### 1. **MetaMCP** ⭐ 1.6k stars
**Repository**: https://github.com/metatool-ai/metamcp
**Description**: MCP Aggregator, Orchestrator, Middleware, and Gateway in one Docker container. Allows you to dynamically aggregate multiple MCP servers into a unified endpoint.
**Use Cases**: Hosting multiple MCP servers, applying middleware, creating unified endpoints

### 2. **GitHub MCP** ⭐ Popular
**Description**: Comprehensive GitHub API management (issues, PRs, code search, repositories)
**Use Cases**: Code review automation, issue management, repository analysis
**Tools**: Repository operations, pull requests, issues, code search

### 3. **Playwright MCP** ⭐ Popular
**Description**: Robust browser automation for testing and scraping
**Use Cases**: Web scraping, automated testing, browser control
**Tools**: Page navigation, element interaction, screenshot capture

### 4. **Filesystem MCP** ⭐ Popular
**Description**: Secure local and remote file system access (read/write/manage)
**Use Cases**: File management, code editing, directory operations
**Tools**: Read files, write files, list directories, search

### 5. **Google Drive MCP** ⭐ Popular
**Description**: AI-friendly interface for Google Drive file storage and collaboration
**Use Cases**: Document management, file sharing, cloud storage access
**Tools**: File upload/download, sharing, folder management

### 6. **Notion MCP** ⭐ Popular
**Description**: Secure access and automation for Notion knowledge bases
**Use Cases**: Knowledge base management, documentation, note-taking
**Tools**: Page creation, database queries, content updates

### 7. **MongoDB MCP** ⭐ Popular
**Description**: Structured database access for LLMs and agents
**Use Cases**: Database operations, data storage, NoSQL queries
**Tools**: CRUD operations, aggregations, indexing

### 8. **Supabase MCP** ⭐ Popular
**Description**: AI-enabled Postgres with real-time data sync
**Use Cases**: Database management, authentication, real-time updates
**Tools**: SQL queries, authentication, storage

### 9. **BigQuery MCP** ⭐ Popular
**Description**: Petabyte-scale data analytics via standardized LLM access
**Use Cases**: Data warehouse queries, analytics, big data
**Tools**: SQL queries, dataset management, job execution

### 10. **Jira MCP** ⭐ Popular
**Description**: Enterprise workflow automation tied to Atlassian JIRA
**Use Cases**: Project management, issue tracking, sprint planning
**Tools**: Issue creation, status updates, sprint management

### 11. **Sentry MCP** ⭐ Popular
**Description**: Real-time error tracking and bug-fixing trigger for agents
**Use Cases**: Error monitoring, debugging, performance tracking
**Tools**: Error queries, issue management, release tracking

### 12. **MindsDB** ⭐ Popular
**Description**: Federated AI queries over databases and data sources
**Use Cases**: Machine learning on databases, predictive analytics
**Tools**: ML model training, predictions, data integration

### 13. **Context7** ⭐ Popular
**Description**: Real-time code documentation and examples for AI-assisted coding
**Use Cases**: Code documentation, example generation, API references
**Tools**: Documentation search, code examples, API specs

### 14. **GPT Researcher** ⭐ Popular
**Description**: Web and local search automation for research reports
**Use Cases**: Research automation, content aggregation, report generation
**Tools**: Web search, content extraction, report compilation

### 15. **Task Master** ⭐ Popular
**Description**: AI-managed task workflows with Claude integration
**Use Cases**: Task management, workflow automation, project planning
**Tools**: Task creation, status tracking, dependency management

### 16. **FastMCP** ⭐ Popular
**Description**: A Pythonic framework for spinning up custom MCP servers quickly
**Use Cases**: Custom server development, rapid prototyping
**Tools**: Server framework, tool registration, handler setup

### 17. **Graphiti** ⭐ Popular
**Description**: Temporal knowledge graph building for agentic LLMs
**Use Cases**: Knowledge management, relationship mapping, temporal data
**Tools**: Graph creation, query execution, relationship tracking

### 18. **Serena** ⭐ Popular
**Description**: LLM-powered coding agent for semantic codebase management
**Use Cases**: Code analysis, refactoring, semantic search
**Tools**: Code search, refactoring, analysis

### 19. **Blender MCP** ⭐ Popular
**Description**: 3D scene/model control through Claude for prompt-driven design
**Use Cases**: 3D modeling, scene creation, animation
**Tools**: Object creation, material assignment, rendering

### 20. **Chrome DevTools MCP** ⭐ Popular
**Description**: Full-featured programmatic browser control and debugging
**Use Cases**: Web debugging, performance analysis, network inspection
**Tools**: Console access, network monitoring, DOM inspection

## Honorable Mentions

### Additional Notable MCP Servers

- **Atlassian MCP**: Confluence and Jira integration
- **Google Workspace MCP**: Gmail, Calendar, Docs integration
- **Algolia MCP**: Semantic search capabilities
- **Cloudflare Edge MCP**: Edge computing and CDN management
- **AWS Lambda MCP**: Serverless function management
- **Salesforce MCP**: CRM integration and automation
- **Obsidian MCP**: Knowledge base plugin for note-taking
- **Cursor MCP**: IDE integration for code editing
- **Slack MCP**: Team communication and automation
- **OpenAPI MCP**: REST API integration framework

## Categories

### Development & Code
- GitHub MCP
- Context7
- Serena
- Filesystem MCP
- Cursor MCP

### Database & Storage
- MongoDB MCP
- Supabase MCP
- BigQuery MCP
- Google Drive MCP

### Browser & Web
- Playwright MCP
- Chrome DevTools MCP

### Project Management
- Jira MCP
- Task Master
- Atlassian MCP

### Monitoring & Analytics
- Sentry MCP
- Cloudflare Edge MCP

### AI & ML
- MindsDB
- GPT Researcher
- Graphiti

### Productivity
- Notion MCP
- Obsidian MCP
- Google Workspace MCP

### Development Frameworks
- FastMCP
- MetaMCP

### Specialized Tools
- Blender MCP (3D modeling)
- PhoneInfoga MCP (OSINT)

## How to Use MCP Servers

### With MetaMCP (Recommended)

MetaMCP allows you to aggregate multiple MCP servers:

1. Install MetaMCP
2. Add server configurations
3. Create namespaces and endpoints
4. Connect your AI clients

### With Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"]
    }
  }
}
```

### With Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "package-name"]
    }
  }
}
```

## Building Your Own MCP Server

### Using FastMCP (Python)

```python
from fastmcp import FastMCP

mcp = FastMCP("My Server")

@mcp.tool()
def my_tool(input: str) -> str:
    return f"Processed: {input}"

mcp.run()
```

### Using TypeScript SDK

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({
  name: 'my-server',
  version: '1.0.0',
}, {
  capabilities: { tools: {} }
});
```

## Resources

- **MCP Specification**: https://modelcontextprotocol.io/
- **Official GitHub**: https://github.com/modelcontextprotocol
- **MCP Market**: https://mcpmarket.com/
- **TopMCP Directory**: https://topmcp.org/
- **MCP Hub**: https://www.aimcp.info/

## Contributing

Know of a popular MCP server that should be on this list? Contributions are welcome! Please open a pull request with:

1. Server name and repository link
2. Brief description
3. Primary use cases
4. Evidence of popularity (stars, downloads, usage)

## Updates

This list is maintained as of November 2025. The MCP ecosystem is rapidly evolving, and new servers are being created regularly.

Last updated: November 7, 2025
