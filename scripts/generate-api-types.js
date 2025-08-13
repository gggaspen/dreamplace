#!/usr/bin/env node
/**
 * Generate TypeScript types from OpenAPI/Strapi schema
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'infrastructure', 'api', 'generated');
const SCHEMA_FILE = path.join(OUTPUT_DIR, 'schema.json');
const TYPES_FILE = path.join(OUTPUT_DIR, 'api-types.ts');

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

/**
 * Generate OpenAPI schema from Strapi endpoint
 */
async function generateSchema() {
  console.log('📥 Fetching OpenAPI schema from Strapi...');
  
  try {
    // Try to fetch from Strapi's documentation plugin
    const schemaUrl = `${API_BASE_URL}/api/documentation/1.0.0/full_documentation.json`;
    
    const response = await fetch(schemaUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const schema = await response.json();
    fs.writeFileSync(SCHEMA_FILE, JSON.stringify(schema, null, 2));
    
    console.log('✅ Schema generated successfully');
    return true;
  } catch (error) {
    console.warn('⚠️  Could not fetch OpenAPI schema from Strapi:', error.message);
    return false;
  }
}

/**
 * Generate a basic schema based on our domain entities
 */
function generateBasicSchema() {
  console.log('📝 Generating basic schema from domain entities...');
  
  const basicSchema = {
    openapi: '3.0.0',
    info: {
      title: 'DreamPlace API',
      version: '1.0.0',
      description: 'Auto-generated API schema for DreamPlace application'
    },
    servers: [
      {
        url: API_BASE_URL,
        description: 'API Server'
      }
    ],
    paths: {
      '/api/events': {
        get: {
          summary: 'Get all events',
          responses: {
            '200': {
              description: 'List of events',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/EventListResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/api/events/{id}': {
        get: {
          summary: 'Get event by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Event details',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/EventResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/api/artists': {
        get: {
          summary: 'Get all artists',
          responses: {
            '200': {
              description: 'List of artists',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ArtistListResponse'
                  }
                }
              }
            }
          }
        }
      },
      '/api/hero-sections': {
        get: {
          summary: 'Get hero sections',
          responses: {
            '200': {
              description: 'Hero section data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/HeroSectionResponse'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        StrapiEntity: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            attributes: { type: 'object' }
          },
          required: ['id', 'attributes']
        },
        StrapiResponse: {
          type: 'object',
          properties: {
            data: { type: 'object' },
            meta: {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'number' },
                    pageSize: { type: 'number' },
                    pageCount: { type: 'number' },
                    total: { type: 'number' }
                  }
                }
              }
            }
          },
          required: ['data']
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            isActive: { type: 'boolean' },
            imageUrl: { type: 'string' },
            ticketUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'name', 'startDate', 'endDate']
        },
        Artist: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            bio: { type: 'string' },
            genre: { type: 'string' },
            imageUrl: { type: 'string' },
            socialLinks: {
              type: 'object',
              properties: {
                spotify: { type: 'string' },
                instagram: { type: 'string' },
                soundcloud: { type: 'string' },
                website: { type: 'string' }
              }
            },
            isResident: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'name']
        },
        HeroSection: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            subtitle: { type: 'string' },
            backgroundImageUrl: { type: 'string' },
            ctaText: { type: 'string' },
            ctaUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'title']
        },
        ContactInfo: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            socialLinks: {
              type: 'object',
              properties: {
                instagram: { type: 'string' },
                facebook: { type: 'string' },
                twitter: { type: 'string' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          },
          required: ['id', 'email']
        },
        EventResponse: {
          allOf: [
            { $ref: '#/components/schemas/StrapiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Event' }
              }
            }
          ]
        },
        EventListResponse: {
          allOf: [
            { $ref: '#/components/schemas/StrapiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Event' }
                }
              }
            }
          ]
        },
        ArtistResponse: {
          allOf: [
            { $ref: '#/components/schemas/StrapiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/Artist' }
              }
            }
          ]
        },
        ArtistListResponse: {
          allOf: [
            { $ref: '#/components/schemas/StrapiResponse' },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Artist' }
                }
              }
            }
          ]
        },
        HeroSectionResponse: {
          allOf: [
            { $ref: '#/components/schemas/StrapiResponse' },
            {
              type: 'object',
              properties: {
                data: { $ref: '#/components/schemas/HeroSection' }
              }
            }
          ]
        }
      }
    }
  };

  fs.writeFileSync(SCHEMA_FILE, JSON.stringify(basicSchema, null, 2));
  console.log('✅ Basic schema generated successfully');
}

/**
 * Generate TypeScript types from OpenAPI schema
 */
function generateTypes() {
  console.log('🔧 Generating TypeScript types...');
  
  try {
    // Use openapi-typescript to generate types
    execSync(`npx openapi-typescript "${SCHEMA_FILE}" --output "${TYPES_FILE}"`, {
      stdio: 'inherit'
    });
    
    console.log('✅ TypeScript types generated successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to generate TypeScript types:', error.message);
    return false;
  }
}

/**
 * Generate API client from schema
 */
function generateClient() {
  console.log('🏗️  Generating API client...');
  
  const clientFile = path.join(OUTPUT_DIR, 'api-client.ts');
  
  try {
    execSync(`npx swagger-typescript-api -p "${SCHEMA_FILE}" -o "${OUTPUT_DIR}" -n "api-client.ts" --modular --axios`, {
      stdio: 'inherit'
    });
    
    console.log('✅ API client generated successfully');
    return true;
  } catch (error) {
    console.warn('⚠️  Could not generate full API client, creating basic client...');
    
    // Create a basic typed client wrapper
    const basicClientContent = `
// Auto-generated API client
import { typedApiClient } from '../client/TypedApiClient';

export const apiClient = typedApiClient;
export type { ApiEndpoints, TypedApiResponse } from '../client/TypedApiClient';

// Export the generated types
export type * from './api-types';
`;
    
    fs.writeFileSync(clientFile, basicClientContent.trim());
    return true;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting API type generation...\n');
  
  ensureOutputDir();
  
  // Try to generate schema from Strapi, fallback to basic schema
  const schemaGenerated = await generateSchema();
  if (!schemaGenerated) {
    generateBasicSchema();
  }
  
  // Generate TypeScript types
  const typesGenerated = generateTypes();
  if (!typesGenerated) {
    console.error('❌ Failed to generate types, exiting...');
    process.exit(1);
  }
  
  // Generate API client
  generateClient();
  
  console.log('\n🎉 API type generation completed!');
  console.log(`📁 Generated files:`);
  console.log(`   - ${SCHEMA_FILE}`);
  console.log(`   - ${TYPES_FILE}`);
  console.log(`   - ${path.join(OUTPUT_DIR, 'api-client.ts')}`);
}

// Add fetch polyfill for Node.js < 18
if (typeof fetch === 'undefined') {
  global.fetch = require('cross-fetch');
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});