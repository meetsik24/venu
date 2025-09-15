import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_iRBc4rnPIb6x@ep-rough-recipe-ae6zrkgk-pooler.c-2.us-east-2.aws.neon.tech/venu?sslmode=require&channel_binding=require";

const sql = neon(DATABASE_URL);

async function addRSVPs() {
  try {
    console.log('Adding RSVPs to the Elixir meetup...');
    
    const eventId = 'd53cb0f4-8321-408c-9f4d-05767ebbae62';
    
    const rsvps = [
      {
        name: "Fatima Bakari",
        email: "dahliafatima15@gmail.com",
        phone: "0687610820",
        ticketCount: 1,
        notes: "RSVP Date: 15/09/2025"
      },
      {
        name: "Kelvin Hemu",
        email: "kelvinhemu@gmail.com",
        phone: "0786502070",
        ticketCount: 1,
        notes: "RSVP Date: 15/09/2025"
      },
      {
        name: "Sikjunior Mrimi",
        email: "sik@briq.tz",
        phone: "0788344348",
        ticketCount: 1,
        notes: "RSVP Date: 15/09/2025"
      }
    ];
    
    for (const rsvpData of rsvps) {
      // Check if user already exists
      let userId;
      const [existingUser] = await sql`
        SELECT id FROM users WHERE email = ${rsvpData.email}
      `;
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create a guest user
        const [newUser] = await sql`
          INSERT INTO users (name, email, password, created_at, updated_at)
          VALUES (${rsvpData.name}, ${rsvpData.email}, 'guest', NOW(), NOW())
          RETURNING id
        `;
        userId = newUser.id;
      }
      
      // Check if RSVP already exists
      const [existingRSVP] = await sql`
        SELECT id FROM rsvps WHERE event_id = ${eventId} AND email = ${rsvpData.email}
      `;
      
      if (existingRSVP) {
        console.log(`⚠️  RSVP already exists for ${rsvpData.name} (${rsvpData.email})`);
        continue;
      }
      
      // Create RSVP
      const [rsvp] = await sql`
        INSERT INTO rsvps (event_id, user_id, name, email, phone, notes, ticket_count, status)
        VALUES (${eventId}, ${userId}, ${rsvpData.name}, ${rsvpData.email}, ${rsvpData.phone}, ${rsvpData.notes}, ${rsvpData.ticketCount}, 'confirmed')
        RETURNING id, name, email
      `;
      
      console.log(`✅ RSVP created for ${rsvp.name} (${rsvp.email})`);
    }
    
    // Get updated attendee count
    const [attendeeCount] = await sql`
      SELECT COUNT(*) as count FROM rsvps WHERE event_id = ${eventId} AND status = 'confirmed'
    `;
    
    console.log(`🎉 All RSVPs added successfully!`);
    console.log(`📊 Total attendees: ${attendeeCount.count}`);
    
  } catch (error) {
    console.error('❌ Failed to add RSVPs:', error);
    process.exit(1);
  }
}

addRSVPs();
