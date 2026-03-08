import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getSupabase();
        const { count, error } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Keep-alive ping failed:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Supabase pinged successfully',
            registrations: count,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
