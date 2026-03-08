import { NextResponse } from 'next/server';
import { getCount } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await getCount();
        return NextResponse.json({ success: true, ...count });
    } catch (error) {
        console.error('Count error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
