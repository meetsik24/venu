import { NextRequest } from 'next/server';
import { sessionQueries } from '@/lib/db/queries';

export async function getCurrentUser(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    const session = await sessionQueries.findByToken(token);
    
    if (!session || new Date() > session.expiresAt) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, user);
  };
}
