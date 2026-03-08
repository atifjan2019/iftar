import { NextResponse } from 'next/server';
import { getStats } from '@/lib/data';

export async function POST(request) {
    try {
        const body = await request.json();
        const password = body.password || '';

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const stats = await getStats();
        return NextResponse.json({ success: true, ...stats });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
