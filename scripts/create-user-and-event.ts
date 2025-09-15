import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_iRBc4rnPIb6x@ep-rough-recipe-ae6zrkgk-pooler.c-2.us-east-2.aws.neon.tech/venu?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function createUserAndEvent() {
  try {
    console.log('Creating user and event...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('Madeofblack@123', 12);
    
    // Create the user
    const [user] = await sql`
      INSERT INTO users (id, name, email, password, bio, location, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'sikjunior', 
        'sik@briq.tz', 
        ${hashedPassword}, 
        'Elixir Developer from Dar es Salaam', 
        'Dar es Salaam, Tanzania',
        NOW(),
        NOW()
      )
      RETURNING id, name, email
    `;
    console.log('✅ User created:', user);
    
    // Create the event with the specific ID
    const eventId = 'd53cb0f4-8321-408c-9f4d-05767ebbae62';
    const eventDate = new Date('2025-09-27T09:00:00Z');
    
    const [event] = await sql`
      INSERT INTO events (
        id, title, description, date, time, location, category, 
        image, max_attendees, is_online, is_public, requires_approval, 
        price, currency, creator_id, created_at, updated_at
      )
      VALUES (
        ${eventId},
        'Dar es salaam Elixir Meetup',
        'Elixir Devs, let''s meet in Dar Es Salaam for the first-ever edition of GEMs!',
        ${eventDate},
        '09:00',
        'Victoria Noble Centre, 4 Floor, Office 406',
        'Technology',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
        50,
        false,
        true,
        false,
        0,
        'USD',
        ${user.id},
        NOW(),
        NOW()
      )
      RETURNING id, title, description, date, time, location
    `;
    console.log('✅ Event created:', event);
    
    console.log('🎉 User and event created successfully!');
    console.log(`Event ID: ${eventId}`);
    console.log(`User ID: ${user.id}`);
    
  } catch (error) {
    console.error('❌ Creation failed:', error);
    process.exit(1);
  }
}

createUserAndEvent();
