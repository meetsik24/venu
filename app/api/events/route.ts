import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { getEventImage } from '@/lib/eventImages';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      return NextResponse.json({ error: 'DATABASE_URL not set' }, { status: 500 });
    }
    
    const sql = neon(DATABASE_URL);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Simple query for now - we can add filtering later
    const events = await sql`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.date,
        e.time,
        e.location,
        e.category,
        e.image,
        e.max_attendees,
        e.is_online,
        e.is_public,
        e.requires_approval,
        e.price,
        e.currency,
        e.created_at,
        u.id as creator_id,
        u.name as creator_name,
        u.avatar as creator_avatar,
        COUNT(r.id) as attendee_count
      FROM events e
      LEFT JOIN users u ON e.creator_id = u.id
      LEFT JOIN rsvps r ON e.id = r.event_id AND r.status = 'confirmed'
      WHERE e.is_public = true
      GROUP BY e.id, u.id, u.name, u.avatar
      ORDER BY e.created_at DESC
    `;

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

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
      creatorId,
    } = body;

    // Validate required fields
    if (!title || !description || !date || !time || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure user can only create events for themselves
    if (creatorId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate image URL based on category
    const imageUrl = getEventImage(category, title);

    // Create the event
    const [event] = await sql`
      INSERT INTO events (
        title, description, date, time, location, category, image,
        max_attendees, is_online, is_public, requires_approval,
        price, currency, metadata, creator_id
      )
      VALUES (
        ${title}, ${description}, ${new Date(date)}, ${time}, ${location}, ${category}, ${imageUrl},
        ${maxAttendees ? parseInt(maxAttendees) : null}, ${isOnline || false}, ${isPublic !== false}, ${requiresApproval || false},
        ${price ? parseInt(price) : 0}, ${currency || 'USD'}, ${metadata ? JSON.stringify(metadata) : null}, ${creatorId}
      )
      RETURNING *
    `;

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}