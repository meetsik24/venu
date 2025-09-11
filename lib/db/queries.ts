import { eq, desc, and, or, like, count } from 'drizzle-orm';
import { db } from './index';
import { users, events, rsvps, categories, sessions } from './schema';

// User queries
export const userQueries = {
  async create(userData: {
    email: string;
    name: string;
    password: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  }) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async update(id: string, userData: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  },
};

// Event queries
export const eventQueries = {
  async create(eventData: {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    category: string;
    image?: string;
    maxAttendees?: number;
    isOnline?: boolean;
    isPublic?: boolean;
    requiresApproval?: boolean;
    price?: number;
    currency?: string;
    metadata?: any;
    creatorId: string;
  }) {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  },

  async findById(id: string) {
    const [event] = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        time: events.time,
        location: events.location,
        category: events.category,
        image: events.image,
        maxAttendees: events.maxAttendees,
        isOnline: events.isOnline,
        isPublic: events.isPublic,
        requiresApproval: events.requiresApproval,
        price: events.price,
        currency: events.currency,
        metadata: events.metadata,
        creatorId: events.creatorId,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
        creator: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(events)
      .leftJoin(users, eq(events.creatorId, users.id))
      .where(eq(events.id, id));
    return event;
  },

  async findMany(filters?: {
    category?: string;
    search?: string;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        time: events.time,
        location: events.location,
        category: events.category,
        image: events.image,
        maxAttendees: events.maxAttendees,
        isOnline: events.isOnline,
        isPublic: events.isPublic,
        requiresApproval: events.requiresApproval,
        price: events.price,
        currency: events.currency,
        createdAt: events.createdAt,
        creator: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(events)
      .leftJoin(users, eq(events.creatorId, users.id));

    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(events.category, filters.category));
    }
    
    if (filters?.isPublic !== undefined) {
      conditions.push(eq(events.isPublic, filters.isPublic));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(events.title, `%${filters.search}%`),
          like(events.description, `%${filters.search}%`),
          like(events.location, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    query = query.orderBy(desc(events.createdAt));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  },

  async update(id: string, eventData: Partial<typeof events.$inferInsert>) {
    const [event] = await db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return event;
  },

  async delete(id: string) {
    await db.delete(events).where(eq(events.id, id));
  },

  async getAttendeeCount(eventId: string) {
    const [result] = await db
      .select({ count: count() })
      .from(rsvps)
      .where(and(eq(rsvps.eventId, eventId), eq(rsvps.status, 'confirmed')));
    return result.count;
  },
};

// RSVP queries
export const rsvpQueries = {
  async create(rsvpData: {
    eventId: string;
    userId: string;
    status?: string;
    notes?: string;
  }) {
    const [rsvp] = await db.insert(rsvps).values(rsvpData).returning();
    return rsvp;
  },

  async findByEventAndUser(eventId: string, userId: string) {
    const [rsvp] = await db
      .select()
      .from(rsvps)
      .where(and(eq(rsvps.eventId, eventId), eq(rsvps.userId, userId)));
    return rsvp;
  },

  async findByEvent(eventId: string) {
    return await db
      .select({
        id: rsvps.id,
        status: rsvps.status,
        notes: rsvps.notes,
        createdAt: rsvps.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatar: users.avatar,
          email: users.email,
        },
      })
      .from(rsvps)
      .leftJoin(users, eq(rsvps.userId, users.id))
      .where(eq(rsvps.eventId, eventId))
      .orderBy(desc(rsvps.createdAt));
  },

  async updateStatus(id: string, status: string) {
    const [rsvp] = await db
      .update(rsvps)
      .set({ status, updatedAt: new Date() })
      .where(eq(rsvps.id, id))
      .returning();
    return rsvp;
  },

  async delete(id: string) {
    await db.delete(rsvps).where(eq(rsvps.id, id));
  },
};

// Category queries
export const categoryQueries = {
  async create(categoryData: {
    name: string;
    slug: string;
    description?: string;
    color?: string;
    icon?: string;
  }) {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  },

  async findMany() {
    return await db.select().from(categories).orderBy(categories.name);
  },

  async findBySlug(slug: string) {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  },
};

// Session queries
export const sessionQueries = {
  async create(sessionData: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) {
    const [session] = await db.insert(sessions).values(sessionData).returning();
    return session;
  },

  async findByToken(token: string) {
    const [session] = await db
      .select({
        id: sessions.id,
        userId: sessions.userId,
        token: sessions.token,
        expiresAt: sessions.expiresAt,
        createdAt: sessions.createdAt,
        user: {
          id: users.id,
          email: users.email,
          name: users.name,
          avatar: users.avatar,
        },
      })
      .from(sessions)
      .leftJoin(users, eq(sessions.userId, users.id))
      .where(eq(sessions.token, token));
    return session;
  },

  async delete(token: string) {
    await db.delete(sessions).where(eq(sessions.token, token));
  },

  async deleteByUserId(userId: string) {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  },
};
