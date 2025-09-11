import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    
    const sql = neon(DATABASE_URL);
    const body = await request.json();
    const { name, email, phone, notes, ticketCount = 1 } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const [event] = await sql`
      SELECT id, title, max_attendees FROM events WHERE id = ${params.id}
    `;
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user already RSVP'd
    const [existingRSVP] = await sql`
      SELECT id FROM rsvps WHERE event_id = ${params.id} AND email = ${email}
    `;
    
    if (existingRSVP) {
      return NextResponse.json(
        { error: 'You have already RSVP\'d for this event' },
        { status: 409 }
      );
    }

    // Check capacity
    if (event.max_attendees) {
      const [attendeeCount] = await sql`
        SELECT COUNT(*) as count FROM rsvps WHERE event_id = ${params.id} AND status = 'confirmed'
      `;
      
      if (attendeeCount.count + ticketCount > event.max_attendees) {
        return NextResponse.json(
          { error: 'Event is at capacity' },
          { status: 400 }
        );
      }
    }

    // Create RSVP (using a dummy user_id for now)
    const [rsvp] = await sql`
      INSERT INTO rsvps (event_id, user_id, name, email, phone, notes, ticket_count, status)
      VALUES (${params.id}, '3816bc6e-0410-4840-8910-592cdceda08a', ${name}, ${email}, ${phone || null}, ${notes || null}, ${ticketCount}, 'confirmed')
      RETURNING *
    `;

    return NextResponse.json({ 
      rsvp,
      message: 'Successfully RSVP\'d for the event!'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json(
      { error: 'Failed to create RSVP' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    
    const sql = neon(DATABASE_URL);

    // Get all RSVPs for this event
    const rsvps = await sql`
      SELECT * FROM rsvps 
      WHERE event_id = ${params.id} 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}