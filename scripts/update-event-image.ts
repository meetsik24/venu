import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_iRBc4rnPIb6x@ep-rough-recipe-ae6zrkgk-pooler.c-2.us-east-2.aws.neon.tech/venu?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function updateEventImage() {
  try {
    console.log('Updating event image...');
    
    // Update the event with a proper Elixir-related image
    const [event] = await sql`
      UPDATE events 
      SET image = 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
      WHERE id = 'd53cb0f4-8321-408c-9f4d-05767ebbae62'
      RETURNING id, title, image
    `;
    
    console.log('✅ Event image updated:', event);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateEventImage();
