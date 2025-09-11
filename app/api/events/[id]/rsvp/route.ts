import { NextRequest, NextResponse } from 'next/server';
import { rsvpQueries, eventQueries } from '@/lib/db/queries';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId, status = 'pending', notes } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await eventQueries.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user already has an RSVP
    const existingRsvp = await rsvpQueries.findByEventAndUser(params.id, userId);
    
    if (existingRsvp) {
      // Update existing RSVP
      const updatedRsvp = await rsvpQueries.updateStatus(existingRsvp.id, status);
      return NextResponse.json({ rsvp: updatedRsvp });
    } else {
      // Create new RSVP
      const rsvp = await rsvpQueries.create({
        eventId: params.id,
        userId,
        status,
        notes,
      });
      return NextResponse.json({ rsvp }, { status: 201 });
    }
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
    const rsvps = await rsvpQueries.findByEvent(params.id);
    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
