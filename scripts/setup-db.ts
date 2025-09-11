import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_iRBc4rnPIb6x@ep-rough-recipe-ae6zrkgk-pooler.c-2.us-east-2.aws.neon.tech/venu?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful:', result);
    
    // Create tables manually
    console.log('Creating tables...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL UNIQUE,
        name varchar(255) NOT NULL,
        password text NOT NULL,
        avatar text,
        bio text,
        location varchar(255),
        website text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ Users table created');
    
    // Create categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(100) NOT NULL UNIQUE,
        slug varchar(100) NOT NULL UNIQUE,
        description text,
        color varchar(7),
        icon varchar(50),
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `;
    console.log('✅ Categories table created');
    
    // Create events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title varchar(255) NOT NULL,
        description text NOT NULL,
        date timestamp NOT NULL,
        time varchar(50) NOT NULL,
        location varchar(255) NOT NULL,
        category varchar(100) NOT NULL,
        image text,
        max_attendees integer,
        is_online boolean DEFAULT false NOT NULL,
        is_public boolean DEFAULT true NOT NULL,
        requires_approval boolean DEFAULT false NOT NULL,
        price integer DEFAULT 0 NOT NULL,
        currency varchar(3) DEFAULT 'USD' NOT NULL,
        metadata jsonb,
        creator_id uuid NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ Events table created');
    
    // Create rsvps table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id uuid NOT NULL,
        user_id uuid NOT NULL,
        status varchar(20) DEFAULT 'pending' NOT NULL,
        notes text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ RSVPs table created');
    
    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL,
        token text NOT NULL UNIQUE,
        expires_at timestamp NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    console.log('✅ Sessions table created');
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
