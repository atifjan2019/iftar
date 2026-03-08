import { NextResponse } from 'next/server';
import { deleteRegistration } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const password = body.password || '';
        const ticketId = body.ticketId || '';

        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (!ticketId) {
            return NextResponse.json(
                { success: false, message: 'Ticket ID is required' },
                { status: 400 }
            );
        }

        const result = await deleteRegistration(ticketId);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
