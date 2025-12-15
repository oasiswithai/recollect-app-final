import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Auto-prepend https:// if missing
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch URL' }, { status: res.status });
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
        const image = $('meta[property="og:image"]').attr('content') || '';

        return NextResponse.json({
            title,
            description,
            image,
        });
    } catch (error) {
        console.error('Link preview error:', error);
        return NextResponse.json({ error: 'Failed to parse URL' }, { status: 500 });
    }
}
