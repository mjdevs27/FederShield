import { NextRequest, NextResponse } from 'next/server';

const REMOTE_BASE_URL = 'http://127.0.0.1:8000/api';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const searchParams = req.nextUrl.searchParams.toString();
    const fullPath = (await params).path.join('/') + (searchParams ? '?' + searchParams : '');
    return handleRequest(req, fullPath, 'GET');
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, (await params).path.join('/'), 'POST');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, (await params).path.join('/'), 'PUT');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, (await params).path.join('/'), 'DELETE');
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, (await params).path.join('/'), 'PATCH');
}

async function handleRequest(req: NextRequest, path: string, method: string) {
    const targetUrl = `${REMOTE_BASE_URL}/${path}`;
    const contentType = req.headers.get('content-type') || '';

    try {
        let body;
        if (method !== 'GET' && method !== 'HEAD') {
            if (contentType.includes('multipart/form-data')) {
                body = await req.formData();
            } else if (contentType.includes('application/json')) {
                body = await req.json();
            }
        }

        const res = await fetch(targetUrl, {
            method,
            headers: contentType.includes('application/json') ? { 'Content-Type': 'application/json' } : {},
            body: body ? (contentType.includes('multipart/form-data') ? body : JSON.stringify(body)) : undefined
        });

        const resContentType = res.headers.get('content-type') || '';
        if (resContentType.includes('application/json')) {
            const data = await res.json();
            return NextResponse.json(data, { status: res.status });
        } else {
            const data = await res.arrayBuffer();
            return new NextResponse(data, { status: res.status });
        }
    } catch (err) {
        return NextResponse.json({ error: `GCP Hub ${method} Error` }, { status: 502 });
    }
}
