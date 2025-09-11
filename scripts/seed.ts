import { db } from '../lib/db';
import { categories, users, events } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  try {
    // Create categories
    const categoryData = [
      { name: 'Technology', slug: 'technology', description: 'Tech meetups, conferences, and workshops', color: '#3B82F6', icon: 'laptop' },
      { name: 'Design', slug: 'design', description: 'UI/UX design, graphic design, and creative workshops', color: '#8B5CF6', icon: 'palette' },
      { name: 'Business', slug: 'business', description: 'Networking, entrepreneurship, and business events', color: '#10B981', icon: 'briefcase' },
      { name: 'Education', slug: 'education', description: 'Learning, courses, and educational workshops', color: '#F59E0B', icon: 'book' },
      { name: 'Health', slug: 'health', description: 'Fitness, wellness, and health-related events', color: '#EF4444', icon: 'heart' },
      { name: 'Entertainment', slug: 'entertainment', description: 'Music, art, and entertainment events', color: '#EC4899', icon: 'music' },
    ];

    console.log('Creating categories...');
    await db.insert(categories).values(categoryData);

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const [testUser] = await db.insert(users).values({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      bio: 'A test user for development',
      location: 'San Francisco, CA',
    }).returning();

    console.log('Created test user:', testUser.email);

    // Create sample events
    const eventData = [
      {
        title: 'Tech Meetup 2024',
        description: 'Join us for an evening of networking and tech discussions with industry leaders.',
        date: new Date('2024-03-15T18:00:00Z'),
        time: '6:00 PM',
        location: 'San Francisco, CA',
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
        maxAttendees: 100,
        isOnline: false,
        isPublic: true,
        requiresApproval: false,
        price: 0,
        currency: 'USD',
        creatorId: testUser.id,
      },
      {
        title: 'Design Workshop',
        description: 'Learn the fundamentals of modern UI/UX design with hands-on exercises.',
        date: new Date('2024-03-20T14:00:00Z'),
        time: '2:00 PM',
        location: 'Online',
        category: 'Design',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        maxAttendees: 50,
        isOnline: true,
        isPublic: true,
        requiresApproval: false,
        price: 2500, // $25.00 in cents
        currency: 'USD',
        creatorId: testUser.id,
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch innovative startups pitch their ideas to investors and get feedback.',
        date: new Date('2024-03-25T19:00:00Z'),
        time: '7:00 PM',
        location: 'New York, NY',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
        maxAttendees: 150,
        isOnline: false,
        isPublic: true,
        requiresApproval: true,
        price: 0,
        currency: 'USD',
        creatorId: testUser.id,
      },
    ];

    console.log('Creating sample events...');
    await db.insert(events).values(eventData);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();
