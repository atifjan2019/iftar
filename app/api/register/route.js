import { NextResponse } from 'next/server';
import { addRegistration } from '@/lib/data';
import { sendTicketEmail } from '@/lib/email';

export async function POST(request) {
    try {
        const body = await request.json();

        const name = (body.name || '').trim();
        const phone = (body.phone || '').trim();
        const email = (body.email || '').trim();

        // Validation
        if (!name || !phone || !email) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: 'Invalid email address.' },
                { status: 400 }
            );
        }

        const result = await addRegistration({ name, phone, email });

        if (result.duplicate) {
            return NextResponse.json({
                success: true,
                message: 'You are already registered!',
                ticketId: result.ticketId,
                duplicate: true,
            });
        }

        if (result.soldOut) {
            return NextResponse.json({
                success: false,
                message: 'Sorry, all spots have been taken! Registration is now closed.',
                soldOut: true,
            });
        }

        // Send ticket email (non-blocking)
        let emailSent = false;
        try {
            const emailResult = await sendTicketEmail(name, email, result.ticketId);
            emailSent = emailResult.success;
        } catch {
            // Email failure shouldn't block registration
        }

        return NextResponse.json({
            success: true,
            message: 'Registration successful!',
            ticketId: result.ticketId,
            remaining: result.remaining,
            maxTickets: result.maxTickets,
            emailSent,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}
