FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY mcp-server/package.json mcp-server/package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source files
COPY mcp-server/tsconfig.json ./
COPY mcp-server/src ./src

# Build TypeScript
RUN npm run build

# Set environment variable
ENV PHONEINFOGA_API_URL=http://localhost:5000

# Run the MCP server
CMD ["node", "dist/index.js"]
