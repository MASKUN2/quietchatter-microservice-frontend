import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { callApiGateway } from '@/lib/api-gateway';

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const session = await getSession(request);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await params;
  const targetPath = `/${path.join('/')}`;
  const searchParams = request.nextUrl.searchParams.toString();
  const fullPath = searchParams ? `${targetPath}?${searchParams}` : targetPath;

  const method = request.method;
  const headers = new Headers(request.headers);
  
  // Remove headers that might conflict or should be set by callApiGateway
  headers.delete('host');
  headers.delete('connection');
  headers.delete('cookie');

  let body: string | undefined = undefined;
  if (!['GET', 'HEAD'].includes(method)) {
    try {
      body = await request.text();
    } catch (error) {
      console.error('Failed to read request body:', error);
    }
  }

  try {
    const response = await callApiGateway(fullPath, {
      method,
      headers,
      body,
    }, session.memberId);

    const data = await response.text();
    
    const responseHeaders = new Headers(response.headers);
    // Remove headers that might conflict
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy request failed:', error);
    return NextResponse.json({ error: 'Gateway error' }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
