import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_iRBc4rnPIb6x@ep-rough-recipe-ae6zrkgk-pooler.c-2.us-east-2.aws.neon.tech/venu?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function seedTestData() {
  try {
    console.log('Seeding test data...');
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const [user] = await sql`
      INSERT INTO users (name, email, password, bio, location)
      VALUES ('Test User', 'test@example.com', ${hashedPassword}, 'A test user', 'San Francisco, CA')
      RETURNING id, name, email
    `;
    console.log('✅ Test user created:', user);
    
    // Create categories
    const categories = [
      { name: 'Technology', slug: 'technology', description: 'Tech meetups and conferences', color: '#3B82F6', icon: 'laptop' },
      { name: 'Design', slug: 'design', description: 'UI/UX design workshops', color: '#8B5CF6', icon: 'palette' },
      { name: 'Business', slug: 'business', description: 'Networking and entrepreneurship', color: '#10B981', icon: 'briefcase' }
    ];
    
    for (const category of categories) {
      await sql`
        INSERT INTO categories (name, slug, description, color, icon)
        VALUES (${category.name}, ${category.slug}, ${category.description}, ${category.color}, ${category.icon})
        ON CONFLICT (name) DO NOTHING
      `;
    }
    console.log('✅ Categories created');
    
    // Create test events
    const events = [
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
        creatorId: user.id
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
        creatorId: user.id
      }
    ];
    
    for (const event of events) {
      const [createdEvent] = await sql`
        INSERT INTO events (title, description, date, time, location, category, image, max_attendees, is_online, is_public, requires_approval, price, currency, creator_id)
        VALUES (${event.title}, ${event.description}, ${event.date}, ${event.time}, ${event.location}, ${event.category}, ${event.image}, ${event.maxAttendees}, ${event.isOnline}, ${event.isPublic}, ${event.requiresApproval}, ${event.price}, ${event.currency}, ${event.creatorId})
        RETURNING id, title
      `;
      console.log('✅ Event created:', createdEvent);
    }
    
    console.log('🎉 Test data seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedTestData();
