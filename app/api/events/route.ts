import { NextResponse } from 'next/server';
import seedData from '../../../data/seed-events.json';

export async function GET() {
  try {
    return NextResponse.json(seedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}