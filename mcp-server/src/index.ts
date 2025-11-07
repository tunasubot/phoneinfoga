#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';

// PhoneInfoga API client
class PhoneInfogaClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:5000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async validateNumber(phoneNumber: string) {
    const response = await this.client.post('/v2/numbers', {
      number: phoneNumber,
    });
    return response.data;
  }

  async getAvailableScanners() {
    const response = await this.client.get('/v2/scanners');
    return response.data;
  }

  async runScanner(scannerName: string, phoneNumber: string, options: Record<string, any> = {}) {
    const response = await this.client.post(`/v2/scanners/${scannerName}/run`, {
      number: phoneNumber,
      options: options,
    });
    return response.data;
  }

  async dryRunScanner(scannerName: string, phoneNumber: string, options: Record<string, any> = {}) {
    const response = await this.client.post(`/v2/scanners/${scannerName}/dryrun`, {
      number: phoneNumber,
      options: options,
    });
    return response.data;
  }
}

// MCP Server implementation
class PhoneInfogaMCPServer {
  private server: Server;
  private client: PhoneInfogaClient;

  constructor() {
    this.server = new Server(
      {
        name: 'phoneinfoga-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Get PhoneInfoga API URL from environment variable or use default
    const apiURL = process.env.PHONEINFOGA_API_URL || 'http://localhost:5000';
    this.client = new PhoneInfogaClient(apiURL);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: 'validate_phone_number',
          description: 'Validate a phone number and get basic information (country, carrier, format)',
          inputSchema: {
            type: 'object',
            properties: {
              phone_number: {
                type: 'string',
                description: 'Phone number in E164 or international format (e.g., +1234567890)',
              },
            },
            required: ['phone_number'],
          },
        },
        {
          name: 'get_available_scanners',
          description: 'Get a list of all available OSINT scanners for phone numbers',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'run_phone_scanner',
          description: 'Run a specific OSINT scanner on a phone number to gather information',
          inputSchema: {
            type: 'object',
            properties: {
              scanner_name: {
                type: 'string',
                description: 'Name of the scanner to run (use get_available_scanners to see options)',
              },
              phone_number: {
                type: 'string',
                description: 'Phone number in E164 or international format',
              },
              options: {
                type: 'object',
                description: 'Optional scanner-specific options',
                default: {},
              },
            },
            required: ['scanner_name', 'phone_number'],
          },
        },
        {
          name: 'scan_phone_number',
          description: 'Perform a comprehensive scan on a phone number using all available scanners',
          inputSchema: {
            type: 'object',
            properties: {
              phone_number: {
                type: 'string',
                description: 'Phone number in E164 or international format',
              },
              disabled_scanners: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'List of scanner names to skip during the scan',
                default: [],
              },
            },
            required: ['phone_number'],
          },
        },
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'validate_phone_number': {
            const args = request.params.arguments as { phone_number: string };
            const result = await this.client.validateNumber(args.phone_number);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'get_available_scanners': {
            const result = await this.client.getAvailableScanners();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'run_phone_scanner': {
            const args = request.params.arguments as {
              scanner_name: string;
              phone_number: string;
              options?: Record<string, any>;
            };
            const result = await this.client.runScanner(
              args.scanner_name,
              args.phone_number,
              args.options || {}
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'scan_phone_number': {
            const args = request.params.arguments as {
              phone_number: string;
              disabled_scanners?: string[];
            };

            // First validate the number
            const validation = await this.client.validateNumber(args.phone_number);
            
            if (!validation.valid) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      error: 'Invalid phone number',
                      validation: validation,
                    }, null, 2),
                  },
                ],
              };
            }

            // Get all available scanners
            const scannersResponse = await this.client.getAvailableScanners();
            const scanners = scannersResponse.scanners || [];
            
            // Filter out disabled scanners
            const disabledSet = new Set(args.disabled_scanners || []);
            const enabledScanners = scanners.filter(
              (s: any) => !disabledSet.has(s.name)
            );

            // Run all enabled scanners
            const results: any = {
              validation: validation,
              scanners: {},
              errors: {},
            };

            for (const scanner of enabledScanners) {
              try {
                const scanResult = await this.client.runScanner(
                  scanner.name,
                  args.phone_number,
                  {}
                );
                results.scanners[scanner.name] = scanResult;
              } catch (error: any) {
                results.errors[scanner.name] = error.message || 'Unknown error';
              }
            }

            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(results, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error.message || 'Unknown error occurred',
                details: error.response?.data || null,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('PhoneInfoga MCP Server running on stdio');
  }
}

// Start the server
const server = new PhoneInfogaMCPServer();
server.run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
