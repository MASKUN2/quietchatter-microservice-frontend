const INTERNAL_API_GATEWAY_URL = process.env.INTERNAL_API_GATEWAY_URL || 'http://localhost:8080';

export async function callApiGateway(
  path: string,
  options: RequestInit = {},
  memberId?: number
): Promise<Response> {
  const url = `${INTERNAL_API_GATEWAY_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const headers = new Headers(options.headers);
  if (memberId !== undefined) {
    headers.set('X-Member-Id', memberId.toString());
  }
  
  // Ensure default content-type if body exists and not set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
