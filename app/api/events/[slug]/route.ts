import { NextResponse } from 'next/server';
import seedData from '../../../../data/seed-events.json';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const event = seedData.events.find(event => event.slug === params.slug);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}