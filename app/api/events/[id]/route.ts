import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

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
    
    const [event] = await sql`
      SELECT 
        e.*,
        u.id as creator_id,
        u.name as creator_name,
        u.avatar as creator_avatar,
        COUNT(r.id) as attendee_count
      FROM events e
      LEFT JOIN users u ON e.creator_id = u.id
      LEFT JOIN rsvps r ON e.id = r.event_id AND r.status = 'confirmed'
      WHERE e.id = ${params.id}
      GROUP BY e.id, u.id, u.name, u.avatar
    `;
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      maxAttendees,
      isOnline,
      isPublic,
      requiresApproval,
      price,
      currency,
      metadata,
    } = body;

    const [event] = await sql`
      UPDATE events SET
        title = ${title},
        description = ${description},
        date = ${date ? new Date(date) : undefined},
        time = ${time},
        location = ${location},
        category = ${category},
        image = ${image || null},
        max_attendees = ${maxAttendees ? parseInt(maxAttendees) : null},
        is_online = ${isOnline},
        is_public = ${isPublic},
        requires_approval = ${requiresApproval},
        price = ${price ? parseInt(price) : 0},
        currency = ${currency || 'USD'},
        metadata = ${metadata ? JSON.stringify(metadata) : null},
        updated_at = now()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    
    const sql = neon(DATABASE_URL);
    
    await sql`DELETE FROM events WHERE id = ${params.id}`;
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}