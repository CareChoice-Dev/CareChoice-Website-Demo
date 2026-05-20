import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

/**
 * Minimal MCP HTTP transport.
 *
 * Implements JSON-RPC 2.0 over HTTP POST. Two methods supported:
 * - tools/list — returns the available tools
 * - tools/call — invokes a tool by name with arguments
 *
 * Auth: Bearer token check against process.env.MCP_API_KEY.
 *
 * Tools exposed:
 * - payload_create_news        — create a News article draft
 * - payload_create_case_study  — create a Case Study draft
 */

interface MCPRequest {
  jsonrpc: '2.0'
  id: number | string
  method: string
  params?: Record<string, unknown>
}

interface MCPToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, { type: string; description?: string }>
    required: string[]
  }
}

const TOOLS: MCPToolDefinition[] = [
  {
    name: 'payload_create_news',
    description:
      'Create a News article draft in Payload. The draft is created under the en locale and will appear at /en/news/<slug> once published in /admin.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            'Article title; sentence case ending with a full stop per brand voice.',
        },
        slug: {
          type: 'string',
          description:
            'URL slug; lower-case, hyphenated, year-suffixed for uniqueness, e.g. "new-home-footscray-2026".',
        },
        excerpt: {
          type: 'string',
          description: 'Short excerpt (1-2 sentences) for the news index card.',
        },
      },
      required: ['title', 'slug'],
    },
  },
  {
    name: 'payload_create_case_study',
    description:
      'Create a Case Study draft in Payload. consentRecorded is set to false by default — marketing must confirm consent in /admin before publishing.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Story title; sentence case ending with a full stop.',
        },
        slug: {
          type: 'string',
          description: 'URL slug; lower-case, hyphenated.',
        },
        participantName: {
          type: 'string',
          description:
            'Full name or pseudonym; consent required before publishing.',
        },
        summary: {
          type: 'string',
          description: 'Short summary for the case-studies index card.',
        },
      },
      required: ['title', 'slug', 'participantName'],
    },
  },
]

function jsonRpcError(
  id: number | string | null,
  code: number,
  message: string,
) {
  return NextResponse.json(
    { jsonrpc: '2.0', id, error: { code, message } },
    { status: code === -32001 ? 401 : 200 },
  )
}

export async function POST(request: NextRequest) {
  const expectedKey = process.env.MCP_API_KEY
  if (!expectedKey) {
    return jsonRpcError(
      null,
      -32603,
      'Server misconfigured: MCP_API_KEY is not set.',
    )
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${expectedKey}`) {
    return jsonRpcError(null, -32001, 'Unauthorized')
  }

  let body: MCPRequest
  try {
    body = (await request.json()) as MCPRequest
  } catch {
    return jsonRpcError(null, -32700, 'Parse error')
  }

  if (body.method === 'tools/list') {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: body.id,
      result: { tools: TOOLS },
    })
  }

  if (body.method === 'tools/call') {
    const params = body.params as
      | { name: string; arguments: Record<string, string> }
      | undefined
    if (!params?.name) {
      return jsonRpcError(body.id, -32602, 'Invalid params: missing tool name')
    }

    const payload = await getPayloadClient()

    if (params.name === 'payload_create_news') {
      const args = params.arguments ?? {}
      if (!args.title || !args.slug) {
        return jsonRpcError(
          body.id,
          -32602,
          'Invalid params: title and slug required',
        )
      }
      const result = await payload.create({
        collection: 'news',
        data: {
          title: args.title,
          slug: args.slug,
          publishDate: new Date().toISOString(),
          excerpt: args.excerpt ?? '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        draft: true,
        locale: 'en',
      })
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          content: [
            {
              type: 'text',
              text: `Created news draft (id: ${result.id}, slug: ${args.slug}). Publish from /admin to make it live.`,
            },
          ],
        },
      })
    }

    if (params.name === 'payload_create_case_study') {
      const args = params.arguments ?? {}
      if (!args.title || !args.slug || !args.participantName) {
        return jsonRpcError(
          body.id,
          -32602,
          'Invalid params: title, slug, and participantName required',
        )
      }
      const result = await payload.create({
        collection: 'case-studies',
        data: {
          title: args.title,
          slug: args.slug,
          participantName: args.participantName,
          consentRecorded: false,
          summary: args.summary ?? '',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        draft: true,
        locale: 'en',
      })
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          content: [
            {
              type: 'text',
              text: `Created case study draft (id: ${result.id}, slug: ${args.slug}). Marketing needs to confirm consent in /admin before publishing.`,
            },
          ],
        },
      })
    }

    return jsonRpcError(body.id, -32601, `Method not found: tool ${params.name}`)
  }

  return jsonRpcError(body.id, -32601, `Method not found: ${body.method}`)
}
