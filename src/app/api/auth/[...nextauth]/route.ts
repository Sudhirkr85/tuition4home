import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 24 * 60 * 60, // 60 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const cleanEmail = user.email.toLowerCase().trim();
          let dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });

          if (!dbUser) {
            // Auto-create user for Google login
            dbUser = await prisma.user.create({
              data: {
                name: user.name || cleanEmail.split('@')[0],
                email: cleanEmail,
                image: user.image || null,
                role: 'PARENT', // Default to PARENT for general sign in; upgraded to TUTOR if registering as tutor
                emailVerified: new Date(),
                phone: null,
              },
            });
          } else if (user.image && !dbUser.image) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { image: user.image },
            });
          }
          return true;
        } catch (err) {
          console.error('[NEXTAUTH_GOOGLE_SIGNIN_ERROR]:', err);
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        try {
          const cleanEmail = user.email.toLowerCase().trim();
          const dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
            include: { tutorProfile: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.tutorProfile ? 'TUTOR' : dbUser.role;
            token.phone = dbUser.phone || '';
            token.hasTutorProfile = Boolean(dbUser.tutorProfile);
            if (dbUser.image) token.picture = dbUser.image;
          }
        } catch (err) {
          console.error('[NEXTAUTH_JWT_ERROR]:', err);
        }
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const cleanEmail = session.user.email.toLowerCase().trim();
          const dbUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
            include: { tutorProfile: true },
          });
          if (dbUser) {
            (session.user as any).id = dbUser.id;
            (session.user as any).role = dbUser.tutorProfile ? 'TUTOR' : dbUser.role;
            (session.user as any).phone = dbUser.phone || '';
            (session.user as any).hasTutorProfile = Boolean(dbUser.tutorProfile);
            if (dbUser.image) session.user.image = dbUser.image;
          } else if (token?.id) {
            (session.user as any).id = token.id;
            (session.user as any).role = token.hasTutorProfile ? 'TUTOR' : (token.role || 'PARENT');
            (session.user as any).phone = token.phone || '';
            (session.user as any).hasTutorProfile = Boolean(token.hasTutorProfile);
          }
        } catch (err) {
          console.error('[NEXTAUTH_SESSION_ERROR]:', err);
          if (token?.id) {
            (session.user as any).id = token.id;
            (session.user as any).role = token.hasTutorProfile ? 'TUTOR' : (token.role || 'PARENT');
            (session.user as any).phone = token.phone || '';
            (session.user as any).hasTutorProfile = Boolean(token.hasTutorProfile);
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/parent/login',
    error: '/parent/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
