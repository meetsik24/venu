import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user's events
    const events = await sql`
      SELECT
        e.id, e.title, e.description, e.date, e.time, e.location, e.category, e.image,
        e.max_attendees, e.is_online, e.is_public, e.requires_approval, e.price, e.currency,
        e.created_at, e.updated_at, e.creator_id,
        COUNT(r.id) AS attendee_count
      FROM events e
      LEFT JOIN rsvps r ON e.id = r.event_id AND r.status = 'confirmed'
      WHERE e.creator_id = ${decoded.userId}
      GROUP BY e.id
      ORDER BY e.date ASC;
    `;

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
