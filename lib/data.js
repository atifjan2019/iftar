import { supabase } from './supabase';

const MAX_TICKETS = 100;

function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'OBI-';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

export async function addRegistration({ name, phone, email }) {
    // Check duplicate email
    const { data: existing } = await supabase
        .from('registrations')
        .select('ticket_id')
        .ilike('email', email)
        .limit(1);

    if (existing && existing.length > 0) {
        return { duplicate: true, ticketId: existing[0].ticket_id };
    }

    // Check capacity
    const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

    if (count >= MAX_TICKETS) {
        return { soldOut: true };
    }

    // Generate ticket ID
    const ticketId = generateTicketId();

    // Insert registration
    const { error } = await supabase.from('registrations').insert({
        name,
        phone,
        email: email.toLowerCase(),
        ticket_id: ticketId,
    });

    if (error) {
        console.error('Supabase insert error:', error);
        throw new Error('Failed to save registration');
    }

    const remaining = MAX_TICKETS - (count + 1);

    return {
        success: true,
        ticketId,
        remaining,
        maxTickets: MAX_TICKETS,
    };
}

export async function getStats() {
    const { data: registrations, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Supabase stats error:', error);
        return { total: 0, remaining: MAX_TICKETS, maxTickets: MAX_TICKETS, registrations: [] };
    }

    const mapped = (registrations || []).map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        email: r.email,
        ticketId: r.ticket_id,
        registeredAt: r.created_at,
    }));

    return {
        total: mapped.length,
        remaining: MAX_TICKETS - mapped.length,
        maxTickets: MAX_TICKETS,
        registrations: mapped,
    };
}

export async function getCount() {
    const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Supabase count error:', error);
        return { total: 0, remaining: MAX_TICKETS, maxTickets: MAX_TICKETS };
    }

    return {
        total: count || 0,
        remaining: MAX_TICKETS - (count || 0),
        maxTickets: MAX_TICKETS,
    };
}
