import { NextRequest, NextResponse } from 'next/server';

const REMOTE_BASE_URL = 'http://34.93.170.91:8000/api';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = (await params).path.join('/');
    const searchParams = req.nextUrl.searchParams.toString();
    const targetUrl = `${REMOTE_BASE_URL}/${path}${searchParams ? '?' + searchParams : ''}`;

    try {
        const res = await fetch(targetUrl);
        const data = await res.arrayBuffer();

        const headers = new Headers();
        res.headers.forEach((value, key) => {
            if (key.toLowerCase().startsWith('x-')) headers.set(key, value);
        });
        headers.set('Content-Type', res.headers.get('Content-Type') || 'application/octet-stream');
        headers.set('Access-Control-Expose-Headers', '*');

        return new NextResponse(data, { status: res.status, headers });
    } catch (err) {
        return NextResponse.json({ error: "Failed to connect to GCP Hub" }, { status: 502 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = (await params).path.join('/');
    const targetUrl = `${REMOTE_BASE_URL}/${path}`;

    const contentType = req.headers.get('content-type') || '';

    try {
        let body;
        if (contentType.includes('multipart/form-data')) {
            // Specifically handle multipart for the GCP Hub
            body = await req.formData();
        } else {
            body = await req.json();
        }

        const res = await fetch(targetUrl, {
            method: 'POST',
            // Do NOT set content-type for multipart; let fetch generate boundary
            headers: contentType.includes('application/json') ? { 'Content-Type': 'application/json' } : {},
            body: contentType.includes('multipart/form-data') ? body : JSON.stringify(body)
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
        return NextResponse.json({ error: "GCP Hub Communication Error" }, { status: 502 });
    }
}
