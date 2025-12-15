import { NextResponse } from 'next/server';
import { generateCardMetadata } from '@/lib/ai-service';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, type } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                error: 'API Key missing',
                details: 'Please add GEMINI_API_KEY to your .env.local file'
            }, { status: 500 });
        }

        const validTypes = ['text', 'link', 'image'];
        const contextType = validTypes.includes(type) ? type : 'text';

        const data = await generateCardMetadata(content, contextType as 'text' | 'link' | 'image');

        return NextResponse.json(data);
    } catch (error) {
        console.error('Analysis API Error:', error);
        return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 });
    }
}
