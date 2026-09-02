import { prisma } from '@/lib/prisma';

export interface AuthenticatedAdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'TELECALLER';
}

/**
 * Validates whether an incoming API request comes from an authenticated Admin or Counselor.
 * Checks request headers (x-admin-email, x-admin-id, authorization) and queries database to verify role.
 */
export async function verifyAdminOrCounselor(req: Request): Promise<AuthenticatedAdminUser | null> {
  try {
    const adminEmail = req.headers.get('x-admin-email') || req.headers.get('x-user-email');
    const adminId = req.headers.get('x-admin-id') || req.headers.get('x-user-id');
    const authHeader = req.headers.get('authorization');
    
    // Also check URL search params as fallback
    const url = new URL(req.url);
    const queryEmail = url.searchParams.get('adminEmail') || url.searchParams.get('callerEmail');
    const queryId = url.searchParams.get('adminId') || url.searchParams.get('callerId');

    const targetEmail = (adminEmail || queryEmail)?.toLowerCase().trim();
    const targetId = adminId || queryId;

    if (!targetEmail && !targetId && !authHeader) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(targetEmail ? [{ email: targetEmail }] : []),
          ...(targetId ? [{ id: targetId }] : []),
        ],
        role: {
          in: ['SUPER_ADMIN', 'TELECALLER'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'TELECALLER')) {
      return null;
    }

    return user as AuthenticatedAdminUser;
  } catch (err) {
    console.error('[AUTH_VERIFICATION_ERROR]:', err);
    return null;
  }
}
