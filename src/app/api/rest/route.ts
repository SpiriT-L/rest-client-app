import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { url, method, headers, body } = await request.json();

    const response = await fetch(url, {
      method,
      headers: headers || {},
      body: body || undefined,
    });

    const responseBody = await response.text();

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      body: responseBody,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to make request: ${error}` },
      { status: 500 }
    );
  }
}
